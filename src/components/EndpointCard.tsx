import { Link } from "react-router-dom"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import { Badge } from "./Badge"
import { TrafficChart } from "./TrafficChart"

interface EndpointCardProps {
  id: string
  name: string
  failed: number
  success: number
  traffic: object
}

export function EndpointCard({ id, name, failed, success, traffic }: EndpointCardProps) {
  return (
    <Link to={`/endpoints/${id}`} style={{ textDecoration: "none" }}>
      <Card
        sx={{
          height: "100%",
          transition: "box-shadow 0.3s",
          "&:hover": {
            boxShadow: 3,
          },
        }}
      >
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Typography
              variant="subtitle2"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                flex: 1,
              }}
            >
              {name}
            </Typography>
            <Badge variant="active">Active</Badge>
          </Box>
          <Box sx={{ height: 40 }}>
            <TrafficChart data={traffic} compact/>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="body2" color="text.secondary" component="span">
                Failed
              </Typography>
              <Typography variant="body2" fontWeight="medium" component="span" sx={{ ml: 0.5 }}>
                {failed}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" component="span">
                Success
              </Typography>
              <Typography variant="body2" fontWeight="medium" component="span" sx={{ ml: 0.5 }}>
                {success}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Link>
  )
}

