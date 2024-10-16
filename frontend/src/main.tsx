import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'

import App from '@/App.tsx'
import store from '@/store/store.ts'

import '@/index.css'

const originalConsoleError = console.error
console.error = (message, ...args) => {
  if (
    typeof message === 'string' &&
    message.includes('defaultProps will be removed')
  ) {
    return
  }
  originalConsoleError.apply(console, [message, ...args])
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </StrictMode>
)
