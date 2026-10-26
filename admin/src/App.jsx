import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'


export const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
export const currency = '$'

const App = () => {
  const [token, setToken] = useState('')
  return (
    <div className='bg-gray-50 min-h-screen'>
      <Navbar setToken={setToken} />
      <hr />
      <div className='flex w-full'>
        <Sidebar />
        <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
          <Routes>
            <Route path='/' element={<Navigate to='/list' replace />} />
            <Route path='/add' element={<Add token={token} />} />
            <Route path='/list' element={<List token={token} />} />
            <Route path='/orders' element={<Orders token={token} />} />
          </Routes>
        </div>
      </div>
      <ToastContainer position='bottom-center' autoClose={3000} />
    </div>
  )
}

export default App
