"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import { Breadcrumb } from "../components/Breadcrumb"
import { getArtifact, getSpec, updateSpec } from "../api/specs"
import { TranslationSpecDetail, TranslationSpecEngine, UpdateTranslationSpec } from "../api/types"
import { Avatar, CircularProgress, Drawer, Stack, Switch, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Fade, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Tabs, Tab } from "@mui/material"
import { Editor } from "@monaco-editor/react"
import { format } from "date-fns"
import { toast } from "react-toastify"
import SpecTestCasesList from "../components/SpecTestCasesList"
import { Add, AutoMode, Bolt, OpenInBrowser, Edit, Input, Output, InfoOutlined, Science, Autorenew, BuildCircle } from "@mui/icons-material"
import { DEFAULT_DATE_FORMAT } from "../constants"
import SpecTestCaseDrawer from "../components/SpecTestCaseDrawer"
import { useSpecDetail } from "./SpecDetailContext"
import ArtifactGenerationResponse from "../components/ArtifactGenerationResponse"

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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`spec-tabpanel-${index}`}
      aria-labelledby={`spec-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3, p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `spec-tab-${index}`,
    'aria-controls': `spec-tabpanel-${index}`,
  };
}

export default function SpecDetail() {

  const context = useSpecDetail()
  const { id, specId } = useParams<{ id: string; specId: string }>()

  const [readOnlySpec, setReadOnlySpec] = useState<TranslationSpecDetail>()
  const [spec, setSpec] = useState<UpdateTranslationSpec>()
  const [initialSpec, setInitialSpec] = useState<UpdateTranslationSpec>()
  const [open, setOpen] = useState(false)
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string | undefined>()
  const [artifactDrawerIsOpen, setArtifactDrawerIsOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; version?: string }>({})
  const [tabValue, setTabValue] = useState(0)

  const isCompiledArtifactEngine = spec?.definition?.engine === TranslationSpecEngine.COMPILED_ARTIFACT
  const isAllowedToGenerateArtifact = Boolean(context.testCases && context.testCases.length > 0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  function validateField(field: string, value: string) {
    let error = ''
    if (field === 'name') {
      if (!value) error = 'Name is required.'
    }
    if (field === 'version') {
      if (!value) error = 'Version is required.'
    }
    setErrors((prev) => ({ ...prev, [field]: error }))
    return error === ''
  }

  function updateField(field: string, value: any) {
    if (!spec) return
    setSpec({ ...spec, [field]: value })
    if (typeof value === 'string') validateField(field, value)
  }

  function isFormValid() {
    if (!spec) return false
    return (
      spec.name &&
      spec.version &&
      !errors.name &&
      !errors.version
    )
  }

  function hasUnsavedChanges() {
    if (!spec || !initialSpec) return false
    return (
      spec.name !== initialSpec.name ||
      spec.version !== initialSpec.version ||
      spec.is_active !== initialSpec.is_active ||
      JSON.stringify(spec.definition) !== JSON.stringify(initialSpec.definition)
    )
  }

  function handleEdit() {
    setEditMode(true)
  }

  function handleCancel() {
    if (hasUnsavedChanges()) {
      setShowCancelDialog(true)
    } else {
      doCancel()
    }
  }

  function doCancel() {
    setEditMode(false)
    setSpec(initialSpec)
    setErrors({})
    setShowCancelDialog(false)
  }

  async function handleUpdate() {
    if (!id || !spec || !specId) return

    try {
      await updateSpec(id, specId, spec)
      setInitialSpec(spec)
      setEditMode(false)
      setErrors({})
      toast.success("Spec updated successfully")
    } catch (error) {
      toast.error("Failed to update spec: " + error)
    }
  }

  function handleOpenArtifactDrawer() {
    if (!context.artifact) {
      toast.error("No artifact has been generated")
      return
    }
    setArtifactDrawerIsOpen(true)
  }

  const handleGenerateArtifact = useCallback(() => {
    if (!spec || !specId) return
    try {
      context.generateArtifact()
    } catch {
      toast.error("Failed to generate artifact")
    }
  }, [spec, specId])

  function handleOnSelectTestCase(testCaseId: string) {
    setSelectedTestCaseId(testCaseId)
    setOpen(true)
  }

  async function handleRunTestCases() {
    if (!specId) return
    try {
      await context.runTestCases()
      toast.success("Tests ran successfully")
    } catch (error: any) {
      toast.error("Failed to run test cases: " + error?.message)
    }
  }

  useEffect(() => {
    if (specId)
      getArtifact(specId).then((data) => {
        context.setArtifact(data)
      })
  }, [specId])

  // Sub Components
  const GenerateArtifactButton = useMemo(() => (props: { customMessage: string, force: boolean }) => {
    return <>
      {(!context.artifact || props.force) && !context.isGeneratingArtifact ?
        <Tooltip title={isAllowedToGenerateArtifact ? props.customMessage : "Add test cases to generate artifact"}>
          <Avatar
            sx={{
              bgcolor: !isAllowedToGenerateArtifact ? "grey.400" : "primary.main",
              cursor: !isAllowedToGenerateArtifact ? "not-allowed" : "pointer",
              '&:hover': !isAllowedToGenerateArtifact ? {} : { bgcolor: "primary.dark" },
              p: 3,
              opacity: !isAllowedToGenerateArtifact ? 0.6 : 1
            }}
            onClick={!context.isGeneratingArtifact && isAllowedToGenerateArtifact ? handleGenerateArtifact : undefined}
          >
            <AutoMode />
          </Avatar>
        </Tooltip> : null}
    </>
  }, [handleGenerateArtifact,
    context.isGeneratingArtifact,
    isAllowedToGenerateArtifact,
    context.artifact])

  useEffect(() => {
    if (id && specId) {
      context.setEndpointId(id)
      context.setSpecId(specId)

      getSpec(id, specId).then((data) => {
        data.created_at = format(new Date(data.created_at), DEFAULT_DATE_FORMAT)
        data.updated_at = format(new Date(data.updated_at), DEFAULT_DATE_FORMAT)
        setReadOnlySpec(data)
        const editable = {
          ...data
        }
        setSpec(editable)
        setInitialSpec(editable)
      })
    }
  }, [id, specId])

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
      ) : null}

      {spec ? (
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

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Spec info card */}
            <Fade in={true} timeout={400} key={`spec-info-${editMode ? 'edit' : 'view'}`}>
              <Paper>
                <Stack spacing={2} padding={2}>
                  <Grid container alignItems="center" justifyContent={"space-between"} spacing={2}>
                    <Grid item xs={5}>
                      <TextField
                        label="Name"
                        value={spec.name}
                        variant="standard"
                        fullWidth
                        required
                        helperText={errors.name ? errors.name : 'A descriptive name for this specification.'}
                        error={!!errors.name}
                        onChange={(evn) => updateField("name", evn.target.value)}
                        onBlur={(evn) => validateField("name", evn.target.value)}
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        label="Version"
                        value={spec.version}
                        variant="standard"
                        fullWidth
                        required
                        helperText={errors.version ? errors.version : 'Version number for this specification.'}
                        error={!!errors.version}
                        onChange={(evn) => updateField("version", evn.target.value)}
                        onBlur={(evn) => validateField("version", evn.target.value)}
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body2" color="text.secondary">
                          Active
                        </Typography>
                        <Switch
                          color="primary"
                          checked={spec.is_active}
                          onChange={() => {
                            updateField("is_active", !spec.is_active)
                          }}
                          disabled={!editMode}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                  
                  <Grid container spacing={2} alignItems="center" justifyContent={"space-between"}>
                    <Grid item xs={4}>
                      <Stack spacing={1}>
                        <Typography variant="body2" color="text.secondary">
                          Engine
                        </Typography>
                        <ToggleButtonGroup 
                          size="small" 
                          value={spec.definition?.engine} 
                          exclusive
                          disabled={!editMode}
                        >
                          {Object.keys(TRANSLATION_SPEC_ENGINE_OPTIONS).map((key) => {
                            let icon = null;
                            if (key === TranslationSpecEngine.DYNAMIC) icon = <Autorenew sx={{ mr: 1 }} fontSize="small" />;
                            if (key === TranslationSpecEngine.COMPILED_ARTIFACT) icon = <BuildCircle sx={{ mr: 1 }} fontSize="small" />;
                            return (
                              <Tooltip key={key} title={TRANSLATION_SPEC_ENGINE_OPTIONS[key].description}>
                                <ToggleButton 
                                  value={key} 
                                  onClick={() => updateField("definition", {
                                    ...spec.definition,
                                    engine: key
                                  })}
                                >
                                  {icon}
                                  {TRANSLATION_SPEC_ENGINE_OPTIONS[key].label}
                                </ToggleButton>
                              </Tooltip>
                            )
                          })}
                        </ToggleButtonGroup>
                      </Stack>
                    </Grid>
                    <Grid item xs={4}>
                      <Stack direction="row" spacing={4}>
                        <Stack>
                          <Typography variant="caption" color="text.secondary">
                            Created At
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {readOnlySpec?.created_at}
                          </Typography>
                        </Stack>
                        <Stack>
                          <Typography variant="caption" color="text.secondary">
                            Updated At
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {readOnlySpec?.updated_at}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', pr: 2 }}>
                      {!editMode && (
                        <Button startIcon={<Edit />} variant="outlined" size="small" onClick={handleEdit}>
                          Edit
                        </Button>
                      )}
                      {editMode && (
                        <>
                          <Button variant="outlined" color="secondary" onClick={handleCancel} sx={{ mr: 1 }}>
                            Cancel
                          </Button>
                          <Button variant="contained" color="primary" onClick={handleUpdate} disabled={!isFormValid()}>
                            Save
                          </Button>
                        </>
                      )}
                    </Grid>
                  </Grid>
                </Stack>
              </Paper>
            </Fade>

            {/* Tabs */}
            <Fade in={true} timeout={400} key={`tabs-${editMode ? 'edit' : 'view'}`}>
              <Paper>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={tabValue} onChange={handleTabChange} aria-label="spec configuration tabs">
                    <Tab label="Signature" {...a11yProps(0)} />
                    <Tab label="Instructions" {...a11yProps(1)} />
                    {isCompiledArtifactEngine && <Tab label="Tests" {...a11yProps(2)} />}
                  </Tabs>
                </Box>

                {/* Tab 0: Signature */}
                <TabPanel value={tabValue} index={0}>
                  <Grid container spacing={2}>
                    {/* Input Rules */}
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2, minHeight: 280, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                          <Input sx={{ mr: 1 }} fontSize="small" />
                          Input Rules
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                          Define the expected format and structure of incoming data
                        </Typography>

                        <Box sx={{ mb: 2, flex: '0 0 auto' }}>
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
                            disabled={!editMode}
                            fullWidth
                          />
                        </Box>
                        <Box sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Schema
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, fontStyle: 'italic' }}>
                            Here you can paste your existing schema or just write specific constraints in plain-English
                          </Typography>
                          <Box sx={{ flex: '1 1 auto', minHeight: 120 }}>
                            <Editor
                              value={spec.definition?.input_rule?.schema_ || ''}
                              language="json"
                              onChange={(value) => {
                                updateField("definition", {
                                  ...spec.definition,
                                  input_rule: {
                                    ...spec.definition?.input_rule,
                                    schema_: value
                                  }
                                })
                              }}
                              height="200px"
                              theme="vs-dark"
                              options={{
                                readOnly: !editMode,
                                minimap: { enabled: false },
                                wordWrap: "on",
                                lineNumbers: "on",
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                fontSize: 12
                              }}
                            />
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>

                    {/* Output Rules */}
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2, minHeight: 280, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                          <Output sx={{ mr: 1 }} fontSize="small" />
                          Output Rules
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                          Define the expected format and structure of translated data
                        </Typography>
                        <Box sx={{ mb: 2, flex: '0 0 auto' }}>
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
                            disabled={!editMode}
                            fullWidth
                          />
                        </Box>
                        <Box sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Schema
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, fontStyle: 'italic' }}>
                            Here you can paste your existing schema or just write specific constraints in plain-English
                          </Typography>
                          <Box sx={{ flex: '1 1 auto', minHeight: 120 }}>
                            <Editor
                              value={spec.definition?.output_rule?.schema_ || ''}
                              language="json"
                              onChange={(value) => {
                                updateField("definition", {
                                  ...spec.definition,
                                  output_rule: {
                                    ...spec.definition?.output_rule,
                                    schema_: value
                                  }
                                })
                              }}
                              height="200px"
                              theme="vs-dark"
                              options={{
                                readOnly: !editMode,
                                minimap: { enabled: false },
                                wordWrap: "on",
                                lineNumbers: "on",
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                fontSize: 12
                              }}
                            />
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </TabPanel>

                {/* Tab 1: Instructions */}
                <TabPanel value={tabValue} index={1}>
                  <Paper sx={{ p: 2 }}>
                    <Stack>
                      <Tooltip
                        title="Extra context is used to provide additional information to the translation process, either to generate the compiled artifact or during dynamic translation.">
                        <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                          <InfoOutlined sx={{ mr: 1 }} fontSize="small" />
                          Extra context
                        </Typography>
                      </Tooltip>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                        Provide additional instructions, examples, or context to guide the translation process
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
                        height={400}
                        theme="vs-dark"
                        options={{
                          readOnly: !editMode,
                          minimap: { enabled: false },
                          wordWrap: "on",
                          lineNumbers: "on",
                          scrollBeyondLastLine: false,
                          automaticLayout: true
                        }}
                      />
                    </Stack>
                  </Paper>
                </TabPanel>

                {/* Tab 2: Tests */}
                {isCompiledArtifactEngine && (
                  <TabPanel value={tabValue} index={2}>
                    <Paper sx={{ p: 2 }}>
                      <Stack>
                        <Grid container spacing={2} justifyContent={"space-between"} alignContent={"center"}>
                          <Grid item>
                            <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                              <Science sx={{ mr: 1 }} fontSize="small" />
                              Test Cases
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Grid container spacing={1}>
                              <Grid item>
                                <Stack spacing={1}>
                                  {context.isRunningTestCases ? <CircularProgress /> : null}

                                  {!context.isRunningTestCases ?
                                    <Tooltip title="Run Test Cases">
                                      <Avatar
                                        sx={{
                                          bgcolor: "primary.main",
                                          cursor: "pointer",
                                          '&:hover': { bgcolor: "primary.dark" }, p: 3
                                        }}
                                        onClick={handleRunTestCases}
                                      >
                                        <Bolt />
                                      </Avatar>
                                    </Tooltip>
                                    : null}
                                </Stack>
                              </Grid>

                              <Grid item>
                                <Stack spacing={1}>
                                  {context.isGeneratingArtifact ? <CircularProgress /> : null}

                                  {GenerateArtifactButton({ customMessage: "Generate Artifact", force: false })}

                                  {context.artifact ? <Tooltip title="Open Artifact">
                                    <Avatar
                                      sx={{
                                        bgcolor: "primary.main",
                                        cursor: "pointer",
                                        '&:hover': { bgcolor: "primary.dark" },
                                        p: 3
                                      }}
                                      onClick={handleOpenArtifactDrawer}
                                    >
                                      <OpenInBrowser />
                                    </Avatar>
                                  </Tooltip> : null}
                                </Stack>
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
                          </Grid>
                        </Grid>

                        <SpecTestCasesList
                          specId={spec.uuid} onSelectTestCase={handleOnSelectTestCase} />
                      </Stack>
                    </Paper>
                  </TabPanel>
                )}
              </Paper>
            </Fade>
          </Box>
        </div>
      ) : null}

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onClose={() => setShowCancelDialog(false)}>
        <DialogTitle>Discard changes?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have unsaved changes. Are you sure you want to discard them?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCancelDialog(false)} color="primary">
            Keep editing
          </Button>
          <Button onClick={doCancel} color="secondary" variant="contained">
            Discard
          </Button>
        </DialogActions>
      </Dialog>

      {/* Artifact Drawer */}
      <Drawer
        open={artifactDrawerIsOpen}
        onClose={() => setArtifactDrawerIsOpen(false)}
        anchor="right"
        sx={{
          "& .MuiDrawer-paper": {
            width: "50%",
            boxSizing: 'border-box'
          }
        }}>
        <Stack spacing={2} padding={2}>
          <Grid container
            justifyContent={"space-between"}
            alignItems={"center"}
            padding={2}>
            <Grid item>
              <Typography variant="h5" fontWeight="bold">
                Artifact
              </Typography>
            </Grid>

            <Grid item>
              {GenerateArtifactButton({ customMessage: "Re-generate Artifact", force: true })}
            </Grid>
          </Grid>

          {!context.isGeneratingArtifact && context.artifactGenerationResponse ?
            <Paper>
              <ArtifactGenerationResponse response={context.artifactGenerationResponse} />
            </Paper>
            : null}

          <Paper sx={{ p: 2 }}>
            {isCompiledArtifactEngine ?
              <Stack>
                {context.artifact && !context.isGeneratingArtifact ?
                  <Editor
                    value={context.artifact?.implementation_str}
                    language="python"
                    height={"70vh"}
                    theme="vs-dark"
                    options={{
                      readOnly: true,
                      minimap: { enabled: false }
                    }}
                  />
                  : null}
              </Stack>
              : null}
          </Paper>
        </Stack>
      </Drawer>
    </Container>
  )
}

