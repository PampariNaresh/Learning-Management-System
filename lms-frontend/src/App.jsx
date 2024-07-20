
import './App.css'

import { useEffect } from 'react'
import toast from 'react-hot-toast'
import {Route,Routes} from "react-router-dom"

import AboutUs from './pages/AboutUs'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import SignIn from  "./pages/SignIn"
import SignUp  from './pages/SignUp'
function App() {

useEffect(()=>{
  toast.success(" You Are Welcome");
})
  return (
    <>
      
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/about' element={<AboutUs/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/signin' element={<SignIn/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </>
  )
}

export default App
