import { RouterProvider } from 'react-router-dom'
import './App.css'
import { router } from './Router'
import UserReducer, { initialUser, UserContext } from './context/UserReducer'
import { useReducer } from 'react';
import { ToastProvider } from './context/ToastContext';

function App() {
  const [user, userDispatch] = useReducer(UserReducer, initialUser);
  return (
    <>
        <ToastProvider>
    <UserContext.Provider value={{ user, userDispatch }}>
      <RouterProvider router={router} />
    </UserContext.Provider>
    </ToastProvider>
    </>
  )
}

export default App
