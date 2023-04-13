import { InputKind } from "./FileInputSelector"
import { FileContents } from "./normalize"

interface InputKindConfigType {
  name: string
  numberOfMetaRows: number
  accountName: string | ((data: FileContents) => string)
  dateCol: number
  descriptionCol: number
  valueCol: number
  valueMultiplier?: 1 | -1
}

type InputKindConfigTypeMap = {
  [key in InputKind]: InputKindConfigType
}

export const inputKindConfig: InputKindConfigTypeMap = {
  [InputKind.AMEX]: {
    name: "AMEX",
    numberOfMetaRows: 6,
    accountName: 'AMEX',
    dateCol: 0,
    descriptionCol: 1,
    valueCol: 4,
    valueMultiplier: -1,
  },
  [InputKind.SEB]: {
    name: "SEB",
    numberOfMetaRows: 4,
    accountName: (data: FileContents) => (Object.values(data[1])[0] as string),
    dateCol: 1,
    descriptionCol: 3,
    valueCol: 4,
  },
  [InputKind.SWEDBANK]: {
    name: "Swedbank",
    numberOfMetaRows: 6,
    accountName: (data: FileContents) => (Object.keys(data[0])[0] as string),
    dateCol: 2,
    descriptionCol: 5,
    valueCol: 6,
  },

  [InputKind.UNSURE]: { // TODO: Remove UNSURE kind.
    name: "UNSURE_FIX_ME",
    numberOfMetaRows: 6,
    accountName: "unsure",
    dateCol: 0,
    descriptionCol: 1,
    valueCol: 4,
  },
}
