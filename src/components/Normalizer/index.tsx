import React, { useState } from "react"
import FileUpload from 'react-material-file-upload'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Container from "@mui/material/Container"
import Button from "@mui/material/Button"

import Title from '../Title'
import FileInputSelector from "./FileInputSelector"
import { generate } from "./normalize"
import { InputKind, UploadedFileMap } from "./types"
import { convertXlsToJson, tryAutoDetect } from "./utils"

const Item = ({ children }: { children: any }): JSX.Element => {
  return <div>{children}</div>
}

const Normalizer = (): JSX.Element => {
  const [inputFiles, setInputFiles] = useState<File[]>([])
  const [files, setFiles] = useState<UploadedFileMap>({})

  const handleUpload = async (files: File[]) => {
    setInputFiles(files)
    let fileMap: UploadedFileMap = {}
    await Promise.all(files.map(async file => {
      let data = await convertXlsToJson(file)
      fileMap[file.name] = {
        file,
        data,
        kind: tryAutoDetect(data),
      }
    }))
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
                {Object.values(files).map(file => <FileInputSelector key={file.file.name} inputFile={file} onChange={handleFileKindChanged} />)}
              </Paper>
            </Item>

            <br />
            <Item>
              <Title>3. Granska output</Title>
              <Paper sx={{ p: 2 }}>
                {
                  <Button variant="contained" onClick={async () => {
                    setFiles(await generate(files))
                  }}>Generate</Button>
                }
                <table>
                  <tbody>
                    {
                      Object.values(files).map(file => {
                        return file.normalizedData?.map((row: Array<unknown>, i: number) => (
                          <tr key={i}>
                            {Object.values(row).map((col, i) => (
                              <td key={i}>{col}</td>
                            ))}
                          </tr>)
                        )
                      })
                    }
                  </tbody>
                </table>
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
