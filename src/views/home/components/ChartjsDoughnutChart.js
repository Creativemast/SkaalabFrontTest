import { Book, CheckCircle } from 'react-feather'
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap'
import { useEffect, useState } from 'react'

import { API } from '@src/configs/app'
import { Doughnut } from 'react-chartjs-2'
import axios from 'axios'

const ChartjsRadarChart = ({  
  primary,
  success,
  startingDate,
  endingDate,
  currentUser
}) => {
  const [completedTasks, setCompletedTasks] = useState(0)
  const [totalTasks, setTotalTasks] = useState(0)
  const [completionRate, setCompletionRate] = useState(0)

  // ** Chart Options
  const options = {
    maintainAspectRatio: false,
    cutout: 60,
    animation: {
      resize: {
        duration: 500
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label (context) {
            const label = context.dataset.labels[context.dataIndex] || ''
            const value = context.parsed || 0
            const percentage = Math.round((value / totalTasks) * 100)
  
            return ` ${label}: ${value} (${percentage}%)`
          }
        }
      }
    }
  }

  // ** Chart data
  const data = {
    datasets: [
      {
        labels: ['Completed', 'Not Completed'],
        data: [completedTasks, totalTasks - completedTasks],
        backgroundColor: [success, primary],
        borderWidth: 0,
        pointStyle: 'rectRounded'
      }
    ]
  }

  useEffect(() => {
    axios.get(`${API}/stats/completion-rate?startingDate=${startingDate}&endingDate=${endingDate}&currentUser=${currentUser.value}`).then(response => {
      const result = response.data.data
      setTotalTasks(result.totalTasks)
      setCompletedTasks(result.completedTasks)
      setCompletionRate(result.completionRate)
    })
  }, [startingDate, endingDate, currentUser])

  return (
    <Card>
      <CardHeader className='d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column'>
        <CardTitle tag='h4'>Completion rate</CardTitle>
      </CardHeader>
      <CardBody>
        {totalTasks === 0 ? (
          <div className="text-center mt-5">
            <p>No tasks available</p>
          </div>
        ) : (
          <>
            <div style={{ height: '275px' }}>
              <Doughnut data={data} options={options} height={275} />
            </div>
            <div className='d-flex justify-content-between mt-3 mb-1'>
              <div className='d-flex align-items-center'>
                <CheckCircle size={17} className='text-success' />
                <span className='fw-bold ms-75 me-25'>COMPLETED TASKS</span>
                <span>- {completedTasks}</span>
              </div>
              <div>
                <span className='text-success'>{Math.round(completionRate)}%</span>
              </div>
            </div>
            <div className='d-flex justify-content-between mb-1'>
              <div className='d-flex align-items-center'>
                <CheckCircle size={17} className='text-primary' />
                <span className='fw-bold ms-75 me-25'>NOT COMPLETED TASKS</span>
                <span>- {totalTasks - completedTasks}</span>
              </div>
              <div>
                <span className='text-primary'>{100 - Math.round(completionRate)}%</span>
              </div>
            </div>
            <div className='d-flex justify-content-between mb-1'>
              <div className='d-flex align-items-center'>
                <Book size={17} className='text-warning' />
                <span className='fw-bold ms-75 me-25'>TOTAL TASKS</span>
                <span>- {totalTasks}</span>
              </div>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  )
}

export default ChartjsRadarChart
