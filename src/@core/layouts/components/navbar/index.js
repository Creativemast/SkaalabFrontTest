// ** Reactstrap Imports
import { NavItem, NavLink } from 'reactstrap'

// ** React Imports
import { Fragment } from 'react'
// ** Third Party Components
import { Menu } from 'react-feather'
// ** Custom Components
import NavbarUser from './NavbarUser'

const ThemeNavbar = props => {
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props

  return (
    <Fragment>
      <ul className='navbar-nav d-xl-none'>
        <NavItem className='mobile-menu me-auto d-flex align-items-center'>
          <NavLink className='nav-menu-main menu-toggle hidden-xs is-active' onClick={() => setMenuVisibility(true)}>
            <Menu className='ficon' />
          </NavLink>
        </NavItem>
      </ul>
      <NavbarUser skin={skin} setSkin={setSkin} />
    </Fragment>
  )
}

export default ThemeNavbar
