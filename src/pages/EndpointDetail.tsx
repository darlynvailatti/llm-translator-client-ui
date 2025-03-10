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
import { useEffect, useState } from "react"
import { getEndpoint, updateEndpoint } from "../api/endpoints"
import { TranslationEndpointDetail, TranslationSpecList, UpdateTranslationEndpoint } from "../api/types"
import { getSpecs } from "../api/specs"
import { format } from "date-fns"
import { Button, Stack, Switch, TextField } from "@mui/material"
import { CreateFAB } from "../components/CreateEndpointFAB"
import { DocumentScanner } from "@mui/icons-material"
import { toast } from "react-toastify"
import EndpointTranslationDrawer from "../components/EndpointTranslationDrawer"

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

  const linkToCreateNewSpec = `/endpoints/${id}/new-spec`

  useEffect(() => {
    // Fetch endpoint details
    if (id)
      getEndpoint(id).then((data) => {
        data.created_at = format(new Date(data.created_at), "dd/MM/yyyy HH:mm:ss")
        data.updated_at = format(new Date(data.updated_at), "dd/MM/yyyy HH:mm:ss")
        setReadOnlyEndpoint(data)
        setEditableEndpoint({
          uuid: data.uuid,
          key: data.key,
          name: data.name,
          is_active: data.is_active,
          definition: data.definition
        })

        // Fetch endpoint specifications
        getSpecs(id).then((data) => {
          setSpecs(data)
        })
      })
  }, [id])

  function updateField(field: string, value: any) {
    if (!editableEndpoint) return
    setEditableEndpoint({ ...editableEndpoint, [field]: value })
  }

  async function handleUpdate() {
    // Call the updateEndpoint API
    if (!id || !editableEndpoint) return

    try {
      await updateEndpoint(id, editableEndpoint)
      toast.success("Endpoint updated successfully")
    } catch (error) {
      toast.error("Failed to update endpoint: " + error)
    }
  }

  function handleTranslate() {
    // Call the translate API
    if (!id) return

    setDrawerOpen(true)

  }


  return (
    <Container maxWidth={false} sx={{ p: 3 }}>
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
        <Paper>
          <Stack spacing={2} padding={2}>
            <Grid container alignItems="center" justifyContent={"space-between"} >
              <Grid item xs={6} sx={{ mr: 1 }}>
                <TextField
                  label="Key"
                  defaultValue={readOnlyEndpoint.key}
                  variant="standard"
                  fullWidth
                  onChange={(evn) => updateField("key", evn.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body2" color="text.secondary">
                  Created At
                </Typography>
                <Typography variant="body1">{readOnlyEndpoint.created_at}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body2" color="text.secondary">
                  Updated At
                </Typography>
                <Typography variant="body1">{readOnlyEndpoint.updated_at}</Typography>
              </Grid>
              <Grid item xs={1} sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Stack padding={1}>
                  <Typography variant="body2" color="text.secondary">
                    Active
                  </Typography>
                  <Switch
                    color="primary"
                    checked={editableEndpoint.is_active}
                    onChange={() => {
                      updateField("is_active", !editableEndpoint.is_active)
                    }}
                  />
                </Stack>
              </Grid>
            </Grid>

            <TextField
              label="Name"
              defaultValue={editableEndpoint.name}
              variant="standard"
              fullWidth
              multiline
              onChange={(evn) => updateField("name", evn.target.value)}
            />
          </Stack>
        </Paper>

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

        {/* Specifications card */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Specifications
          </Typography>
          <List disablePadding>
            {specs && specs.map((spec) => (
              <ListItem key={spec.uuid} component={Paper} variant="outlined" sx={{ mb: 1, p: 1.5, display: "flex" }}>
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
                      <Badge variant={spec.is_active ? "active" : "inactive"}>{spec.is_active ? "Active" : "Inactive"}</Badge>
                    </Box>
                  </Box>
                </Link>
              </ListItem>
            ))}

            {specs && specs.length <= 0 ? <Box sx={{ height: 50 }} alignContent={"center"} justifyItems={"center"}>
              <Typography variant="body1" color="text.secondary">
                No specifications yet. <Link to={linkToCreateNewSpec}>Create one</Link>
              </Typography>
            </Box> : null}
          </List>
        </Paper>

        {/* Save Button */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="contained" color="primary" onClick={handleTranslate}>
            Translate
          </Button>
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Save
          </Button>
        </Box>
      </Box> : null}

      <CreateFAB to={linkToCreateNewSpec} label="Create new spec" />

    </Container>
  )
}

