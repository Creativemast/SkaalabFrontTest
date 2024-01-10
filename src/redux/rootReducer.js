// ** Reducers Imports

import auth from './authentication'
import layout from './layout'
import navbar from './navbar'
import storeApp from '@src/views/store'

const rootReducer = {
  auth,
  navbar,
  layout,
  storeApp
}

export default rootReducer
