import React, { useState } from "react"
import FileUpload from 'react-material-file-upload';
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Container from "@mui/material/Container"

import Title from '../Title'
import FileInputSelector, { InputKind } from "./FileInputSelector"

const Item = ({ children }: { children: any }): JSX.Element => {
  return <div>{children}</div>
}

export interface UploadedFile {
  file: File;
  kind: InputKind,
}

interface UploadedFileMap {
  [handle: string]: UploadedFile;
}

const Normalizer = (): JSX.Element => {
  const [inputFiles, setInputFiles] = useState<File[]>([]);
  const [files, setFiles] = useState<UploadedFileMap>({});

  const handleUpload = (files: File[]) => {
    setInputFiles(files)
    let fileMap: UploadedFileMap = {}
    files.forEach((file: File) => {
      fileMap[file.name] = {
        file,
        kind: InputKind.Unsure,
      }
    })
    setFiles(fileMap)
  }

  const handleFileKindChanged = (file: File, kind: InputKind) => {
    setFiles({
      ...files,
      [file.name]: {
        ...files[file.name],
        kind: kind,
      },
    })
  }

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: '100vh' }}>
      <Container>
        <br />
        <Grid container spacing={2}>

          <Grid item xs={12}>
            <Item>
              <Title>1. Ladda upp filer</Title>
              <Paper sx={{ p: 2 }}>
                <FileUpload value={inputFiles} onChange={handleUpload} />
              </Paper>
            </Item>

            <br />
            <Item>
              <Title>2. Välj typ</Title>
              <Paper sx={{ p: 2 }}>
                {
                  // TODO: For each file: Select which kind of transactions. Then on change normalize/convert it to a common output
                }
                {Object.values(files).map(file => <FileInputSelector key={file.file.name} inputFile={file} onChange={handleFileKindChanged} />)}
              </Paper>
            </Item>

            <br />
            <Item>
              <Title>3. Granska output</Title>
              <Paper sx={{ p: 2 }}>
                {
                  // TODO: Show normalized output that can be copied and pasted to google sheets
                }
              </Paper>
            </Item>
          </Grid>

        </Grid>
        <br />
      </Container>
    </div >
  )
}

export default Normalizer
