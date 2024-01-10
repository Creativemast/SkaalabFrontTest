import { CheckSquare, CreditCard, HelpCircle, Mail, MessageSquare, Power, Settings, User } from 'react-feather'
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'
import { useEffect, useState } from 'react'

import Avatar from '@components/avatar'
import { Link } from 'react-router-dom'
import defaultAvatar from '@src/assets/images/portrait/small/avatar.jpg'
import { handleLogout } from '@store/authentication'
import { isUserLoggedIn } from '@utils'
import { useDispatch } from 'react-redux'

const UserDropdown = () => {
  // ** Store Vars
  const dispatch = useDispatch()

  // ** State
  const [userData, setUserData] = useState(null)

  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem('userData')))
    }
  }, [])
  const userAvatar = (userData && userData.avatar) || defaultAvatar
  const userName = (userData && `${userData.first_name} ${userData.last_name}`) || 'Undefined User'

  return (
    <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link' onClick={e => e.preventDefault()}>
        <div className='user-nav d-sm-flex d-none'>
          <span className='user-name fw-bold'>{userName}</span>
          <span className='user-status'>{(userData && userData.type) || ''}</span>
        </div>
        <Avatar img={userAvatar} imgHeight='40' imgWidth='40' status='online' />
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem tag={Link} to='/login' onClick={() => dispatch(handleLogout())}>
          <Power size={14} className='me-75' />
          <span className='align-middle'>Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
