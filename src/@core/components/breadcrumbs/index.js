import {
  Breadcrumb,
  BreadcrumbItem,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledButtonDropdown
} from 'reactstrap'
import { Calendar, CheckSquare, Grid, Mail, MessageSquare } from 'react-feather'

import { Link } from 'react-router-dom'
import Proptypes from 'prop-types'

const BreadCrumbs = props => {
  // ** Props
  const { breadCrumbTitle, breadCrumbActive } = props

  return (
    <div className='content-header row'>
      <div className='content-header-left col-md-9 col-12 mb-2'>
        <div className='row breadcrumbs-top'>
          <div className='col-12'>
            {breadCrumbTitle ? <h2 className='content-header-title float-start mb-0'>{breadCrumbTitle}</h2> : ''}
            {breadCrumbActive && (
              <div className='breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12'>
                <Breadcrumb>
                  <BreadcrumbItem tag='li'>
                    <Link to='/'>Home</Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem tag='li' active>
                    {breadCrumbActive}
                  </BreadcrumbItem>
                </Breadcrumb>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default BreadCrumbs

// ** PropTypes
BreadCrumbs.propTypes = {
  breadCrumbTitle: Proptypes.string.isRequired,
  breadCrumbActive: Proptypes.string.isRequired
}
