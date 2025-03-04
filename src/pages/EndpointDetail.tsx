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

export default function EndpointDetail() {
  const { id } = useParams<{ id: string }>()

  // Mock data for the endpoint
  const endpoints = {
    "231231-32124-31244-565465": { name: "SAP Order Sync (XML → JSON)" },
    "342342-43235-43345-676576": { name: "Customer Data Flow (JSON → Parquet)" },
    "453453-54346-54456-787687": { name: "Seamless Payment API Bridge (JSON → JSON)" },
    "564564-65457-65567-898798": { name: "Real-time Inventory Sync (JSON → SQL)" },
    "675675-76568-76678-909809": { name: "User Auth & Access Control (JWT → JSON)" },
    "786786-87679-87789-010910": { name: "Smart Product Search & Filter (JSON → JSON)" },
    "897897-98780-98890-121021": { name: "Live Order Tracking & Shipping Updates (JSON → XML)" },
    "908908-09891-09901-232132": { name: "Customer Support Ticket Hub (JSON → SQL)" },
    "019019-10902-10012-343243": { name: "Marketing Insights & Campaign Metrics (CSV → JSON)" },
  }

  const trafficData = generateRandomTrafficData()
  const totalSuccess = trafficData.reduce((sum, day) => sum + day.success, 0)
  const totalFailed = trafficData.reduce((sum, day) => sum + day.failed, 0)

  const endpoint = {
    id,
    name: endpoints[id as keyof typeof endpoints]?.name || "Unknown Endpoint",
    createdAt: "2025-02-01 00:23:31",
    updatedAt: "2025-02-01 00:23:31",
    failed: formatNumber(totalFailed),
    success: formatNumber(totalSuccess),
    trafficData,
    specs: [
      { id: "default-spec", name: "Default Spec", version: "0", status: "Active" },
      { id: "map-style", name: "Map Style", version: "1", status: "Inactive", inProgress: true },
    ],
  }

  return (
    <Container maxWidth={false} sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Breadcrumb
          items={[{ label: "My Account", href: "/" }, { label: "Endpoints", href: "/" }, { label: id || "" }]}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
              <Typography variant="body1">{endpoint.createdAt}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2" color="text.secondary">
                Updated At
              </Typography>
              <Typography variant="body1">{endpoint.updatedAt}</Typography>
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
            <TrafficChart data={endpoint.trafficData} height={240} />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Failed
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {endpoint.failed}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Success
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {endpoint.success}
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
            {endpoint.specs.map((spec) => (
              <ListItem key={spec.id} component={Paper} variant="outlined" sx={{ mb: 1, p: 1.5, display: "flex" }}>
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
                <Link to={`/endpoints/${id}/${spec.id}`} style={{ textDecoration: "none", flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <Box>
                      <Typography variant="body1" fontWeight="medium" color="text.primary">
                        {spec.name}
                        {spec.inProgress && (
                          <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                            [IN PROGRESS]
                          </Typography>
                        )}
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
                      <Badge variant={spec.status === "Active" ? "active" : "inactive"}>{spec.status}</Badge>
                    </Box>
                  </Box>
                </Link>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  )
}

