"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import { Breadcrumb } from "../components/Breadcrumb"
import { getSpec, updateSpec } from "../api/specs"
import { TranslationSpecDetail, UpdateTranslationSpec } from "../api/types"
import { Stack, Switch, TextField } from "@mui/material"
import { Editor } from "@monaco-editor/react"
import { format } from "date-fns"
import { toast } from "react-toastify"

export default function SpecDetail() {
  const { id, specId } = useParams<{ id: string; specId: string }>()

  const [readOnlySpec, setReadOnlySpec] = useState<TranslationSpecDetail>()
  const [spec, setSpec] = useState<UpdateTranslationSpec>()

  useEffect(() => {
    if (id && specId) {
      getSpec(id, specId).then((data) => {
        data.created_at = format(new Date(data.created_at), "dd/MM/yyyy HH:mm:ss")
        data.updated_at = format(new Date(data.updated_at), "dd/MM/yyyy HH:mm:ss")
        setReadOnlySpec(data)
        setSpec({
          ...data
        })
      })
    }
  }, [id, specId])

  function updateField(field: string, value: any) {
    if (!spec) return
    setSpec({ ...spec, [field]: value })
  }

  async function update(){
    // Call the updateSpec API
    if(!id || !spec || !specId) return
    
    try {
      await updateSpec(id, specId, spec)
      toast.success("Spec updated successfully")
    } catch (error) {
      toast.error("Failed to update spec: " + error)
    }
  }

  return (
    <Container maxWidth={false} sx={{ p: 3 }}>
      {spec ?
        <div>

          <Box sx={{ mb: 3 }}>
            <Breadcrumb
              items={[
                { label: "My Account", href: "/" },
                { label: "Endpoints", href: "/" },
                { label: id || "", href: `/endpoints/${id}` },
                { label: "Specs", href: `/endpoints/${id}` },
                { label: spec?.name },
              ]}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Spec info card */}
            <Paper sx={{ p: 2 }}>
              <Grid container spacing={2} alignItems="start" justifyContent={"space-between"}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Name
                  </Typography>
                  <TextField
                    variant="standard"
                    value={spec.name}
                    fullWidth
                    onChange={(evn) => updateField("name", evn.target.value)}
                  />
                </Grid>
                <Grid item xs={1}>
                  <Typography variant="body2" color="text.secondary">
                    Version
                  </Typography>
                  <TextField
                    variant="standard"
                    value={spec.version}
                    onChange={(evn) => updateField("version", evn.target.value)}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2" color="text.secondary">
                    Created At
                  </Typography>
                  <Typography variant="body1">{readOnlySpec?.created_at}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2" color="text.secondary">
                    Updated At
                  </Typography>
                  <Typography variant="body1">{readOnlySpec?.updated_at}</Typography>
                </Grid>
                <Grid item xs={1} sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Stack>
                    <Typography variant="body2" color="text.secondary">
                      Is Active?
                    </Typography>
                    <Switch
                      checked={spec.is_active}
                      onChange={(evn) => updateField("is_active", evn.target.checked)}
                      sx={{margin: 0}}
                    />
                  </Stack>
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
                    <TextField
                      variant="standard"
                      value={spec.definition?.input_rule?.content_type}
                      onChange={(evn) => updateField("definition", {
                        ...spec.definition,
                        input_rule: {
                          ...spec.definition?.input_rule,
                          content_type: evn.target.value
                        }
                      })}
                    />
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
                    <TextField
                      variant="standard"
                      value={spec.definition?.output_rule?.content_type}
                      onChange={(evn) => updateField("definition", {
                        ...spec.definition,
                        output_rule: {
                          ...spec.definition?.output_rule,
                          content_type: evn.target.value
                        }
                      })}
                    />
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
              <Editor
                value={spec.definition?.extra_context}
                language="ini"
                onChange={(evn) => {
                  updateField("definition", {
                    ...spec.definition,
                    extra_context: evn
                  })

                }}
                height={200}
              />
            </Paper>

            {/* Save Button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button variant="contained" color="primary" onClick={update}>
                Save
              </Button>
            </Box>
          </Box>
        </div>
        : null}

    </Container>
  )
}

