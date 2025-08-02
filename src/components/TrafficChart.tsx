import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
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

export function TrafficChart({ data, height = 40, compact = false }: TrafficChartProps) {
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({})

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

    const processedData: any[] = []
    Object.keys(groupedData).forEach((key) => {
      const entry = { ...groupedData[key], timestamp: parseInt(key) * 1000 };
      if (entry.success !== 0 || entry.failure !== 0) {
        processedData.push(entry);
      }
    });

    // Sort by timestamp
    processedData.sort((a, b) => a.timestamp - b.timestamp);

    const successSeries = processedData.map(item => [item.timestamp, item.success]);
    const failureSeries = processedData.map(item => [item.timestamp, item.failure]);

    const options: Highcharts.Options = {
      chart: {
        type: 'line',
        height: height,
        backgroundColor: 'transparent',
        style: {
          fontFamily: 'inherit'
        }
      },
      title: {
        text: ''
      },
      xAxis: {
        type: 'datetime',
        labels: {
          format: '{value:%H:%M:%S}',
          style: {
            fontSize: '10px'
          }
        },
        tickInterval: 1000, // 1 second intervals
        visible: !compact
      },
      yAxis: {
        title: {
          text: ''
        },
        labels: {
          style: {
            fontSize: '10px'
          }
        },
        visible: !compact
      },
      tooltip: {
        formatter: function() {
          const date = new Date(this.x);
          return `<b>${date.toLocaleString()}</b><br/>
                  <span style="color: ${MAIN_COLOR}">Success: ${this.points?.[0]?.y || 0}</span><br/>
                  <span style="color: ${SECONDARY_COLOR}">Failed: ${this.points?.[1]?.y || 0}</span>`;
        },
        shared: true
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        line: {
          marker: {
            enabled: false
          },
          lineWidth: 2
        }
      },
      series: [
        {
          name: 'Success',
          data: successSeries,
          color: MAIN_COLOR,
          type: 'line'
        },
        {
          name: 'Failed',
          data: failureSeries,
          color: SECONDARY_COLOR,
          type: 'line'
        }
      ],
      credits: {
        enabled: false
      }
    };

    setChartOptions(options);
  }, [data, height, compact])

  return (
    <Box>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
      />
    </Box>
  )
}

