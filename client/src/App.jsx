import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './pages/RootLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ErrorElement from './pages/ErrorElement'
import AddEmployee from './components/EmployeeManagement/AddEmployee'
import EmployeeLayout from './pages/EmployeeLayout'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorElement />,
      children: [
        {
          index: true,
          element: <Login />
        },
        {
          path: "dashboard",
          element: <Dashboard />
        },
        {
          path: "employee",
          element: <EmployeeLayout />,
          children: [
            {
              path: "add-employee",
              element: <AddEmployee />
            },
            {
              path: "edit-employee/:id",
              element: <AddEmployee />
            }
          ]
        }
      ]
    }
  ])

  return (
    <RouterProvider router={router}></RouterProvider>
  )
}

export default App
