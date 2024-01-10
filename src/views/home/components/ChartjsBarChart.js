import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap'
import { useEffect, useState } from 'react'

import { API } from '@src/configs/app'
import { Bar } from 'react-chartjs-2'
import axios from 'axios'

const ChartjsBarChart = ({ 
  success, 
  gridLineColor, 
  labelColor,
  startingDate,
  endingDate,
  currentUser
}) => {
  const [labels, setLabels] = useState([])
  const [data, setData] = useState([])
  const [maxY, setMaxY] = useState(10)

  // ** Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    scales: {
      x: {
        grid: {
          color: gridLineColor,
          borderColor: gridLineColor
        },
        ticks: { color: labelColor }
      },
      y: {
        min: 0,
        max: Math.max(...data, maxY),
        grid: {
          color: gridLineColor,
          borderColor: gridLineColor
        },
        ticks: {
          stepSize: 5,
          color: labelColor
        }
      }
    },
    plugins: {
      legend: { display: false }
    }
  }

  // ** Chart data
  const chart_data = {
    labels,
    datasets: [
      {
        maxBarThickness: 15,
        backgroundColor: success,
        borderColor: 'transparent',
        borderRadius: { topRight: 15, topLeft: 15 },
        data
      }
    ]
  }

  useEffect(() => {
    axios.get(`${API}/stats/completed-tasks?startingDate=${startingDate}&endingDate=${endingDate}&currentUser=${currentUser.value}`).then(response => {
      const result = response.data.data
      const lb = []
      const dt = []

      for (const item of result) {
        lb.push(item.date)
        dt.push(item.count)
      }
      setLabels(lb)
      setData(dt)
      const newMaxY = Math.max(...dt, maxY)
      setMaxY(newMaxY)
    })
  }, [startingDate, endingDate, currentUser])

  return (
    <Card>
      <CardHeader className='d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column'>
        <CardTitle tag='h4'>Completed tasks per day</CardTitle>
      </CardHeader>
      <CardBody>
        <div style={{ height: '400px' }}>
          <Bar data={chart_data} options={options} height={400} />
        </div>
      </CardBody>
    </Card>
  )
}

export default ChartjsBarChart
