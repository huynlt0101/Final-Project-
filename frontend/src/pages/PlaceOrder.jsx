import { useContext, useEffect, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Field = ({ label, className = '', ...props }) => (
    <label className={`flex flex-col gap-1.5 ${className}`}>
        <span className='text-[11px] font-medium uppercase tracking-[0.16em] text-muted'>{label}</span>
        <input {...props} className='field' />
    </label>
)

const PlaceOrder = () => {

    const [method, setMethod] = useState('cod');
    const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    })

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setFormData(data => ({ ...data, [name]: value }))
    }

    useEffect(() => {
        if (!token) {
            navigate('/login', { state: { from: '/place-order' } })
        }
    }, [token])

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        try {

            let orderItems = []

            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        const itemInfo = structuredClone(products.find(product => product._id === items))
                        if (itemInfo) {
                            itemInfo.size = item
                            itemInfo.quantity = cartItems[items][item]
                            orderItems.push(itemInfo)
                        }
                    }
                }
            }

            let orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee
            }


            if (orderItems.length === 0) {
                toast.error('Your cart is empty')
                return
            }

            switch (method) {

                // API Calls for COD
                case 'cod': {
                    const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
                    if (response.data.success) {
                        setCartItems({})
                        navigate('/orders')
                    } else {
                        toast.error(response.data.message)
                    }
                    break;
                }

                case 'vnpay': {
                    const responseVnpay = await axios.post(backendUrl + '/api/order/vnpay', orderData, { headers: { token } })
                    if (responseVnpay.data.success) {
                        const { payment_url } = responseVnpay.data
                        window.location.replace(payment_url)
                    } else {
                        toast.error(responseVnpay.data.message)
                    }
                    break;
                }

                default:
                    break;
            }


        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    if (!token) return null

    return (
        <form onSubmit={onSubmitHandler} className='grid gap-12 pt-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start'>

            {/* ------------- Left Side ---------------- */}
            <div className='flex flex-col gap-6'>

                <Title text1='Delivery' text2='Information' />

                <div className='grid gap-4 sm:grid-cols-2'>
                    <Field label='First name' required onChange={onChangeHandler} name='firstName' value={formData.firstName} type="text" placeholder='First name' />
                    <Field label='Last name' required onChange={onChangeHandler} name='lastName' value={formData.lastName} type="text" placeholder='Last name' />
                </div>
                <Field label='Email address' required onChange={onChangeHandler} name='email' value={formData.email} type="email" placeholder='you@example.com' />
                <Field label='Street address' required onChange={onChangeHandler} name='street' value={formData.street} type="text" placeholder='Street and number' />
                <div className='grid gap-4 sm:grid-cols-2'>
                    <Field label='City' required onChange={onChangeHandler} name='city' value={formData.city} type="text" placeholder='City' />
                    <Field label='State / Province' onChange={onChangeHandler} name='state' value={formData.state} type="text" placeholder='State' />
                </div>
                <div className='grid gap-4 sm:grid-cols-2'>
                    <Field label='Zipcode' required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} type="number" placeholder='Zipcode' />
                    <Field label='Country' required onChange={onChangeHandler} name='country' value={formData.country} type="text" placeholder='Country' />
                </div>
                <Field label='Phone' required onChange={onChangeHandler} name='phone' value={formData.phone} type="number" placeholder='Phone number' />
            </div>

            {/* ------------- Right Side ------------------ */}
            <div className='lg:sticky lg:top-28'>

                <CartTotal />

                <div className='mt-8'>
                    <p className='text-sm font-medium text-ink'>Payment method</p>
                    <div className='mt-4 grid gap-3 sm:grid-cols-2'>
                        <button
                            type='button'
                            onClick={() => setMethod('cod')}
                            aria-pressed={method === 'cod'}
                            className={`flex items-center justify-between gap-3 border px-4 py-4 text-left transition-colors ${method === 'cod' ? 'border-ink bg-ink text-paper' : 'border-line text-ink hover:border-ink'}`}
                        >
                            <span className='text-[11px] font-medium uppercase tracking-[0.14em]'>Cash on delivery</span>
                            <span className={`h-2.5 w-2.5 rounded-full border ${method === 'cod' ? 'border-paper bg-paper' : 'border-muted'}`} />
                        </button>
                        <button
                            type='button'
                            onClick={() => setMethod('vnpay')}
                            aria-pressed={method === 'vnpay'}
                            className={`flex items-center justify-between gap-3 border px-4 py-4 text-left transition-colors ${method === 'vnpay' ? 'border-ink bg-ink text-paper' : 'border-line text-ink hover:border-ink'}`}
                        >
                            <span className='flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em]'>
                                <img className={`h-4 ${method === 'vnpay' ? 'brightness-0 invert' : ''}`} src={assets.vnpay_logo} alt='' />
                                VNPay
                            </span>
                            <span className={`h-2.5 w-2.5 rounded-full border ${method === 'vnpay' ? 'border-paper bg-paper' : 'border-muted'}`} />
                        </button>
                    </div>

                    <button type='submit' className='btn-primary mt-8 w-full'>Place order</button>
                </div>
            </div>

        </form>
    )
}

export default PlaceOrder
