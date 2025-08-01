import { Link, useParams } from "react-router-dom"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import { Badge } from "../components/Badge"
import { TrafficChart } from "../components/TrafficChart"
import { Breadcrumb } from "../components/Breadcrumb"
import { useEffect, useState, useRef } from "react"
import { getEndpoint, updateEndpoint } from "../api/endpoints"
import { TranslationEndpointDetail, TranslationSpecList, UpdateTranslationEndpoint } from "../api/types"
import { getSpecs, activateSpec } from "../api/specs"
import { format } from "date-fns"
import { Button, Stack, Switch, TextField, Divider } from "@mui/material"
import { DocumentScanner, CheckCircle, Add, Edit } from "@mui/icons-material"
import { toast } from "react-toastify"
import EndpointTranslationDrawer from "../components/EndpointTranslationDrawer"
import EndpointAPIConnectionDetails from "../components/EndpointAPIConnectionDetails"
import { CircularProgress } from "@mui/material"
import { Fade, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material"

export default function EndpointDetail() {
  const { id } = useParams<{ id: string }>()

  const [readOnlyEndpoint, setReadOnlyEndpoint] = useState<TranslationEndpointDetail>()
  const [editableEndpoint, setEditableEndpoint] = useState<UpdateTranslationEndpoint>({
    uuid: "",
    key: "",
    name: "",
    is_active: false,
    definition: {}
  })
  const [specs, setSpecs] = useState<[TranslationSpecList]>()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [activatingSpecId, setActivatingSpecId] = useState<string | null>(null)
  const [lastActivatedSpecId, setLastActivatedSpecId] = useState<string | null>(null)
  const pulseTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  // Placeholder for delete handler
  const handleDelete = () => {
    handleMenuClose()
    toast.info("Delete endpoint action (to be implemented)")
  }

  const linkToCreateNewSpec = `/endpoints/${id}/new-spec`
  const [errors, setErrors] = useState<{ key?: string; name?: string }>({})
  const [initialEndpoint, setInitialEndpoint] = useState<UpdateTranslationEndpoint>()
  const [editMode, setEditMode] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  useEffect(() => {
    // Fetch endpoint details
    if (id)
      getEndpoint(id).then((data) => {
        data.created_at = format(new Date(data.created_at), "dd/MM/yyyy HH:mm:ss")
        data.updated_at = format(new Date(data.updated_at), "dd/MM/yyyy HH:mm:ss")
        setReadOnlyEndpoint(data)
        const editable = {
          uuid: data.uuid,
          key: data.key,
          name: data.name,
          is_active: data.is_active,
          definition: data.definition
        }
        setEditableEndpoint(editable)
        setInitialEndpoint(editable)
        // Fetch endpoint specifications
        getSpecs(id).then((data) => {
          setSpecs(data)
        })
      })
  }, [id])

  function validateField(field: string, value: string) {
    let error = ''
    if (field === 'key') {
      if (!value) error = 'Key is required.'
      // Optionally: add regex/format/uniqueness check here
    }
    if (field === 'name') {
      if (!value) error = 'Name is required.'
    }
    setErrors((prev) => ({ ...prev, [field]: error }))
    return error === ''
  }

  function updateField(field: string, value: any) {
    if (!editableEndpoint) return
    setEditableEndpoint({ ...editableEndpoint, [field]: value })
    if (typeof value === 'string') validateField(field, value)
  }

  function isFormValid() {
    if (!editableEndpoint) return false
    return (
      editableEndpoint.key &&
      editableEndpoint.name &&
      !errors.key &&
      !errors.name
    )
  }

  function hasUnsavedChanges() {
    if (!editableEndpoint || !initialEndpoint) return false
    return (
      editableEndpoint.key !== initialEndpoint.key ||
      editableEndpoint.name !== initialEndpoint.name ||
      editableEndpoint.is_active !== initialEndpoint.is_active
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
    if (initialEndpoint) {
      setEditableEndpoint(initialEndpoint)
      setErrors({})
    }
    setEditMode(false)
    setShowCancelDialog(false)
  }

  async function handleUpdate() {
    // Call the updateEndpoint API
    if (!id || !editableEndpoint) return

    try {
      await updateEndpoint(id, editableEndpoint)
      toast.success("Endpoint updated successfully")
      setEditMode(false)
    } catch (error) {
      toast.error("Failed to update endpoint: " + error)
    }
  }

  function handleAPIConnection() {
    // Open modal to connect to API
    if (!id) return

    setDialogOpen(true)
  }

  function handleTranslate() {
    // Call the translate API
    if (!id) return

    setDrawerOpen(true)

  }

  // Activate a spec from the list
  async function handleActivateSpec(specToActivate: TranslationSpecList) {
    if (!id) return
    setActivatingSpecId(specToActivate.uuid)
    try {
      await activateSpec(specToActivate.uuid)
      setLastActivatedSpecId(specToActivate.uuid)
      if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current)
      pulseTimeoutRef.current = setTimeout(() => setLastActivatedSpecId(null), 700)
      toast.success("Spec activated successfully")
      // Refetch specs
      getSpecs(id).then((data) => {
        setSpecs(data)
      })
    } catch (error) {
      toast.error("Failed to activate spec: " + error)
    } finally {
      setActivatingSpecId(null)
    }
  }


  return (
    <Container maxWidth={false} sx={{ p: 3 }}>

      {readOnlyEndpoint ?
        <EndpointAPIConnectionDetails
          open={dialogOpen} onClose={() => { setDialogOpen(!dialogOpen)}} endpoint={readOnlyEndpoint} />
        : null}

      <Box sx={{ mb: 3 }}>
        <Breadcrumb
          items={[{ label: "My Account", href: "/" }, { label: "Endpoints", href: "/" }, { label: id || "" }]}
        />
      </Box>

      <EndpointTranslationDrawer
        endpointId={editableEndpoint.uuid}
        endpointKey={editableEndpoint.key}
        endpointName={editableEndpoint.name}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {readOnlyEndpoint === undefined && <Typography variant="body1">Loading...</Typography>}

      {readOnlyEndpoint ? <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Endpoint info card */}
        <Fade in={true} timeout={400} key={editMode ? 'edit' : 'view'}>
          <Paper>
            <Stack spacing={2} padding={2}>
              <Grid container alignItems="center" justifyContent={"space-between"} spacing={2}>
                <Grid item xs={5}>
                  <TextField
                    label="Key"
                    value={editableEndpoint.key}
                    variant="standard"
                    fullWidth
                    required
                    helperText={errors.key ? errors.key : 'A unique identifier for this endpoint.'}
                    error={!!errors.key}
                    onChange={(evn) => updateField("key", evn.target.value)}
                    onBlur={(evn) => validateField("key", evn.target.value)}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    label="Name"
                    value={editableEndpoint.name}
                    variant="standard"
                    fullWidth
                    required
                    helperText={errors.name ? errors.name : 'A descriptive name for this endpoint.'}
                    error={!!errors.name}
                    onChange={(evn) => updateField("name", evn.target.value)}
                    onBlur={(evn) => validateField("name", evn.target.value)}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Active
                    </Typography>
                    <Switch
                      color="primary"
                      checked={editableEndpoint.is_active}
                      onChange={() => {
                        updateField("is_active", !editableEndpoint.is_active)
                      }}
                      disabled={!editMode}
                    />
                  </Stack>
                </Grid>
                {/* Replace the two Grid items for dates with a single Stack */}
                <Grid item xs={8}>
                  <Stack direction="row" spacing={4}>
                    <Stack>
                      <Typography variant="caption" color="text.secondary">
                        Created At
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {readOnlyEndpoint.created_at}
                      </Typography>
                    </Stack>
                    <Stack>
                      <Typography variant="caption" color="text.secondary">
                        Updated At
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {readOnlyEndpoint.updated_at}
                      </Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', pr: 2 }}>
                  {!editMode && (
                    <>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={handleTranslate}
                        sx={{ mr: 1 }}
                      >
                        Test
                      </Button>
                      <Button startIcon={<Edit />} variant="outlined" size="small" onClick={handleEdit}>
                        Edit
                      </Button>
                    </>
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

        {/* Specifications and Traffic chart side by side */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            {/* Specifications card */}
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Specifications
                </Typography>
                <Button
                  component={Link}
                  to={linkToCreateNewSpec}
                  variant="contained"
                  size="small"
                  sx={{ minWidth: 0 }}
                  startIcon={<Add />}
                >
                  Create New Spec
                </Button>
              </Box>
              <List disablePadding>
                {/* Pin and highlight the active spec at the top */}
                {specs && specs.filter(spec => spec.is_active).map((spec) => (
                  <ListItem
                    key={spec.uuid}
                    component={Paper}
                    variant="outlined"
                    className={lastActivatedSpecId === spec.uuid ? 'pulse-animate' : ''}
                    sx={{
                      mb: 1,
                      p: 1.5,
                      display: "flex",
                      bgcolor: 'primary.light',
                      border: theme => `2px solid ${theme.palette.primary.main}`,
                      boxShadow: 2,
                      transition: 'box-shadow 0.2s, background 0.2s',
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: 6,
                        background: '#f5f7fa',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <DocumentScanner />
                    </ListItemIcon>
                    <Link to={`/endpoints/${id}/specs/${spec.uuid}`} style={{ textDecoration: "none", flexGrow: 1 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <Box>
                          <Typography variant="body1" fontWeight="medium" color="text.primary">
                            {spec.name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Badge variant={"outline"}>
                            {spec.version}
                          </Badge>
                          <Badge variant="active">
                            <CheckCircle fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} /> Active
                          </Badge>
                        </Box>
                      </Box>
                    </Link>
                  </ListItem>
                ))}
                {/* Divider between active and inactive specs */}
                {specs && specs.filter(spec => !spec.is_active).length > 0 && (
                  <Divider sx={{ my: 1 }} />
                )}
                {/* Render the rest of the (inactive) specs */}
                {specs && specs.filter(spec => !spec.is_active).map((spec) => (
                  <ListItem key={spec.uuid} component={Paper} variant="outlined"
                    sx={{
                      mb: 1,
                      p: 1.5,
                      display: "flex",
                      alignItems: 'center',
                      transition: 'box-shadow 0.2s, background 0.2s',
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: 6,
                        background: '#f5f7fa',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <DocumentScanner />
                    </ListItemIcon>
                    <Link to={`/endpoints/${id}/specs/${spec.uuid}`} style={{ textDecoration: "none", flexGrow: 1 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <Box>
                          <Typography variant="body1" fontWeight="medium" color="text.primary">
                            {spec.name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Badge variant={"outline"}>
                            {spec.version}
                          </Badge>
                          {/* No Inactive badge here */}
                        </Box>
                      </Box>
                    </Link>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{ ml: 2, minWidth: 90 }}
                      disabled={activatingSpecId === spec.uuid}
                      onClick={() => handleActivateSpec(spec)}
                    >
                      {activatingSpecId === spec.uuid ? <CircularProgress size={18} /> : 'Activate'}
                    </Button>
                  </ListItem>
                ))}

                {specs && specs.length <= 0 ? <Box sx={{ height: 50 }} alignContent={"center"} justifyItems={"center"}>
                  <Typography variant="body1" color="text.secondary">
                    No specifications yet. <Link to={linkToCreateNewSpec}>Create one</Link>
                  </Typography>
                </Box> : null}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            {/* Traffic chart card */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Traffic
              </Typography>
              {JSON.stringify(readOnlyEndpoint.traffic) === "{}" ?
                <Box sx={{ height: 160 }} alignContent={"center"} justifyItems={"center"}>
                  <Typography variant="body1" color="text.secondary">No traffic yet</Typography>
                </Box>
                : <Box>
                  <TrafficChart data={readOnlyEndpoint.traffic} height={240} />
                </Box>}

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Failed
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {readOnlyEndpoint.total_failure}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Success
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {readOnlyEndpoint.total_success}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

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
      </Box> : null}

    </Container>
  )
}

