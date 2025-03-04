import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import { NetworkCheck, Logout } from "@mui/icons-material"
import { Link } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import EndpointDetail from "./pages/EndpointDetail"
import SpecDetail from "./pages/SpecDetail"
import NewEndpoint from "./pages/NewEndpoint"
import "./index.css"

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#2e7d32", // Green color similar to the original theme
    },
    secondary: {
      main: "#f5f5f5",
    },
    background: {
      default: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
})

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
          <Box
            component="aside"
            sx={{
              width: 56,
              borderRight: 1,
              borderColor: "divider",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 2,
            }}
          >
            {/* Logo or app icon at the top */}
            <Box
              sx={{
                width: 32,
                height: 32,
                border: 1,
                borderColor: "text.primary",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 4,
              }}
            >
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  border: 1,
                  borderColor: "text.primary",
                  transform: "rotate(45deg)",
                }}
              />
            </Box>

            {/* Endpoints menu item */}
            <Link to="/" style={{ textDecoration: "none" }}>
              <IconButton
                title="Endpoints"
                sx={{
                  mb: "auto",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <NetworkCheck />
              </IconButton>
            </Link>

            {/* Logout button at the bottom */}
            <IconButton
              title="Logout"
              sx={{
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <Logout />
            </IconButton>
          </Box>
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/endpoints/new" element={<NewEndpoint />} />
              <Route path="/endpoints/:id" element={<EndpointDetail />} />
              <Route path="/endpoints/:id/:specId" element={<SpecDetail />} />
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </Router>
  )
}

export default App

