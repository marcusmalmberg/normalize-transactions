import React from "react"

import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import { UploadedFile } from './index'

export enum InputKind {
  UNSURE = "unsure",
  AMEX = "amex",
  SEB = "seb",
  SWEDBANK = "swedbank",
}

interface FileInputSelectorProps {
  inputFile: UploadedFile;
  onChange: (file: File, kind: InputKind) => void;
}

const FileInputSelector = ({ inputFile, onChange }: FileInputSelectorProps): JSX.Element => {

  const handleChange = (event: SelectChangeEvent) => { onChange(inputFile.file, event.target.value as InputKind) }

  return <div>
    {inputFile.file.name}
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel>Fält</InputLabel>
      <Select
        value={inputFile.kind}
        onChange={handleChange}
        label="Typ"
      >
        {(Object.keys(InputKind) as Array<keyof typeof InputKind>).map((kind) =>
          <MenuItem key={kind} value={InputKind[kind]}>{InputKind[kind]}</MenuItem>
        )}
      </Select>
    </FormControl>
  </div>
}
export default FileInputSelector
