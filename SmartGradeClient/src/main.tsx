import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { ExamProvider } from './context/ExamContext.tsx'
import store from './store/store.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <ExamProvider>
        <App />
    </ExamProvider>        
    </Provider>
  </StrictMode>,
)
