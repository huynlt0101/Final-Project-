import React from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import {toast} from 'react-toastify'
import axios from 'axios'

const Verify = () => {

    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext)
    const [searchParams] = useSearchParams()

    const verifyPayment = async () => {
        try {

            if (!token) {
                return null
            }

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
        <div>

        </div>
    )
}

export default Verify
