import { read, utils, WorkSheet } from 'xlsx'

import { inputKindConfig } from './config'
import { FileContents, InputKind, UploadedFileMap } from './types';

// https://docs.sheetjs.com/docs/miscellany/errors#worksheet-only-includes-one-row-of-data
function update_sheet_range(ws: WorkSheet) {
  var range = { s: { r: Infinity, c: Infinity }, e: { r: 0, c: 0 } };
  Object.keys(ws).filter(function (x) { return x.charAt(0) != "!"; }).map(utils.decode_cell).forEach(function (x) {
    range.s.c = Math.min(range.s.c, x.c); range.s.r = Math.min(range.s.r, x.r);
    range.e.c = Math.max(range.e.c, x.c); range.e.r = Math.max(range.e.r, x.r);
  });
  ws['!ref'] = utils.encode_range(range);
}

const convertXlsToJson = async (file: File): Promise<FileContents> => {
  const content = await file.arrayBuffer()
  const workbook = read(content)
  let worksheet = workbook.Sheets[workbook.SheetNames[0]]
  update_sheet_range(worksheet) // Fixes problem with swedbank xlsx files
  const data = utils.sheet_to_json(worksheet)
  return data
}

const normalize = (data: FileContents, kind: InputKind): FileContents => {
  const config = inputKindConfig[kind]
  let accountName = typeof config.accountName === 'string' && config.accountName
  let date
  let description
  let value

  let newData = data.slice(config.numberOfMetaRows)
  let rowValues
  newData = newData.map((row: Array<any>) => {
    rowValues = Object.values(row)
    accountName ||= typeof config.accountName === 'function' && config.accountName(data) || 'not set'
    date = new Date(Date.parse(rowValues[config.dateCol])).toLocaleDateString('SV-se')
    description = rowValues[config.descriptionCol]
    value = parseInt(rowValues[config.valueCol], 10) * (config.valueMultiplier || 1)
    return [accountName, date, description, value]
  })

  return newData
}

export const generate = async (filesMap: UploadedFileMap): Promise<UploadedFileMap> => {
  let newMap: UploadedFileMap = {}

  await Promise.all(Object.values(filesMap).map(async uploadedFile => {

    console.log("processing: ", uploadedFile.file.name)
    const data = await convertXlsToJson(uploadedFile.file)
    console.log("Done processing: ", uploadedFile.file.name)

    newMap[uploadedFile.file.name] = {
      ...uploadedFile,
      data: normalize(data, uploadedFile.kind),
    }
  }))

  console.log("Final stuff:")
  console.log(newMap)
  return newMap
}
