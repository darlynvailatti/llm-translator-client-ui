import { useNavigate } from "react-router-dom"
import Fab from "@mui/material/Fab"
import { Add } from "@mui/icons-material"

export function CreateEndpointFAB() {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/endpoints/new")
  }

  return (
    <Fab
      color="primary"
      aria-label="Create new endpoint"
      onClick={handleClick}
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
      }}
    >
      <Add />
    </Fab>
  )
}

