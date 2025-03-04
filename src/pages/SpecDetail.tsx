"use client"

import { useState } from "react"
import { useParams } from "react-router-dom"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import { Badge } from "../components/Badge"
import { Breadcrumb } from "../components/Breadcrumb"
import CodeEditor from "@uiw/react-textarea-code-editor"

export default function SpecDetail() {
  const { id, specId } = useParams<{ id: string; specId: string }>()

  // Mock data for the spec
  const spec = {
    id: specId,
    name: "Default Spec",
    createdAt: "2025-02-01 00:23:31",
    updatedAt: "2025-02-01 00:23:31",
    status: "Active",
    inputFormat: "application/xml",
    outputFormat: "application/json",
    extraContext: `[Measurement Unit]
- 'kg' (Shipment) must be translated to 'LB'
- date Format = 'DD/MM/YY'

[GDMA]
- 'paymentMethod' must be translated to 'payment_method'
- ignore 'paymentOption', 'paymentType'`,
  }

  const [extraContext, setExtraContext] = useState(spec.extraContext)

  return (
    <Container maxWidth={false} sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Breadcrumb
          items={[
            { label: "My Account", href: "/" },
            { label: "Endpoints", href: "/" },
            { label: id || "", href: `/endpoints/${id}` },
            { label: spec.name },
          ]}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Spec info card */}
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <Typography variant="body2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {spec.name}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" color="text.secondary">
                Created At
              </Typography>
              <Typography variant="body1">{spec.createdAt}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" color="text.secondary">
                Updated At
              </Typography>
              <Typography variant="body1">{spec.updatedAt}</Typography>
            </Grid>
            <Grid item xs={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Badge variant="active">Active</Badge>
            </Grid>
          </Grid>
        </Paper>

        {/* Input/Output Rules */}
        <Grid container spacing={2}>
          {/* Input Rules */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                Input Rules
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Format
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {spec.inputFormat}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Schema
                </Typography>
                <Box
                  sx={{
                    border: 2,
                    borderStyle: "dashed",
                    borderColor: "divider",
                    borderRadius: 1,
                    p: 3,
                    mt: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.disabled",
                  }}
                >
                  Drag or drop a file here
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Output Rules */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                Output Rules
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Format
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {spec.outputFormat}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Schema
                </Typography>
                <Box
                  sx={{
                    border: 2,
                    borderStyle: "dashed",
                    borderColor: "divider",
                    borderRadius: 1,
                    p: 3,
                    mt: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.disabled",
                  }}
                >
                  Drag or drop a file here
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Extra Context */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
            Extra context
          </Typography>
          <CodeEditor
            value={extraContext}
            language="ini"
            placeholder="Enter extra context here..."
            onChange={(evn) => setExtraContext(evn.target.value)}
            padding={15}
            style={{
              fontSize: 12,
              backgroundColor: "#f5f5f5",
              fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
            }}
          />
        </Paper>

        {/* Save Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary">
            Save
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

