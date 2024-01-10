import '@styles/react/pages/page-authentication.scss'

import { AlertTriangle, Coffee } from 'react-feather'
import { Button, CardText, CardTitle, Col, Form, Input, Label, Row } from 'reactstrap'
import { Controller, useForm } from 'react-hook-form'
import { Link, useHistory } from 'react-router-dom'
import { Slide, toast } from 'react-toastify'

import Avatar from '@components/avatar'
import { Fragment } from 'react'
import InputPasswordToggle from '@components/input-password-toggle'
import SkaalabLogo from '@src/assets/images/logo/logo-v1.svg'
import SkaalabLogoDark from '@src/assets/images/logo/logo-v1-dark.svg'
import { handleLogin } from '@store/authentication'
import { useDispatch } from 'react-redux'
import useJwt from '@src/auth/jwt/useJwt'
import { useSkin } from '@hooks/useSkin'

const ToastContent = ({ name, role }) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
        <h6 className='toast-title fw-bold'>Welcome, {name}</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>You have successfully logged in as a {role} user to SKAALAB Test.</span>
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
  password: 'roudali',
  email: 'eh_roudali@esi.dz'
}

const LoginCover = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { skin } = useSkin()

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const illustration = skin === 'dark' ? 'graphic-1.png' : 'graphic-1.png',
    source = require(`@src/assets/images/pages/${illustration}`).default
    
  const onSubmit = data => {
    if (Object.values(data).every(field => field.length > 0)) {
      useJwt
        .login({ email: data.email, password: data.password })
        .then(res => {
          const data = { ...res.data.data?.user, accessToken: res.data.data?.token, refreshToken: res.data.data?.refreshToken }
          dispatch(handleLogin(data))
          history.push('/')
          toast.success(
            <ToastContent name={data.assigned_to.name} role={data.type} />,
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
              Welcome to SKAALAB Test
            </CardTitle>
            <CardText className='mb-2'>Please sign-in to your account</CardText>
            <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-1'>
                <Label className='form-label' for='login-email'>
                  Email
                </Label>
                <Controller
                  id='email'
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <Input 
                      type='text' 
                      placeholder='hemza@skaalab.com' 
                      invalid={errors.email && true}
                      autoFocus 
                      {...field}
                    />
                  )}
                />
              </div>
              <div className='mb-1'>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='login-password'>
                    Password
                  </Label>
                </div>
                <Controller
                  id='password'
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle 
                      className='input-group-merge' 
                      invalid={errors.password && true} 
                      {...field}
                    />
                  )}
                />
              </div>
              <div className='form-check mb-1'>
                <Input type='checkbox' id='remember-me' />
                <Label className='form-check-label' for='remember-me'>
                  Remember Me
                </Label>
              </div>
              <Button type='submit' color='primary' block>
                Sign in
              </Button>
            </Form>
            <p className='text-center mt-2'>
              <span className='me-25'>New on our platform?</span>
              <Link to='/register'>
                <span>Create an account</span>
              </Link>
            </p>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default LoginCover
