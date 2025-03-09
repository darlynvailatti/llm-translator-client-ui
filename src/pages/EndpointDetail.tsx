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
import { getEndpoint } from "../api/endpoints"
import { TranslationEndpointDetail, TranslationSpecList } from "../api/types"
import { getSpecs } from "../api/specs"
import { format } from "date-fns"
import { Stack, TextField } from "@mui/material"
import { CreateFAB } from "../components/CreateEndpointFAB"
import { DocumentScanner } from "@mui/icons-material"

export default function EndpointDetail() {
  const { id } = useParams<{ id: string }>()

  const [endpoint, setEndpoint] = useState<TranslationEndpointDetail>()
  const [specs, setSpecs] = useState<[TranslationSpecList]>()

  const linkToCreateNewSpec = `/endpoints/${id}/new-spec`

  useEffect(() => {
    // Fetch endpoint details
    if (id)
      getEndpoint(id).then((data) => {
        data.created_at = format(new Date(data.created_at), "dd/MM/yyyy HH:mm:ss")
        data.updated_at = format(new Date(data.updated_at), "dd/MM/yyyy HH:mm:ss")
        setEndpoint(data)

        // Fetch endpoint specifications
        getSpecs(id).then((data) => {
          setSpecs(data)
        })
      })
  }, [id])


  return (
    <Container maxWidth={false} sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Breadcrumb
          items={[{ label: "My Account", href: "/" }, { label: "Endpoints", href: "/" }, { label: id || "" }]}
        />
      </Box>

      {endpoint === undefined && <Typography variant="body1">Loading...</Typography>}

      {endpoint ? <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Endpoint info card */}
        <Paper>
          <Stack spacing={2} padding={2}>
            <Grid container alignItems="center" justifyContent={"space-between"} >
              <Grid item xs={6} sx={{ mr: 1 }}>
                <TextField
                  label="Key"
                  defaultValue={endpoint.key}
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body2" color="text.secondary">
                  Created At
                </Typography>
                <Typography variant="body1">{endpoint.created_at}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body2" color="text.secondary">
                  Updated At
                </Typography>
                <Typography variant="body1">{endpoint.updated_at}</Typography>
              </Grid>
              <Grid item xs={1} sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Badge variant="active">Active</Badge>
              </Grid>
            </Grid>

            <TextField
              label="Name"
              defaultValue={endpoint.name}
              variant="standard"
              fullWidth
              multiline
            />
          </Stack>
        </Paper>

        {/* Traffic chart card */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Traffic
          </Typography>
          {JSON.stringify(endpoint.traffic) === "{}" ?
            <Box sx={{ height: 160 }} alignContent={"center"} justifyItems={"center"}>
              <Typography variant="body1" color="text.secondary">No traffic yet</Typography>
            </Box>
            : <Box>
              <TrafficChart data={endpoint.traffic} height={240} />
            </Box>}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Failed
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {endpoint.total_failure}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Success
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {endpoint.total_success}
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
      </Box> : null}

      <CreateFAB to={linkToCreateNewSpec} label="Create new spec" />

    </Container>
  )
}

