import { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)
  const location = useLocation()

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const onSubmitHandler = async (event) => {
      event.preventDefault();
      try {
        if (currentState === 'Sign Up') {

          const response = await axios.post(backendUrl + '/api/user/register', { name, email, password })
          if (response.data.success) {
            setToken(response.data.token)
            localStorage.setItem('token', response.data.token)
          } else {
            toast.error(response.data.message)
          }

        } else {

          const response = await axios.post(backendUrl + '/api/user/login', { email, password })
          if (response.data.success) {
            setToken(response.data.token)
            localStorage.setItem('token', response.data.token)
          } else {
            toast.error(response.data.message)
          }

        }


      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
  }

  useEffect(() => {
    if (token) {
      navigate(location.state?.from || '/')
    }
  }, [token])

  const isLogin = currentState === 'Login'

  return (
    <div className='flex min-h-[70vh] items-center justify-center py-14'>
      <form onSubmit={onSubmitHandler} className='w-full max-w-sm border border-line p-8 sm:p-10'>
          <h1 className='display text-3xl leading-tight'>{isLogin ? 'Sign in' : 'Create account'}</h1>
          <p className='mt-2 text-sm text-muted'>
            {isLogin ? 'Welcome back to Foxie Shop.' : 'Join us for a faster checkout.'}
          </p>

          <div className='mt-8 flex flex-col gap-4'>
            {isLogin ? null : (
              <label className='flex flex-col gap-1.5'>
                <span className='text-[11px] font-medium uppercase tracking-[0.16em] text-muted'>Name</span>
                <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='field' placeholder='Your name' required />
              </label>
            )}
            <label className='flex flex-col gap-1.5'>
              <span className='text-[11px] font-medium uppercase tracking-[0.16em] text-muted'>Email</span>
              <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='field' placeholder='you@example.com' required />
            </label>
            <label className='flex flex-col gap-1.5'>
              <span className='text-[11px] font-medium uppercase tracking-[0.16em] text-muted'>Password</span>
              <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='field' placeholder='Your password' required />
            </label>
          </div>

          <button className='btn-primary mt-6 w-full'>{isLogin ? 'Sign in' : 'Create account'}</button>

          <p className='mt-5 text-center text-sm text-muted'>
            {isLogin ? 'New to Foxie Shop?' : 'Already have an account?'}
            <button
              type='button'
              onClick={() => setCurrentState(isLogin ? 'Sign Up' : 'Login')}
              className='ml-1 text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink'
            >
              {isLogin ? 'Create an account' : 'Sign in'}
            </button>
          </p>
      </form>
    </div>
  )
}

export default Login
