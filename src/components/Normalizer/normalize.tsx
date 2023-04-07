import { read, utils, WorkSheet } from 'xlsx'

import { UploadedFileMap } from './index'
import { InputKind } from "./FileInputSelector"

export interface FileContents extends Array<any> { }

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

  switch (kind) {
    case InputKind.AMEX:
      return normalizeAMEX(data)

    case InputKind.SEB:
      return normalizeSEB(data)

    case InputKind.SWEDBANK:
      return normalizeSWEDBANK(data)

    default:
      throw(`Missing normalizer for "${kind}"!`)
  }
}

const normalizeSEB = (data: FileContents): FileContents => {
  const accountName = Object.values(data[1])[0]
  let newData = data.slice(4)
  newData = newData.map((row: Array<any>) => {
    let rowValues = Object.values(row)
    return [accountName, rowValues[1], rowValues[3], parseInt(rowValues[4], 10)]
  })
  return newData
}

const normalizeSWEDBANK = (data: FileContents): FileContents => {
  const accountName = Object.keys(data[0])[0]
  let newData = data.slice(6)
  newData = newData.map((row: Array<any>) => {
    let rowValues = Object.values(row)
    return [accountName, rowValues[2], rowValues[5], parseInt(rowValues[6], 10)]
  })
  return newData
}

const normalizeAMEX = (data: FileContents): FileContents => {
  const accountName = "Amex"
  let newData = data.slice(6)
  newData = newData.map((row: Array<any>) => {
    let rowValues = Object.values(row)
    const formattedDate = new Date(Date.parse(rowValues[0])).toLocaleDateString('SV-se')
    return [accountName, formattedDate, rowValues[1], parseInt(rowValues[4], 10) * -1]
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
