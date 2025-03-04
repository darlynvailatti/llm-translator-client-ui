import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
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
import Login from "./pages/Login"
import "./index.css"
import authManager from "./utils/auth"
import { useEffect, useState } from "react"

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

const PrivateRoute: React.FC<{ component: React.FC }> = ({ component: Component, ...rest }) => {
  const isAuthenticated = authManager.isAuthenticated();
  return isAuthenticated ?
    <Box sx={{ display: "flex" }}>
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
            title="Logout">
            <Logout />
          </IconButton>
        </Box>

      </Box>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Component {...rest} />
      </Box>
    </Box>
    : <Navigate to="/login" />;
};

function App() {

  const isAuthenticated = authManager.isAuthenticated()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute component={Dashboard} />} />
          <Route path="/endpoints/new" element={<PrivateRoute component={NewEndpoint} />} />
          <Route path="/endpoints/:id" element={<PrivateRoute component={EndpointDetail} />} />
          <Route path="/endpoints/:id/:specId" element={<PrivateRoute component={SpecDetail} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App

