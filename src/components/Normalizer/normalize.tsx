import { inputKindConfig } from './config'
import { FileContents, InputKind, UploadedFileMap } from './types';

const normalize = (data: FileContents, kind: InputKind): FileContents => {
  const config = inputKindConfig[kind]
  let accountName = typeof config.accountName === 'string' && config.accountName
  let date
  let description
  let value
  let category

  let newData = data.slice(config.numberOfMetaRows)
  let rowValues
  newData = newData.map((row: Array<any>) => {
    rowValues = Object.values(row)
    accountName ||= typeof config.accountName === 'function' && config.accountName(data) || 'not set'
    date = new Date(Date.parse(rowValues[config.dateCol])).toLocaleDateString('SV-se')
    description = rowValues[config.descriptionCol]
    value = parseInt(rowValues[config.valueCol], 10) * (config.valueMultiplier || 1)
    category = autoDetectCategory(kind, description, value)
    return [accountName, date, description, value, category]
  })

  return newData
}

const autoDetectCategory = (kind: InputKind, description: string, value: number ) => {
  description = description.trim()
  description = description.replaceAll(/\s+/g, ' ')
  if(description === "CENTRALA STUDIESTÖDSNÄMN") return "CSN Caroline"
  if(description === "Centrala studies") return "CSN Marcus"
  if(description === "FOLKTANDVÅRD") return "Tandvården Caroline"

  if(description === "AMAZON PRIME WWW.AMAZON.SE") return "Prime"
  if(description.startsWith("NETFLIX.COM")) return "Netflix"
  if(description.startsWith("HBO MAX /")) return "HBO"
  if(description === "SPOTIFY STOCKHOLM") return "Spotify"
  if(description === "PAYEX SVERIGE AB/HEMFRID") return "Hemfrid"
  if(description === "SVERIGES INGENJÖRER") return "Sveriges Ingenjörer"

  if(description.startsWith("HEMKÖP")) return "Mat - hemma (inklusive allt från Mathem)"
  if(description.startsWith("ICA")) return "Mat - hemma (inklusive allt från Mathem)"
  if(description === "WOLT STOCKHOLM") return "Mat - Restaurang/Take away"
  if(description === "FOODORA AB STOCKHOLM") return "Mat - Restaurang/Take away"

  if(description === "SL STOCKHOLM") return "Kollektivtrafik"
  if(description === "SL") return "Kollektivtrafik"
  if(description.startsWith("SL /")) return "Kollektivtrafik"
  if(description === "EASYPARK STOCKHOLM") return "Parkering - ej hemma"
  if(description.startsWith("PARKSTER ")) return "Parkering - ej hemma"

  if(description === "KLARNA STOCKHOLM") return "Klarna"
  if(description === "KLARNA BANK") return "Klarna"
  if(description.startsWith("AMAZONRETAIL")) return "Amazon"
  if(description.startsWith("AMAZONMKTPLC")) return "Amazon"

  if(description.startsWith("HEROKU")) return "Övrigt återkommande"
  if(description === "AWS EMEA AWS.AMAZON.CO") return "Övrigt återkommande"
  if(description === "GOOGLE *GOOGLE STORAGE G.CO/HELPPAY#") return "Google (lagring)"
  if(description === "AVGIFT KORT") return "Kortavgifter"

  if(description === "52220011968") return "Intern överföring" // Caroline Vardagsekonomi
  if(description === "56580076852") return "Intern överföring" // Gemensamt kort
  if(description === "92527399894") return "Intern överföring" // Caroline SBAB
  if(description === "59091334673") return "Intern överföring" // Caroline Personallönekonto
  if(description === "53572967201") return "Intern överföring" // Caroline Bra Sparande
  if(description === "52350107922") return "Intern överföring" // Gemensamt betal
  if(description === "CAROLINE MAL") return "Intern överföring"
  if(description.startsWith("Överföring G ")) return "Intern överföring"
  if(description === "Överföring hyra") return "Intern överföring"
  if(description === "Överföring matmarcus") return "Intern överföring"
  if(description === "GEMENSAM BET") return "Intern överföring"
  if(description === "BRA SPAR") return "Intern överföring"
  if(description === "RESA") return "Intern överföring"
  if(description === "INREDNING") return "Intern överföring"
  if(description === "TRANSPORT") return "Intern överföring"
  if(description === "FAMILJ") return "Intern överföring"
  if(description === "GEMENSAM BUF") return "Intern överföring"
  if(description === "MAT CAROLINE") return "Intern överföring"
  if(description === "Överföring via internet") return "Intern överföring"
  if(description === "HYRA M") return "Intern överföring"
  if(description === "MARCUS MALMB") return "Intern överföring"
  if(description === "CAROLINE ALV") return "Intern överföring"

  if(description === "BARNBDR") return "Barnbidrag C & M"
  if(description === "Barnbidrag") return "Barnbidrag C & M"

  if(description === "VATTENFALL KUNDSERVICE A") return "El"
  if(description === "LÅN 41744138") return "Amortering + ränta"
  if(description === "LÅN 41744111") return "Amortering + ränta"
  if(description === "LÅN 41744103") return "Amortering + ränta"
  if(description === "LÅN 41744081") return "Amortering + ränta"
  if(description === "BRF ALMEN 6") return "Hyra inkl. balkongfond"

  if(description === "BARNBIDRAG A") return "Sparande Todd/knodd "
  if(description === "Överföring barnbidrag") return "Sparande Todd/knodd "
  if(description === "Överföring Pension" && kind === InputKind.SWEDBANK) return "Pension M"
  if(description === "PREMIE FÖRS.") return "Pension C"
  if(description === "Överföring 821720032504946" && kind === InputKind.SWEDBANK) return "ISK Marcus"
  if(description === "ISK FOND" && kind === InputKind.SEB) return "ISK Caroline"
  if(description === "LÖN" && kind === InputKind.SEB) return "Insättning Caroline - Lön"
  if(description === "FKASSA" && kind === InputKind.SEB) return "Insättning Caroline - Försäkringskassan"
  if(description === "LÖN" && kind === InputKind.SWEDBANK) return "Insättning Marcus - Lön"
  if(description === "FKASSA" && kind === InputKind.SWEDBANK) return "Insättning Marcus - Försäkringskassan"

  return ""
}

export const generate = (filesMap: UploadedFileMap): UploadedFileMap => {
  let newMap: UploadedFileMap = {}

  Object.values(filesMap).forEach(uploadedFile => {
    newMap[uploadedFile.file.name] = {
      ...uploadedFile,
      normalizedData: uploadedFile.kind && normalize(uploadedFile.data, uploadedFile.kind),
    }
  })

  console.log("Final stuff:")
  console.log(newMap)
  return newMap
}
