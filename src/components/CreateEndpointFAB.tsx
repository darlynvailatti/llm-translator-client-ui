import { useNavigate } from "react-router-dom"
import Fab from "@mui/material/Fab"
import { Add } from "@mui/icons-material"
import { Tooltip } from "@mui/material"

export interface CreateFABProps {
  to: string
  label?: string
}

export function CreateFAB(props: CreateFABProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(props.to)
  }

  return (
    <Tooltip title={props.label ?? "Create"}>
      <Fab
        color="primary"
        aria-label={props.label ?? "Create"}
        onClick={handleClick}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
        }}
      >
        <Add />
      </Fab>
    </Tooltip>
  )
}

