import { read, utils, WorkSheet } from "xlsx"

import { inputKindConfig } from "./config"
import { FileContents, InputKind } from "./types"

export const tryAutoDetectInputKind = (data: FileContents): InputKind | undefined => {
  for(const [inputKindStr, config] of Object.entries(inputKindConfig)) {
    if(config.autoDetect(data)) {
      return inputKindStr as InputKind
    }
  }
}

export const copyDOMTableToClipboard = async (tableElement: HTMLElement) => {
  let text = tableElement?.innerText;
  try {
    await navigator.clipboard.writeText(text);
    console.log('Content copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

export const convertXlsToJson = async (file: File): Promise<FileContents> => {
  const content = await file.arrayBuffer()
  const workbook = read(content)
  let worksheet = workbook.Sheets[workbook.SheetNames[0]]
  update_sheet_range(worksheet) // Fixes problem with swedbank xlsx files
  const data = utils.sheet_to_json(worksheet)
  return data
}

// https://docs.sheetjs.com/docs/miscellany/errors#worksheet-only-includes-one-row-of-data
function update_sheet_range(ws: WorkSheet) {
  var range = { s: { r: Infinity, c: Infinity }, e: { r: 0, c: 0 } }
  Object.keys(ws).filter(function (x) { return x.charAt(0) != "!"; }).map(utils.decode_cell).forEach(function (x) {
    range.s.c = Math.min(range.s.c, x.c); range.s.r = Math.min(range.s.r, x.r)
    range.e.c = Math.max(range.e.c, x.c); range.e.r = Math.max(range.e.r, x.r)
  });
  ws['!ref'] = utils.encode_range(range)
}
