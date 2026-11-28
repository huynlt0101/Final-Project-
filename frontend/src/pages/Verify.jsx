import { useContext, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const Verify = () => {

    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext)
    const [searchParams] = useSearchParams()
    const [state, setState] = useState('verifying')

    const verifyPayment = async () => {
        try {

            if (!token) {
                setState('signin')
                return null
            }

            setState('verifying')

            const payload = {}
            searchParams.forEach((value, key) => {
                if (key.startsWith('vnp_')) {
                    payload[key] = value
                }
            })

            if (!payload.vnp_TxnRef) {
                navigate('/cart')
                return
            }

            const response = await axios.post(backendUrl + '/api/order/verifyVnpay', payload, { headers: { token } })

            if (response.data.success) {
                setCartItems({})
                navigate('/orders')
            } else {
                toast.error(response.data.message || 'Payment verification failed')
                navigate('/cart')
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        verifyPayment()
    }, [token])

    return (
        <div className='flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center' aria-live='polite'>
            {state === 'signin' ? (
                <>
                    <p className='display text-2xl'>Sign in to continue</p>
                    <p className='max-w-[40ch] text-sm leading-relaxed text-muted'>We could not find a signed-in session for this payment.</p>
                    <Link to='/login' className='btn-outline mt-2'>Sign in</Link>
                </>
            ) : (
                <>
                    <span className='h-8 w-8 animate-spin rounded-full border-2 border-line border-t-ink' aria-hidden='true' />
                    <p className='text-sm text-muted'>Verifying your payment…</p>
                    <p className='max-w-[36ch] text-xs leading-relaxed text-muted'>Please keep this page open. You will be redirected in a moment.</p>
                </>
            )}
        </div>
    )
}

export default Verify
