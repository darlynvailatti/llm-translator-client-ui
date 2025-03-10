import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import Dashboard from "./pages/Dashboard"
import EndpointDetail from "./pages/EndpointDetail"
import SpecDetail from "./pages/SpecDetail"
import NewEndpoint from "./pages/NewEndpoint"
import Login from "./pages/Login"
import "./index.css"
import authManager from "./utils/auth"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import NewSpec from "./pages/NewSpec"
import { PrivateRoute } from "./PrivateRoute"
import { theme } from "./theme"

function App() {

  const isAuthenticated = authManager.isAuthenticated()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer position="bottom-center"/>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute component={Dashboard} />} />
          <Route path="/endpoints/new" element={<PrivateRoute component={NewEndpoint} />} />
          <Route path="/endpoints/:id" element={<PrivateRoute component={EndpointDetail} />} />
          <Route path="/endpoints/:id/specs/:specId" element={<PrivateRoute component={SpecDetail} />} />
          <Route path="/endpoints/:id/new-spec" element={<PrivateRoute component={NewSpec} /> }/>
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App

