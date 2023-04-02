import React, { useState } from "react"
import FileUpload from 'react-material-file-upload';
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Container from "@mui/material/Container"

import Title from '../Title'

const Item = ({ children }: { children: any }): JSX.Element => {
  return <div>{children}</div>
}

const FileThingy = (file: File) => {
  return <div>{file.name}</div>
}

const Normalizer = (): JSX.Element => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: '100vh' }}>
      <Container>
        <br />
        <Grid container spacing={2}>

          <Grid item xs={12}>
            <Item>
              <Title>1. Ladda upp filer</Title>
              <Paper sx={{ p: 2 }}>
                <FileUpload value={files} onChange={setFiles} />
              </Paper>
            </Item>

            <br />
            <Item>
              <Title>2. Välj typ</Title>
              <Paper sx={{ p: 2 }}>
                {
                  // TODO: For each file: Select which kind of transactions. Then on change normalize/convert it to a common output
                }
                {files.map(file => FileThingy(file))}
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
