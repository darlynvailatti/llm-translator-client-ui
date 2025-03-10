import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, type TooltipProps } from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react"
import { MAIN_COLOR, SECONDARY_COLOR } from "../theme"

interface TrafficChartProps {
  data: any
  height?: number
  compact?: boolean
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <Paper elevation={3} sx={{ p: 1, zIndex: 1000 }}>
        <Typography variant="body2" color="text.secondary">{`Time: ${new Date(label).toLocaleString()}`}</Typography>
        <Typography variant="body2" color={MAIN_COLOR}>{`Success: ${payload[0].value}`}</Typography>
        <Typography variant="body2" color={SECONDARY_COLOR}>{`Failed: ${payload[1].value}`}</Typography>
      </Paper>
    )
  }

  return null
}

export function TrafficChart({ data, height = 40, compact = false }: TrafficChartProps) {

  const [series, setSeries] = useState<any[]>([])

  useEffect(() => {
    const groupedData: any = {};

    Object.keys(data).forEach((key) => {
      data[key].forEach((item: any) => {
        const timestamp = item[0]
        const count = item[1];

        if (!groupedData[timestamp]) {
          groupedData[timestamp] = {
            success: 0,
            failure: 0,
          };
        }
        groupedData[timestamp][key.toLowerCase()] = count;
      });
    });

    const processedSeries: any = []
    Object.keys(groupedData).forEach((key) => {
      const entry = { ...groupedData[key], name: parseInt(key) * 1000 };
      if (entry.success !== 0 || entry.failure !== 0) {
        processedSeries.push(entry);
      }
    });

    setSeries(processedSeries);
  }, [data])

  return (
    <Box >
      {/* {JSON.stringify(series)} */}
      <ResponsiveContainer width="100%" height={height}>
        
        <LineChart data={series}>

          {compact && <XAxis hide />}

          {!compact && <XAxis
            dataKey="name"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(tick) => new Date(tick).toLocaleString()}
          />}

          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="success" stroke={MAIN_COLOR} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="failure" stroke={SECONDARY_COLOR} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  )
}

