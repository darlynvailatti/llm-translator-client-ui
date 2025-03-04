import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Breadcrumbs from "@mui/material/Breadcrumbs"
import IconButton from "@mui/material/IconButton"
import { ArrowBack } from "@mui/icons-material"
import MuiLink from "@mui/material/Link"

interface BreadcrumbProps {
  items: {
    label: string
    href?: string
  }[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const navigate = useNavigate()

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton onClick={() => navigate(-1)} size="small" sx={{ mr: 1 }}>
        <ArrowBack fontSize="small" />
      </IconButton>
      <Breadcrumbs aria-label="breadcrumb">
        {items.map((item, index) => (
          <Box key={index}>
            {item.href ? (
              <Link to={item.href} style={{ textDecoration: "none" }}>
                <MuiLink underline="hover" color="primary">
                  {item.label}
                </MuiLink>
              </Link>
            ) : (
              <Typography color="text.primary">{item.label}</Typography>
            )}
          </Box>
        ))}
      </Breadcrumbs>
    </Box>
  )
}

