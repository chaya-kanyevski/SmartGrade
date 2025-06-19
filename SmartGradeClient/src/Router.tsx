import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import AIQuestionGenerator from "./components/ai/AIQuestionGenerator";
import AISummaryGenerator from "./components/ai/AISummaryGenerator";
import AITextAnalyzer from "./components/ai/AITextAnalyzer";
import AILessonPlanGenerator from "./components/ai/AILessonPlanGenerator";
import AI from "./pages/AI";
import Dashboard from "./pages/Dashboard";
import Files from "./pages/Files";
import Chat from "./pages/Chat";
import Landing from "./pages/Landing";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/user/PrivateRoute";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
    errorElement: <h1>Error!</h1>
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    element: <PrivateRoute />, // 👈 עוטף את כל הפרייבט רואטס!
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/AI-question-generator', element: <AIQuestionGenerator /> },
          { path: '/AI-summary-generator', element: <AISummaryGenerator /> },
          { path: '/AI-text-analyzer', element: <AITextAnalyzer /> },
          { path: '/AI-lesson-plan-generator', element: <AILessonPlanGenerator /> },
          { path: '/AI', element: <AI /> },
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/files', element: <Files /> },
          { path: '/chat', element: <Chat /> },
          { path: '/reports', element: <Reports /> },
          { path: '/profile', element: <Profile /> },
        ]
      }
    ]
  }
]);