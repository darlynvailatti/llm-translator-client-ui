import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import { EndpointCard } from "../components/EndpointCard"
import { Breadcrumb } from "../components/Breadcrumb"
import { CreateEndpointFAB } from "../components/CreateEndpointFAB"
import { generateRandomTrafficData, formatNumber } from "../utils/helpers"

export default function Dashboard() {
  // Mock data for endpoints with random traffic data
  const endpoints = [
    { id: "231231-32124-31244-565465", name: "SAP Order Sync (XML → JSON)" },
    { id: "342342-43235-43345-676576", name: "Customer Data Flow (JSON → Parquet)" },
    { id: "453453-54346-54456-787687", name: "Seamless Payment API Bridge (JSON → JSON)" },
    { id: "564564-65457-65567-898798", name: "Real-time Inventory Sync (JSON → SQL)" },
    { id: "675675-76568-76678-909809", name: "User Auth & Access Control (JWT → JSON)" },
    { id: "786786-87679-87789-010910", name: "Smart Product Search & Filter (JSON → JSON)" },
    { id: "897897-98780-98890-121021", name: "Live Order Tracking & Shipping Updates (JSON → XML)" },
    { id: "908908-09891-09901-232132", name: "Customer Support Ticket Hub (JSON → SQL)" },
    { id: "019019-10902-10012-343243", name: "Marketing Insights & Campaign Metrics (CSV → JSON)" },
  ].map((endpoint) => {
    const trafficData = generateRandomTrafficData()
    const totalSuccess = trafficData.reduce((sum, day) => sum + day.success, 0)
    const totalFailed = trafficData.reduce((sum, day) => sum + day.failed, 0)
    return {
      ...endpoint,
      trafficData,
      failed: formatNumber(totalFailed),
      success: formatNumber(totalSuccess),
    }
  })

  return (
    <Container maxWidth={false} sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Breadcrumb items={[{ label: "My Account" }, { label: "Endpoints" }]} />
      </Box>
      <Grid container spacing={2}>
        {endpoints.map((endpoint) => (
          <Grid item xs={12} md={6} lg={4} key={endpoint.id}>
            <EndpointCard
              id={endpoint.id}
              name={endpoint.name}
              failed={endpoint.failed}
              success={endpoint.success}
              trafficData={endpoint.trafficData}
            />
          </Grid>
        ))}
      </Grid>
      <CreateEndpointFAB />
    </Container>
  )
}

