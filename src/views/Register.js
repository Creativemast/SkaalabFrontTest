import '@styles/react/pages/page-authentication.scss'

import { AlertTriangle, Coffee } from 'react-feather'
import { Button, CardText, CardTitle, Col, Form, FormFeedback, Input, Label, Row } from 'reactstrap'
import { Controller, useForm } from 'react-hook-form'
import { Link, useHistory } from 'react-router-dom'
import { Slide, toast } from 'react-toastify'

import Avatar from '@components/avatar'
import { Fragment } from 'react'
import InputPasswordToggle from '@components/input-password-toggle'
import Select from 'react-select'
import SkaalabLogo from '@src/assets/images/logo/logo-v1.svg'
import SkaalabLogoDark from '@src/assets/images/logo/logo-v1-dark.svg'
import useJwt from '@src/auth/jwt/useJwt'
import { useSkin } from '@hooks/useSkin'

const ToastContent = ({ name }) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
        <h6 className='toast-title fw-bold'>Welcome, {name}</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>You have successfully created an account, please login.</span>
    </div>
  </Fragment>
)

const ToastErrorContent = ({ error }) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='danger' icon={<AlertTriangle size={12} />} />
        <h6 className='toast-title fw-bold'>Error: {error.status}</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>{error.data.message}</span>
    </div>
  </Fragment>
)

const defaultValues = {
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  type: { value: 'SIMPLE', label: 'SIMPLE' },
  terms: false
}

const Register = () => {
  // ** Hooks
  const history = useHistory()
  const { skin } = useSkin()

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const illustration = skin === 'dark' ? 'graphic-2.png' : 'graphic-2.png',
    source = require(`@src/assets/images/pages/${illustration}`).default

  const onSubmit = data => {
    const tempData = { ...data }
    delete tempData.terms
    if (Object.values(tempData).every(field => field?.length > 0 || field?.value?.length > 0) && data.terms === true) {
      const { email, password, first_name, last_name, type } = data
      console.log(data)
      useJwt
        .register({ email, password, first_name, last_name, type: type.value })
        .then(() => {
          history.push('/')
          toast.success(
            <ToastContent name={`${first_name} ${last_name}`} />,
            { icon: false, transition: Slide, hideProgressBar: false, autoClose: 2000 }
          )
        })
        .catch(error => {
          if (error.response) {
            toast.error(
              <ToastErrorContent error={error.response} />,
              { icon: false, transition: Slide, hideProgressBar: false, autoClose: 2000 }
            )
          }
        })
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual',
            message: `Please enter a valid ${key.replace('_', '')}`
          })
        }
        if (key === 'terms' && data.terms === false) {
          setError('terms', {
            type: 'manual'
          })
        }
      }
    }
  }

  return (
    <div className='auth-wrapper auth-cover'>
      <Row className='auth-inner m-0'>
        <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
          {skin === 'dark' ? <img style={{ width: 200 }} src={SkaalabLogoDark} alt="Skaalab Logo Dark" /> : <img style={{ width: 200 }} src={SkaalabLogo} alt="Skaalab Logo" />}
        </Link>
        <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
            <img className='img-fluid' src={source} alt='Login Cover' />
          </div>
        </Col>
        <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
          <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            <CardTitle tag='h2' className='fw-bold mb-1'>
              Adventure starts here 🚀
            </CardTitle>
            <CardText className='mb-2'>Create your account easily and have fun!</CardText>

            <Form action='/' className='auth-register-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-1'>
                <Label className='form-label' for='email'>
                  Email
                </Label>
                <Controller
                  id='email'
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <Input autoFocus type='email' placeholder='john@skaalab.com' invalid={errors.email && true} {...field} />
                  )}
                />
                {errors.email ? <FormFeedback>{errors.email.message}</FormFeedback> : null}
              </div>
              <div className='mb-1'>
                <Label className='form-label' for='password'>
                  Password
                </Label>
                <Controller
                  id='password'
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle className='input-group-merge' invalid={errors.password && true} {...field} />
                  )}
                />
              </div>
              <div className='mb-1'>
                <Label className='form-label' for='first_name'>
                  First Name
                </Label>
                <Controller
                  id='first_name'
                  name='first_name'
                  control={control}
                  render={({ field }) => (
                    <Input placeholder='John' invalid={errors.first_name && true} {...field} />
                  )}
                />
                {errors.first_name ? <FormFeedback>{errors.first_name.message}</FormFeedback> : null}
              </div>
              <div className='mb-1'>
                <Label className='form-label' for='last_name'>
                  Last Name
                </Label>
                <Controller
                  id='last_name'
                  name='last_name'
                  control={control}
                  render={({ field }) => (
                    <Input placeholder='Doe' invalid={errors.last_name && true} {...field} />
                  )}
                />
                {errors.last_name ? <FormFeedback>{errors.last_name.message}</FormFeedback> : null}
              </div>
              <div className='mb-1'>
                <Label className='form-label' for='type'>
                  Type
                </Label>
                <Controller
                  id='type'
                  name='type'
                  control={control}
                  render={({ field }) => (
                    <Select
                      isClearable={false}
                      placeholder='Select your type'
                      options={[{ value: 'SIMPLE', label: 'SIMPLE' }, { value: 'ADMIN', label: 'ADMIN' }]}
                      className='react-select'
                      classNamePrefix='select'
                      invalid={errors.type && true} {...field} 
                    />
                  )}
                />
                {errors.last_name ? <FormFeedback>{errors.last_name.message}</FormFeedback> : null}
              </div>
              <div className='form-check mb-1'>
                <Controller
                  name='terms'
                  control={control}
                  render={({ field }) => (
                    <Input {...field} id='terms' type='checkbox' checked={field.value} invalid={errors.terms && true} />
                  )}
                />
                <Label className='form-check-label' for='terms'>
                  I agree to
                  <a className='ms-25' href='/' onClick={e => e.preventDefault()}>
                    privacy policy & terms
                  </a>
                </Label>
              </div>
              <Button type='submit' block color='primary'>
                Sign up
              </Button>
            </Form>
            <p className='text-center mt-2'>
              <span className='me-25'>Already have an account?</span>
              <Link to='/login'>
                <span>Sign in instead</span>
              </Link>
            </p>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Register
