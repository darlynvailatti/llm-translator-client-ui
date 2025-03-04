import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Button from "@mui/material/Button"
import { Badge } from "../components/Badge"
import { Breadcrumb } from "../components/Breadcrumb"

export default function NewEndpoint() {
  return (
    <Container maxWidth={false} sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Breadcrumb
          items={[{ label: "My Account", href: "/" }, { label: "Endpoints", href: "/" }, { label: "New Endpoint" }]}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Endpoint info card */}
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={9}>
              <TextField
                id="endpoint-name"
                label="Endpoint Name"
                variant="outlined"
                fullWidth
                placeholder="Enter endpoint name"
                size="small"
              />
            </Grid>
            <Grid item xs={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Badge variant="inactive">Inactive</Badge>
            </Grid>
          </Grid>
        </Paper>

        {/* Input/Output Formats */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                Input Format
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="input-format-label">Format</InputLabel>
                <Select labelId="input-format-label" id="input-format" label="Format" defaultValue="XML">
                  <MenuItem value="XML">XML</MenuItem>
                  <MenuItem value="JSON">JSON</MenuItem>
                  <MenuItem value="CSV">CSV</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                Output Format
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="output-format-label">Format</InputLabel>
                <Select labelId="output-format-label" id="output-format" label="Format" defaultValue="JSON">
                  <MenuItem value="JSON">JSON</MenuItem>
                  <MenuItem value="XML">XML</MenuItem>
                  <MenuItem value="CSV">CSV</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Grid>
        </Grid>

        {/* Save Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary">
            Create Endpoint
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

