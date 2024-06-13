import React from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from './pages/Home/Home'
import SignUp from './pages/SignUp/SignUp'
import Login from './pages/Login/Login'


const routes = (
  <BrowserRouter>
    <Routes>
      <Route path = "/home" exact element = {<Home/>} />
      <Route path = "/signup" exact element = {<SignUp/>} />
      <Route path = "/login" exact element = {<Login/>} />
    </Routes>
  </BrowserRouter>
)

const App = () => {
  return (
    <div>
      {routes}
    </div>
  )
}

export default App