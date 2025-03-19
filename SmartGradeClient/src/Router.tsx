import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./components/auth/login";
import Register from "./components/auth/register";


export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout/>,
        errorElement: <h1>Error!</h1>,
        children: [
            { path : '/', element: <Home/>},
            { path : '/home', element: <Home/>},
            { path : '/about', element: <About/>},
            { path : '/login', element: <Login/>},
            { path: '/register', element: <Register/>}
        ]
    }
])