import { inputKindConfig } from './config'
import { FileContents, InputKind, UploadedFileMap } from './types';

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

export const generate = (filesMap: UploadedFileMap): UploadedFileMap => {
  let newMap: UploadedFileMap = {}

  Object.values(filesMap).forEach(uploadedFile => {
    newMap[uploadedFile.file.name] = {
      ...uploadedFile,
      normalizedData: normalize(uploadedFile.data, uploadedFile.kind),
    }
  })

  console.log("Final stuff:")
  console.log(newMap)
  return newMap
}
