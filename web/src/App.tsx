import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import History from './pages/history/history';
import Login from './pages/login/login';
import Log from './pages/log/log';
import Progress from './pages/progress/progress';
import Home from './pages/home/home';
import NotFound from './NotFound';
import RootLayout from './RootLayout';
import { ErrorPage } from './ErrorPage';
import AuthLayout from './AuthLayout';
import ProtectedRoute from './ProtectedRoute';

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "/login", element: <Login /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <RootLayout />,
            ErrorBoundary: ErrorPage,
            errorElement: <NotFound />,
            children: [
              { index: true, element: <Home /> },
              { path: "history", element: <History /> },
              { path: "log", element: <Log /> },
              { path: "progress", element: <Progress /> },
              { path: "*", element: <NotFound /> }
            ],
          },
        ]
      }
    ]
  }
],
  { basename: import.meta.env.BASE_URL }
);


function App() {
  return (
    <div className={"max-w-120 h-full flex "}>
      <RouterProvider router={router} />
    </div>
  )
}

export default App

