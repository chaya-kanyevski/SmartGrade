import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Auth from "./components/auth/auth";
import ExamList from "./components/exams/examList";


export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout/>,
        errorElement: <h1>Error!</h1>,
        children: [
            { path : '/', element: <Home/>},
            { path : '/home', element: <Home/>},
            { path : '/about', element: <About/>},
            { path : '/auth', element: <Auth/>},
            { path : '/login', element: <Login/>},
            { path: '/register', element: <Register/>},
            { path: '/exam-list', element: <ExamList/>}
        ]
    }
])