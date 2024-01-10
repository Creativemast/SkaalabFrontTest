import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'

import { AlertTriangle, Check, ChevronDown, Edit2 } from 'react-feather'
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  UncontrolledDropdown
} from 'reactstrap'
import { Controller, useForm } from 'react-hook-form'
import { Fragment, useEffect, useState } from 'react'
import { addTask, getTasks, getUsers, updateTask } from './store'
import { useDispatch, useSelector } from 'react-redux'

import Avatar from '@components/avatar'
import Breadcrumbs from '@components/breadcrumbs'
import DataTable from 'react-data-table-component'
import Flatpickr from 'react-flatpickr'
import ReactPaginate from 'react-paginate'
import Select from 'react-select'
import classnames from 'classnames'
import { getUserData } from '../auth/utils'
import moment from 'moment'
import { selectThemeColors } from '@utils'
import { toast } from 'react-toastify'

const statusList = [
  {
    value: 'ALL',
    label: 'ALL'
  },
  {
    value: 'COMPLETED',
    label: 'COMPLETED'
  },
  {
    value: 'NOT_COMPLETED',
    label: 'NOT COMPLETED'
  }
]

const CustomHeader = ({ 
  handlePerPage,
  rowsPerPage, 
  handleFilter, 
  searchTerm,
  addNewTask
}) => {
  return (
    <div className='w-100 me-1 ms-50 mt-2 mb-75'>
      <Row>
        <Col xl='6' className='d-flex align-items-center p-0'>
          <div className='d-flex align-items-center w-100'>
            <label htmlFor='rows-per-page'>Show</label>
            <Input
              className='mx-50'
              type='select'
              id='rows-per-page'
              value={rowsPerPage}
              onChange={handlePerPage}
              style={{ width: '5rem' }}
            >
              <option value='10'>10</option>
              <option value='25'>25</option>
              <option value='50'>50</option>
            </Input>
            <label htmlFor='rows-per-page'>Entries</label>
          </div>
        </Col>
        <Col
          xl='6'
          className='d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1'
        >
          <div className='d-flex align-items-center mb-sm-0 mb-1 me-1'>
            <label className='mb-0' htmlFor='search-invoice'>
              Search:
            </label>
            <Input
              id='search-invoice'
              className='ms-50 w-100'
              type='text'
              value={searchTerm}
              onChange={e => handleFilter(e.target.value)}
            />
          </div>

          <div className='d-flex align-items-center table-header-actions'>
            <Button onClick={() => addNewTask()} color='primary'>
              Add Task
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  )
}

