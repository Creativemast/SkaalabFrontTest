import 'react-perfect-scrollbar/dist/css/styles.css'
import '@styles/react/libs/toastify/toastify.scss'
import './@core/assets/fonts/feather/iconfont.css'
import './@core/scss/core.scss'
import './assets/scss/style.scss'

import * as serviceWorker from './serviceWorker'

import { Suspense, lazy } from 'react'

import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import Spinner from './@core/components/spinner/Fallback-spinner'
import { ThemeContext } from './utility/context/ThemeColors'
import { ToastContainer } from 'react-toastify'
import { store } from './redux/store'

// ** Lazy load app
const LazyApp = lazy(() => import('./App'))

ReactDOM.render(
  <Provider store={store}>
    <Suspense fallback={<Spinner />}>
      <ThemeContext>
        <LazyApp />
        <ToastContainer newestOnTop />
      </ThemeContext>
    </Suspense>
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
