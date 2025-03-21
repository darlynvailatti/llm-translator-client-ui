"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import { Breadcrumb } from "../components/Breadcrumb"
import { generateArtifact, getArtifact, getSpec, getTestCases, updateSpec } from "../api/specs"
import { SpecArtifactResponse, TranslationSpecDetail, TranslationSpecEngine, UpdateTranslationSpec } from "../api/types"
import { Avatar, CircularProgress, Stack, Switch, TextField, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material"
import { Editor } from "@monaco-editor/react"
import { format } from "date-fns"
import { toast } from "react-toastify"
import SpecTestCasesList from "../components/SpecTestCasesList"
import { Add, AutoMode } from "@mui/icons-material"
import { DEFAULT_DATE_FORMAT } from "../constants"
import SpecTestCaseDrawer from "../components/SpecTestCaseDrawer"
import { useSpecDetail } from "./SpecDetailContext"

const TRANSLATION_SPEC_ENGINE_OPTIONS: any = {
  [TranslationSpecEngine.DYNAMIC]: {
    label: "Dynamic",
    description: "Translation will be executed on demand (slower translation)"
  },
  [TranslationSpecEngine.COMPILED_ARTIFACT]: {
    label: "Artifact",
    description: "Translation will be executed using a pre-compiled artifact (faster translation)"
  }
}

export default function SpecDetail() {

  const context = useSpecDetail()
  const { id, specId } = useParams<{ id: string; specId: string }>()

  const [readOnlySpec, setReadOnlySpec] = useState<TranslationSpecDetail>()
  const [spec, setSpec] = useState<UpdateTranslationSpec>()
  const [isGeneratingArtifact, setIsGeneratingArtifact] = useState(false)
  const [artifact, setArtifact] = useState<SpecArtifactResponse | null>()
  const [open, setOpen] = useState(false)
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string | undefined>()
  const isCompiledArtifactEngine = spec?.definition?.engine === TranslationSpecEngine.COMPILED_ARTIFACT


  useEffect(() => {
    if (id && specId) {

      context.setEndpointId(id)
      context.setSpecId(specId)

      getSpec(id, specId).then((data) => {
        data.created_at = format(new Date(data.created_at), DEFAULT_DATE_FORMAT)
        data.updated_at = format(new Date(data.updated_at), DEFAULT_DATE_FORMAT)
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

  async function update() {
    // Call the updateSpec API
    if (!id || !spec || !specId) return

    try {
      await updateSpec(id, specId, spec)
      toast.success("Spec updated successfully")
    } catch (error) {
      toast.error("Failed to update spec: " + error)
    }
  }

  async function handleGenerateArtifact() {
    // Call the generateArtifact API
    if (!spec || !specId) return

    try {
      setIsGeneratingArtifact(true)
      const response = await generateArtifact(specId)
      if (response.success) {
        toast.success("Artifact generated successfully")
        getArtifact(specId).then((data) => {
          setArtifact(data)
        })
      } else {
        toast.error(response.error)
      }
    } catch (error) {
      toast.error("Failed to generate artifact: " + error)
    } finally {
      setIsGeneratingArtifact(false)
    }
  }

  function handleOnSelectTestCase(testCaseId: string) {
    setSelectedTestCaseId(testCaseId)
    setOpen(true)
  }

  useEffect(() => {
    if (specId)
      getArtifact(specId).then((data) => {
        setArtifact(data)
      })
  }, [specId])


  return (
    <Container maxWidth={false} sx={{ p: 3 }}>

      {specId ? (
        <SpecTestCaseDrawer
          specId={specId}
          testCaseId={selectedTestCaseId}
          onClose={() => {
            setOpen(false)
            setSelectedTestCaseId(undefined)

          }}
          open={open}
        />
      ) : (
        <></>
      )}

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
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Name
                    </Typography>
                    <TextField
                      variant="standard"
                      value={spec.name}
                      fullWidth
                      onChange={(evn) => updateField("name", evn.target.value)}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Engine
                    </Typography>
                    {/* Select available options */}

                    <ToggleButtonGroup size="small" value={spec.definition?.engine} exclusive>
                      {Object.keys(TRANSLATION_SPEC_ENGINE_OPTIONS).map((key) => (
                        <Tooltip title={TRANSLATION_SPEC_ENGINE_OPTIONS[key].description}>
                          <ToggleButton value={key} onClick={() => updateField("definition", {
                            ...spec.definition,
                            engine: key
                          })}>
                            {TRANSLATION_SPEC_ENGINE_OPTIONS[key].label}
                          </ToggleButton>
                        </Tooltip>
                      ))}
                    </ToggleButtonGroup>
                  </Stack>
                </Grid>
                <Grid item xs={1}>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Version
                    </Typography>
                    <TextField
                      variant="standard"
                      value={spec.version}
                      onChange={(evn) => updateField("version", evn.target.value)}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Created At
                    </Typography>
                    <Typography variant="body1">{readOnlySpec?.created_at}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Updated At
                    </Typography>
                    <Typography variant="body1">{readOnlySpec?.updated_at}</Typography>
                  </Stack>
                </Grid>
                <Grid item sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Grid item>
                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        Is Active?
                      </Typography>
                      <Switch
                        checked={spec.is_active}
                        onChange={(evn) => updateField("is_active", evn.target.checked)}
                        sx={{ margin: 0 }}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>

            {/* Input/Output Rules */}
            <Grid container spacing={2}>
              {/* Input Rules */}
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={6}>
                {/* Extra Context */}
                <Paper sx={{ p: 2 }}>
                  <Stack>
                    <Tooltip
                      title="Extra context is used to provide additional information to the translation process, either to generate the compiled artifact or during dynamic translation.">
                      <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                        Extra context
                      </Typography>
                    </Tooltip>
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
                  </Stack>
                </Paper>
              </Grid>
            </Grid>

            <Grid container spacing={2}>

              <Grid item xs={6}>
                {isCompiledArtifactEngine ?
                  <Paper sx={{ p: 2 }}>
                    <Stack>
                      <Grid container spacing={2} justifyContent={"space-between"} alignContent={"center"}>
                        <Grid item>

                          <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                            Test Cases
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Tooltip title="Add Test Case">
                            <Avatar
                              sx={{
                                bgcolor: "primary.main",
                                cursor: "pointer",
                                '&:hover': { bgcolor: "primary.dark" }, p: 3
                              }}
                              onClick={() => {
                                setOpen(true)
                              }}
                            >
                              <Add />
                            </Avatar>
                          </Tooltip>
                        </Grid>
                      </Grid>

                      <SpecTestCasesList
                        specId={spec.uuid} onSelectTestCase={handleOnSelectTestCase} />
                    </Stack>

                  </Paper>
                  : null}
              </Grid>

              <Grid item xs={6}>
                {isCompiledArtifactEngine ?
                  <Paper sx={{ p: 2 }}>
                    <Stack>

                      <Grid container justifyContent={"space-between"} alignContent={"center"} spacing={2}>
                        <Grid item>
                          <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                            Artifact
                          </Typography>

                        </Grid>

                        <Grid item>
                          <Box sx={{ height: 50 }} alignContent={"center"} justifyItems={"center"}>
                            <Stack spacing={1}>
                              {isGeneratingArtifact ? <CircularProgress /> :
                                <Tooltip title="Generate Artifact">
                                  <Avatar
                                    sx={{ 
                                      bgcolor: "primary.main", 
                                      cursor: "pointer", 
                                      '&:hover': { bgcolor: "primary.dark" } }}
                                    onClick={handleGenerateArtifact}
                                  >
                                    <AutoMode  />
                                  </Avatar>
                                </Tooltip>}
                            </Stack>
                          </Box>
                        </Grid>

                      </Grid>

                      {artifact && !isGeneratingArtifact ?

                        <Editor
                          value={artifact?.implementation_str}
                          language="python"
                          height={200}
                        />
                        : null}
                    </Stack>

                  </Paper>
                  : null}
              </Grid>

            </Grid>



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

