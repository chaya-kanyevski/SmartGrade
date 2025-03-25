import { RouterProvider } from 'react-router-dom'
import './App.css'
import { router } from './Router'
import UserReducer, { initialUser, UserContext } from './context/UserReducer'
import { useReducer } from 'react';
import { ExamProvider } from './context/ExamContext';

function App() {
  const [user, userDispatch] = useReducer(UserReducer, initialUser);
  return (
    <>
    <ExamProvider>
    <UserContext.Provider value={{ user, userDispatch }}>
      <RouterProvider router={router} />
    </UserContext.Provider>
    </ExamProvider>
    </>
  )
}

export default App
