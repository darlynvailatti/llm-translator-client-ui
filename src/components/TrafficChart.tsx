import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, type TooltipProps } from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"

interface TrafficChartProps {
  data: { name: string; success: number; failed: number }[]
  height?: number
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <Paper elevation={3} sx={{ p: 1, zIndex: 1000 }}>
        <Typography variant="body2" color="text.secondary">{`Day ${label}`}</Typography>
        <Typography variant="body2" color="success.main">{`Success: ${payload[0].value}`}</Typography>
        <Typography variant="body2" color="error.main">{`Failed: ${payload[1].value}`}</Typography>
      </Paper>
    )
  }

  return null
}

export function TrafficChart({ data, height = 40 }: TrafficChartProps) {
  return (
    <Box sx={{ position: "relative", zIndex: 10 }}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <XAxis dataKey="name" hide />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="success" stroke="#2e7d32" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="failed" stroke="#d32f2f" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  )
}

