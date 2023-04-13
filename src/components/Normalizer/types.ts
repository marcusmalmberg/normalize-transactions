export interface UploadedFile {
  file: File;
  kind?: InputKind,
  data: FileContents,
  normalizedData?: FileContents,
}

export interface UploadedFileMap {
  [handle: string]: UploadedFile;
}

export enum InputKind {
  AMEX = "amex",
  SEB = "seb",
  SWEDBANK = "swedbank",
}

export interface FileContents extends Array<any> { }
