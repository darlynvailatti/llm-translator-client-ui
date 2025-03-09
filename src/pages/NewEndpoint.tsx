import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { Breadcrumb } from "../components/Breadcrumb"
import { useState } from "react"
import { NewTranslationEndpoint } from "../api/types"
import { Editor } from "@monaco-editor/react"
import { Stack } from "@mui/material"
import { createEndpoint } from "../api/endpoints"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

export default function NewEndpoint() {

  const [newEndpoint, setNewEndpoint] = useState<NewTranslationEndpoint>({
    key: "",
    name: "",
    definition: {}
  })

  const navigate = useNavigate()

  function updateField(field: string, value: string) {
    setNewEndpoint({ ...newEndpoint, [field]: value })
  }

  async function create() {
    try{
      // Call the createEndpoint API
      const created = await createEndpoint(newEndpoint)
      toast.success(`Endpoint created successfully`)
      // Redirect to the endpoint detail page
      navigate(`/endpoints/${created.uuid}`)
    } catch (error) {
      toast.error("Failed to create endpoint")
    }
  }

  return (
    <Container maxWidth={false} sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Breadcrumb
          items={[{ label: "My Account", href: "/" }, { label: "Endpoints", href: "/" }, { label: "New Endpoint" }]}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Endpoint info card */}
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">

            <Grid item xs={12}>
              <TextField
                id="endpoint-key"
                label="Endpoint Key"
                fullWidth
                placeholder="Enter Key"
                variant="standard"
                value={newEndpoint.key}
                onChange={(e) => updateField("key", e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                id="endpoint-name"
                label="Endpoint Name"
                fullWidth
                placeholder="Enter endpoint name"
                variant="standard"
                value={newEndpoint.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              {/* Text area mui */}
              <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  Definition
                </Typography>
                <Editor
                  height="20vh" defaultLanguage="json" defaultValue="{}"
                  onChange={(value) => {
                    let parsedJson = {}
                    if (value) {
                      try {
                        parsedJson = JSON.parse(value)
                      } catch (error) {
                        parsedJson = {}
                      }
                      setNewEndpoint({ ...newEndpoint, definition: parsedJson })
                    }
                  }}
                />
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Save Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary" onClick={create}>
            Create Endpoint
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

