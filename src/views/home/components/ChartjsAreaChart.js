import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap'
import { useEffect, useState } from 'react'

import { API } from '@src/configs/app'
import { Line } from 'react-chartjs-2'
import axios from 'axios'

const ChartjsAreaChart = ({ 
  labelColor, 
  gridLineColor, 
  greyLightColor,
  primary,
  currentUser
}) => {
  const [labels, setLabels] = useState([])
  const [dataCompleted, setDataCompleted] = useState([])
  const [dataTotal, setDataTotal] = useState([])
  const [maxY, setMaxY] = useState(15)

  // ** Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: -20 }
    },
    scales: {
      x: {
        grid: {
          color: 'transparent',
          borderColor: gridLineColor
        },
        ticks: { color: labelColor }
      },
      y: {
        min: 0,
        max: maxY,
        grid: {
          color: 'transparent',
          borderColor: gridLineColor
        },
        ticks: {
          stepSize: 5,
          color: labelColor
        }
      }
    },
    plugins: {
      legend: {
        align: 'end',
        position: 'top',
        labels: {
          padding: 30,
          boxWidth: 9,
          color: labelColor,
          usePointStyle: true
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    }
  }

  // ** Chart data
  const data = {
    labels,
    datasets: [
      {
        fill: true,
        tension: 0,
        label: 'COMPLETED TASKS',
        pointRadius: 0.5,
        pointHoverRadius: 5,
        pointStyle: 'circle',
        backgroundColor: primary,
        pointHoverBorderWidth: 5,
        borderColor: 'transparent',
        pointHoverBorderColor: '#fff',
        pointBorderColor: 'transparent',
        pointHoverBackgroundColor: primary,
        data: dataCompleted
      },
      {
        fill: true,
        tension: 0,
        label: 'TOTAL TASKS',
        pointRadius: 0.5,
        pointHoverRadius: 5,
        pointStyle: 'circle',
        pointHoverBorderWidth: 5,
        borderColor: 'transparent',
        pointHoverBorderColor: '#fff',
        pointBorderColor: 'transparent',
        backgroundColor: greyLightColor,
        pointHoverBackgroundColor: greyLightColor,
        data: dataTotal
      }
    ]
  }

  useEffect(() => {
    axios.get(`${API}/stats/completed-tasks-month?currentUser=${currentUser.value}`).then(response => {
      const result = response.data.data
      const lb = []
      const datac = []
      const datat = []

      for (const item of result) {
        lb.push(item.month)
        datac.push(item.completedCount)
        datat.push(item.totalCount)
      }
      setLabels(lb)
      setDataCompleted(datac)
      setDataTotal(datat)
      const newMaxY = Math.max(...datac, ...datat, maxY)
      setMaxY(newMaxY)
    })
  }, [currentUser])

  return (
    <Card>
      <CardHeader className='d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column'>
        <CardTitle tag='h4'>Completion rate for the current year</CardTitle>
      </CardHeader>
      <CardBody>
        <div style={{ height: '300px' }}>
          <Line data={data} options={options} height={450} />
        </div>
      </CardBody>
    </Card>
  )
}

export default ChartjsAreaChart
