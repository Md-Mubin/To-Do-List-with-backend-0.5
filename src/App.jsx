
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home/Home'
import LayoutOne from './Layouts/LayoutOne'
import app from './firebase.config'

function App() {

  const myRoute = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path='/' element={<LayoutOne />}>
          <Route index element={<Home />} />
        </Route>
      </Route>
    )
  )

  return (
    <>
      <RouterProvider router={myRoute} />
    </>
  )
}

export default App