const Tasks = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.storeApp)

  // ** States
  const [sort, setSort] = useState('desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState('creation_date')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentStatus, setCurrentStatus] = useState({ value: 'ALL', label: 'All'})
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [startingDate, setStartingDate] = useState(new Date(moment().startOf('day')))
  const [endingDate, setEndingDate] = useState(new Date(moment().endOf('day')))
  const [selectedTask, setSelectedTask] = useState(null)
  const user = getUserData()
  const {
    reset,
    control,
    setError,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { 
    name: '',
    description: '',
    user: ''
  } })

  useEffect(() => {
    if (store.error) {
      toast.error(
        <Fragment>
          <div className='toastify-header'>
            <div className='title-wrapper'>
              <Avatar size='sm' color='danger' icon={<AlertTriangle size={12} />} />
              <h6 className='toast-title'>Error occured!</h6>
            </div>
          </div>
          <div className='toastify-body'>
            <p>{store.error}</p>
          </div>
        </Fragment>,
        { icon: false, hideProgressBar: true }
      )
    }
  }, [dispatch, store.error])
  
  const handleDiscard = () => {
    setSelectedTask(null)
    reset()
    setShow(false)
  }

  const onSubmit = data => {
    if (Object.values(data).every(field => {
      if (field.value) return field.value.length > 0
      else return field.length > 0
    })) {
      if (selectedTask !== null) {
        dispatch(updateTask({ 
          id: selectedTask._id, 
          name: data.name,
          description: data.description,
          user: data.user.value,
          status: selectedTask.status
        }))
        reset()
        setSelectedTask(null)
      } else {
        dispatch(addTask({ 
          name: data.name,
          description: data.description,
          user: data.user.value
        }))
        reset()
      }
      setShow(false)
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }

  useEffect(() => {
    dispatch(
      getTasks({
        sort,
        sortColumn,
        q: searchTerm,
        page: currentPage,
        size: rowsPerPage,
        status: currentStatus.value,
        startingDate,
        endingDate
      })
    )
    dispatch(getUsers())
  }, [dispatch, sort, sortColumn, currentPage])
  
  const handlePagination = page => {
    dispatch(
      getTasks({
        sort,
        sortColumn,
        q: searchTerm,
        size: rowsPerPage,
        status: currentStatus.value,
        page: page.selected + 1,
        startingDate,
        endingDate
      })
    )
    setCurrentPage(page.selected + 1)
  }

  const handlePerPage = e => {
    const value = parseInt(e.currentTarget.value)
    dispatch(
      getTasks({
        sort,
        sortColumn,
        q: searchTerm,
        size: value,
        status: currentStatus.value,
        page: currentPage,
        startingDate,
        endingDate
      })
    )
    setRowsPerPage(value)
  }
  const handleFilter = val => {
    setSearchTerm(val)
    setCurrentPage(1)
    setTimeout(() => {
      dispatch(
        getTasks({
          sort,
          q: val,
          sortColumn,
          page: currentPage,
          size: rowsPerPage,
          status: currentStatus.value,
          startingDate,
          endingDate
        })
      )
    }, 500)
  }

  useEffect(() => {
    dispatch(
      getTasks({
        sort,
        sortColumn,
        q: searchTerm,
        page: currentPage,
        size: rowsPerPage,
        status: currentStatus.value,
        startingDate,
        endingDate
      })
    )
  }, [startingDate, endingDate])

  const CustomPagination = () => {
    const count = Number(Math.ceil(store.totalTasks / rowsPerPage))

    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        pageCount={count || 1}
        activeClassName='active'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={page => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        containerClassName={'pagination react-paginate justify-content-end my-2 pe-1'}
      />
    )
  }

  const dataToRender = () => {
    const filters = {
      q: searchTerm
    }

    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0
    })

    if (store.tasks.length > 0) {
      return store.tasks
    } else if (store.tasks.length === 0 && isFiltered) {
      return []
    }
  }

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection)
    setSortColumn(column.sortField)
    dispatch(
      getTasks({
        sort,
        sortColumn,
        q: searchTerm,
        page: currentPage,
        size: rowsPerPage,
        status: currentStatus.value,
        startingDate,
        endingDate
      })
    )
  }

  const handleConfirmation = () => {
    dispatch(updateTask({ 
      id: selectedTask._id, 
      name: selectedTask.name,
      description: selectedTask.description,
      user: selectedTask.user._id,
      status: 'COMPLETED'
    }))
    setSelectedTask(null)
    setConfirmationModalOpen(false)
  }

  const handleModalClosed = () => {
    setSelectedTask(null)
    setValue('name', '')
    setValue('description', '')
    setValue('user', '')
  }

  const handleEditClick = data => {
    setSelectedTask(data)
    setValue('name', data.name)
    setValue('description', data.description)
    setValue('user', { value: data.user._id, label: `${data.user.first_name} ${data.user.last_name}`})
    setShow(true)
  }

  const handleCompleteClick = data => {
    setSelectedTask(data)
    setConfirmationModalOpen(true)
  }

  const handleAddTask = () => {
    setSelectedTask(null)
    setValue('name', '')
    setValue('description', '')
    setValue('user', { value: user._id, label: `${user.first_name} ${user.last_name}`})
    setShow(true)
  }
  
  const renderForm = () => {
    if (selectedTask === null) {
      return (
        <Row tag={Form} onSubmit={handleSubmit(onSubmit)}>
          <Col xs={12}>
            <Label className='form-label' for='name'>
              Name
            </Label>
            <Controller
              control={control}
              id='name'
              name='name'
              render={({ field }) => (
                <Input  placeholder='Name' invalid={errors.name && true} {...field} />
              )}
            />
            {errors && errors.name && <FormFeedback>Please enter a valid Name</FormFeedback>}
          </Col>
          <Col xs={12}>
            <Label className='form-label' for='description'>
              Description
            </Label>
            <Controller
              control={control}
              id='description'
              name='description'
              render={({ field }) => (
                <Input type="textarea" placeholder='Description' invalid={errors.description && true} {...field} />
              )}
            />
            {errors && errors.description && <FormFeedback>Please enter a valid Description</FormFeedback>}
          </Col>
          <Col xs={12}>
            <Label className='form-label' for='user'>
              User
            </Label>
            <Controller
              control={control}
              id='user'
              name='user'
              render={({ field }) => (<Select 
                theme={selectThemeColors}
                isClearable={false}
                id={`user`}
                className='react-select'
                classNamePrefix='select'
                placeholder="Select user"
                options={store.users.map((item) => { return { value: item._id, label: `${item.first_name} ${item.last_name}`} })}
                isDisabled={user.type === 'SIMPLE'}
                {...field} 
                />
              )}
            />
          </Col>
          <Col xs={12} className='text-center mt-2'>
            <Button className='me-1' color='primary'>
              Create Task
            </Button>
            <Button outline type='reset' onClick={handleDiscard}>
              Discard
            </Button>
          </Col>
        </Row>
      )
    } else {
      return (
        <Row tag={Form} onSubmit={handleSubmit(onSubmit)}>
          <Col xs={12}>
            <Label className='form-label' for='name'>
              Name
            </Label>
            <Controller
              control={control}
              id='name'
              name='name'
              render={({ field }) => (
                <Input  placeholder='Name' invalid={errors.name && true} {...field} />
              )}
            />
            {errors && errors.name && <FormFeedback>Please enter a valid Name</FormFeedback>}
          </Col>
          <Col xs={12}>
            <Label className='form-label' for='description'>
              Description
            </Label>
            <Controller
              control={control}
              id='description'
              name='description'
              render={({ field }) => (
                <Input type="textarea" placeholder='Description' invalid={errors.description && true} {...field} />
              )}
            />
            {errors && errors.description && <FormFeedback>Please enter a valid Description</FormFeedback>}
          </Col>
          <Col xs={12}>
            <Label className='form-label' for='user'>
              User
            </Label>
            <Controller
              control={control}
              id='user'
              name='user'
              render={({ field }) => (<Select 
                theme={selectThemeColors}
                isClearable={false}
                id={`user`}
                className='react-select'
                classNamePrefix='select'
                placeholder="Select user"
                options={store.users.map((item) => { return { value: item._id, label: `${item.first_name} ${item.last_name}`} })}
                isDisabled={user.type === 'SIMPLE'}
                {...field} 
                />
              )}
            />
          </Col>
          <Col xs={12} className='text-center mt-2'>
            <Button className='me-1' color='primary'>
              Update Task
            </Button>
            <Button outline type='reset' onClick={handleDiscard}>
              Discard
            </Button>
          </Col>
        </Row>
      )
    }
  }

  const columns = [
    {
      name: 'Name',
      sortable: true,
      minWidth: '200px',
      sortField: 'name',
      selector: row => row.name,
      cell: row => row.name
    },
    {
      name: 'User',
      sortable: true,
      minWidth: '150px',
      sortField: 'user',
      selector: row => `${row.user.first_name} ${row.user.last_name}`,
      cell: row => `${row.user.first_name} ${row.user.last_name}`
    },
    {
      name: 'Status',
      sortable: true,
      minWidth: '150px',
      sortField: 'status',
      selector: row => row.status,
      cell: row => {
        return (
          <Badge color={row.status === 'COMPLETED' ? 'light-success' : 'light-primary'} pill>
            {row.status}
          </Badge>
        )
      }
    },
    {
      name: 'Completion Date',
      minWidth: '200px',
      sortable: true,
      sortField: 'completion_date',
      selector: row => row.completion_date,
      cell: row => (row.completion_date ? moment(row.completion_date).format('YYYY-MM-DD HH:mm') : '---')
    },
    {
      name: 'Creation Date',
      minWidth: '200px',
      sortable: true,
      sortField: 'creation_date',
      selector: row => row.creation_date,
      cell: row => moment(row.creation_date).format('YYYY-MM-DD HH:mm')
    },
    {
      name: 'Actions',
      minWidth: '100px',
      cell: row => {
        return (
          <div className='auth-footer-btn d-flex justify-content-center'>
              <Button color='primary' style={{ padding: 5, marginRight: 3}} size='sm' onClick={() => handleEditClick(row)}>
                <Edit2 size={16} />
              </Button>
              {row.status === 'NOT_COMPLETED' && (
                <Button color='success' style={{ padding: 5 }} size='sm' onClick={() => handleCompleteClick(row)}>
                  <Check size={16} />
                </Button>
              )}
            </div>
        )
      }
    }
  ]

  return (
    <Fragment>
      <Breadcrumbs breadCrumbTitle={'Tasks'} breadCrumbActive={'Tasks'} />
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Filters</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md='4'>
              <Label for='status'>Status</Label>
              <Select
                theme={selectThemeColors}
                isClearable={false}
                className='react-select'
                classNamePrefix='select'
                options={statusList}
                value={currentStatus}
                onChange={data => {
                  setCurrentStatus(data)
                  dispatch(
                    getTasks({
                      sort,
                      sortColumn,
                      q: searchTerm,
                      page: currentPage,
                      size: rowsPerPage,
                      status: data.value,
                      startingDate,
                      endingDate
                    })
                  )
                }}
              />
            </Col>
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
          </Row>
        </CardBody>
      </Card>
      <Card className='overflow-hidden'>
        <div className='react-dataTable'>
          <DataTable
            noHeader
            subHeader
            sortServer
            pagination
            responsive
            paginationServer
            columns={columns}
            onSort={handleSort}
            sortIcon={<ChevronDown />}
            className='react-dataTable'
            paginationComponent={CustomPagination}
            data={dataToRender()}
            subHeaderComponent={
              <CustomHeader
                store={store}
                searchTerm={searchTerm}
                rowsPerPage={rowsPerPage}
                handleFilter={handleFilter}
                handlePerPage={handlePerPage}
                addNewTask={handleAddTask}
              />
            }
          />
        </div>
      </Card>
      <Modal isOpen={show} onClosed={handleModalClosed} toggle={() => setShow(!show)} className='modal-dialog-centered'>
        <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}></ModalHeader>
        <ModalBody
          className={classnames({
            'p-3 pt-0': selectedTask !== null,
            'px-sm-5 pb-5': selectedTask === null
          })}
        >
          <div className='text-center mb-2'>
            <h1 className='mb-1'>{selectedTask !== null ? 'Edit' : 'Add New'} Task</h1>
          </div>

          {renderForm()}
        </ModalBody>
      </Modal>
      <Modal isOpen={isConfirmationModalOpen} toggle={() => setConfirmationModalOpen(!isConfirmationModalOpen)}>
        <ModalHeader toggle={() => setConfirmationModalOpen(!isConfirmationModalOpen)}>
          Complete Task Confirmation
        </ModalHeader>
        <ModalBody>
          Are you sure you want to proceed with this action?
        </ModalBody>
        <div className="modal-footer">
          <Button color="primary" onClick={handleConfirmation}>
            Yes
          </Button>
          <Button color="secondary" onClick={() => setConfirmationModalOpen(false)}>
            No
          </Button>
        </div>
      </Modal>
    </Fragment>
  )
}

export default Tasks