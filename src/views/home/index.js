import '@styles/react/libs/flatpickr/flatpickr.scss'

import { Card, CardBody, CardHeader, CardLink, CardText, CardTitle, Col, Label, Row } from 'reactstrap'
import { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import AreaChart from './components/ChartjsAreaChart'
import BarChart from './components/ChartjsBarChart'
import Breadcrumbs from '@components/breadcrumbs'
import DoughnutChart from './components/ChartjsDoughnutChart'
import Flatpickr from 'react-flatpickr'
import Select from 'react-select'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { getUserData } from '../../auth/utils'
import { getUsers } from '../store'
import moment from 'moment'
import { selectThemeColors } from '@utils'
import { useSkin } from '@hooks/useSkin'

const Home = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.storeApp)

  // ** States
  const [startingDate, setStartingDate] = useState(new Date(moment().startOf('day').subtract(9, 'days')))
  const [endingDate, setEndingDate] = useState(new Date(moment().endOf('day').subtract(1, 'hour')))
  const user = getUserData()
  const [currentUser, setCurrentUser] = useState({ value: user._id, label: `${user.first_name} ${user.last_name}`})
  const [users, setUsers] = useState([])

  const { colors } = useContext(ThemeColors),
    { skin } = useSkin(),
    labelColor = skin === 'dark' ? '#b4b7bd' : '#6e6b7b',
    tooltipShadow = 'rgba(0, 0, 0, 0.25)',
    gridLineColor = 'rgba(200, 200, 200, 0.2)',
    greyLightColor = '#EDF1F4'

  useEffect(() => {
    dispatch(getUsers())
  }, [dispatch])

  useEffect(() => {
    if (store.users?.length) {
      const usersArray = store.users.map(user => { return {value: user._id, label: `${user.first_name} ${user.last_name}`} })
      usersArray.unshift({ value: 'ALL', label: 'All'})
      setUsers(usersArray)
    }
  }, [store.users])
  
  return (
    <div>
      <Breadcrumbs breadCrumbTitle={'Home'} />
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Filters</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md='4'>
              <Label for='starting-date-picker'>Starting date</Label>
              <Flatpickr
                data-enable-time
                id='starting-date-picker'
                className='form-control'
                value={startingDate}
                placeholder='select starting date'
                onChange={data => {
                  setStartingDate((new Date(data)).toISOString())
                }}
                options={{
                  maxDate: new Date()
                }}
              />
            </Col>
            <Col md='4'>
              <Label for='ending-date-picker'>Ending date</Label>
              <Flatpickr
                data-enable-time
                id='ending-date-picker'
                className='form-control'
                placeholder='select ending date'
                value={endingDate}
                onChange={data => {
                  setEndingDate((new Date(data)).toISOString())
                }}
              />
            </Col>
            {user.type === 'ADMIN' && (
              <Col md='4'>
                <Label for='user'>User</Label>
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className='react-select'
                  classNamePrefix='select'
                  options={users}
                  value={currentUser}
                  onChange={data => {
                    setCurrentUser(data)
                  }}
                />
              </Col>
            )}
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Row>
            <Col xl='6' sm='12'>
              <BarChart 
                success={colors.success.main} 
                labelColor={labelColor} 
                gridLineColor={gridLineColor}
                startingDate={startingDate}
                endingDate={endingDate} 
                currentUser={currentUser}
              />
            </Col>
            <Col lg='6' sm='12'>
              <DoughnutChart
                tooltipShadow={tooltipShadow}
                primary={colors.primary.main}
                success={colors.success.main}
                startingDate={startingDate}
                endingDate={endingDate} 
                currentUser={currentUser}
              />
            </Col>
          </Row>
          <Row>
            <Col sm='12'>
              <AreaChart
                labelColor={labelColor}
                gridLineColor={gridLineColor}
                greyLightColor={greyLightColor}
                primary={colors.primary.main}
                currentUser={currentUser}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  )
}

export default Home
