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
import { generateRandomTrafficData, formatNumber } from "../utils/helpers"
import { useEffect, useState } from "react"
import { getEndpoint } from "../api/endpoints"
import { TranslationEndpointDetail, TranslationSpecList } from "../api/types"
import { getSpecs } from "../api/specs"

export default function EndpointDetail() {
  const { id } = useParams<{ id: string }>()

  const [endpoint, setEndpoint] = useState<TranslationEndpointDetail>()
  const [specs, setSpecs] = useState<[TranslationSpecList]>()

  useEffect(() => {
    // Fetch endpoint details
    if (id)
      getEndpoint(id).then((data) => {
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
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <Typography variant="body2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {endpoint.name}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" color="text.secondary">
                Created At
              </Typography>
              <Typography variant="body1">{endpoint.created_at}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" color="text.secondary">
                Updated At
              </Typography>
              <Typography variant="body1">{endpoint.updated_at}</Typography>
            </Grid>
            <Grid item xs={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Badge variant="active">Active</Badge>
            </Grid>
          </Grid>
        </Paper>

        {/* Traffic chart card */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Traffic
          </Typography>
          <Box sx={{ height: 240 }}>
            <TrafficChart data={endpoint.traffic} height={240} />
          </Box>
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
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      border: 1,
                      borderColor: "text.primary",
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        border: 1,
                        borderColor: "text.primary",
                      }}
                    />
                  </Box>
                </ListItemIcon>
                <Link to={`/endpoints/${id}/${spec.uuid}`} style={{ textDecoration: "none", flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <Box>
                      <Typography variant="body1" fontWeight="medium" color="text.primary">
                        {spec.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          px: 1,
                          py: 0.5,
                          bgcolor: "warning.light",
                          borderRadius: 1,
                          fontSize: "0.75rem",
                        }}
                      >
                        Version: {spec.version}
                      </Box>
                      <Badge variant={spec.is_active ? "active" : "inactive"}>{spec.is_active ? "Active" : "Inactive"}</Badge>
                    </Box>
                  </Box>
                </Link>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box> : null}


    </Container>
  )
}

