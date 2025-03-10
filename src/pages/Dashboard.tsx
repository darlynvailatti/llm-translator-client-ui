import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import { EndpointCard } from "../components/EndpointCard"
import { Breadcrumb } from "../components/Breadcrumb"
import { CreateFAB } from "../components/CreateEndpointFAB"
import { getEndpoints } from "../api/endpoints"
import { useEffect, useState } from "react"
import { TranslationEndpointList } from "../api/types"

export default function Dashboard() {
  const [endpoints, setEndpoints] = useState<[TranslationEndpointList] | []>([])

  useEffect(() => {
    getEndpoints().then((data) => {
      setEndpoints(data)
    })
  }, [])

  return (
    <Container maxWidth={false} sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Breadcrumb items={[{ label: "My Account" }, { label: "Endpoints" }]} back={false}/>
      </Box>
      <Grid container spacing={2}>
        {endpoints.map((endpoint) => (
          <Grid item xs={12} md={6} lg={4} key={endpoint.uuid}>
            <EndpointCard
              id={endpoint.uuid}
              name={endpoint.name}
              is_active={endpoint.is_active}
              failed={endpoint.total_failure}
              success={endpoint.total_success}
              traffic={endpoint.traffic}
            />
          </Grid>
        ))}
      </Grid>
      <CreateFAB to="/endpoints/new" label="Create new endpoint"/>
    </Container>
  )
}

