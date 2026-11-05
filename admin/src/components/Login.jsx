import axios from 'axios'
import React, { useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Login = ({ setToken }) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await axios.post(backendUrl + '/api/user/admin', { email, password })
      if (response.data.success) {
        setToken(response.data.token)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center w-full bg-gray-50 px-4'>
      <div className='bg-white border border-gray-200 rounded-2xl px-8 py-8 w-full max-w-md'>
        <div className='flex items-center gap-2.5 mb-6'>
          <span
            className='w-8 h-8 bg-black text-white text-sm font-semibold flex items-center justify-center rounded'
            aria-hidden='true'
          >
            F
          </span>
          <div>
            <p className='font-semibold tracking-tight text-black leading-tight'>Foxie Shop</p>
            <p className='text-xs text-gray-600'>Admin sign in</p>
          </div>
        </div>

        <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
          <div>
            <label htmlFor='login-email' className='block text-sm font-medium text-black mb-1.5'>
              Email address
            </label>
            <input
              id='login-email'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className='w-full px-3 py-2 rounded-md'
              type='email'
              placeholder='you@foxieshop.com'
              autoComplete='email'
              required
            />
          </div>
          <div>
            <label htmlFor='login-password' className='block text-sm font-medium text-black mb-1.5'>
              Password
            </label>
            <input
              id='login-password'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className='w-full px-3 py-2 rounded-md'
              type='password'
              placeholder='Enter your password'
              autoComplete='current-password'
              required
            />
          </div>
          <button
            type='submit'
            disabled={submitting}
            className='mt-2 w-full py-2.5 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors duration-150'
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
