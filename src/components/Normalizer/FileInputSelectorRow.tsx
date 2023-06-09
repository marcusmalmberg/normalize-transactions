import React from "react"

import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import { inputKindConfig } from './config'
import { InputKind, UploadedFile } from "./types";

interface FileInputSelectorProps {
  inputFile: UploadedFile;
  onChange: (file: File, kind: InputKind) => void;
}

const FileInputSelectorRow = ({ inputFile, onChange }: FileInputSelectorProps): JSX.Element => {
  const handleChange = (event: SelectChangeEvent) => { onChange(inputFile.file, event.target.value as InputKind) }

  return <tr>
    <td>
      {inputFile.file.name}
    </td>
    <td>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel>Fält</InputLabel>
        <Select
          value={inputFile.kind}
          onChange={handleChange}
          label="Typ"
        >
          {(Object.keys(InputKind) as Array<keyof typeof InputKind>).map((kind) =>
            <MenuItem key={kind} value={InputKind[kind]}>{inputKindConfig[InputKind[kind]].name}</MenuItem>
          )}
        </Select>
      </FormControl>
    </td>
  </tr>
}
export default FileInputSelectorRow
