import { RouterProvider } from 'react-router-dom'
import './App.css'
import { router } from './Router'
import UserReducer, { initialUser, UserContext } from './context/UserReducer'
import { useReducer } from 'react';

function App() {
  const [user, userDispatch] = useReducer(UserReducer, initialUser);
  return (
    <>
    <UserContext.Provider value={{ user, userDispatch }}>
      <RouterProvider router={router} />
    </UserContext.Provider>
    </>
  )
}

export default App
