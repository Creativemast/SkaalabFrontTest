import '@styles/base/pages/page-misc.scss'

import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import SkaalabLogo from '@src/assets/images/logo/logo-v1.svg'
import SkaalabLogoDark from '@src/assets/images/logo/logo-v1-dark.svg'
import { useSkin } from '@hooks/useSkin'

const Error = () => {
  // ** Hooks
  const { skin } = useSkin()

  const illustration = skin === 'dark' ? 'error-dark.svg' : 'error.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default
  return (
    <div className='misc-wrapper'>
      <a className='brand-logo' href='/'>
        {skin === 'dark' ? <img style={{ width: 200 }} src={SkaalabLogoDark} alt="Skaalab Logo Dark" /> : <img style={{ width: 200 }} src={SkaalabLogo} alt="Skaalab Logo" />}
      </a>
      <div className='misc-inner p-2 p-sm-3'>
        <div className='w-100 text-center'>
          <h2 className='mb-1'>Page Not Found 🕵🏻‍♀️</h2>
          <p className='mb-2'>Oops! 😖 The requested URL was not found on this server.</p>
          <Button tag={Link} to='/' color='primary' className='btn-sm-block mb-2'>
            Back to home
          </Button>
          <img className='img-fluid' src={source} alt='Not authorized page' />
        </div>
      </div>
    </div>
  )
}
export default Error