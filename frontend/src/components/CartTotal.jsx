import { useContext } from 'react'
import { ShopContext, formatVND } from '../context/ShopContext'

const CartTotal = () => {

    const { delivery_fee, getCartAmount } = useContext(ShopContext);

    const subtotal = getCartAmount();
    const total = subtotal === 0 ? 0 : subtotal + delivery_fee;

  return (
    <div className='border border-line p-6'>
      <h3 className='text-sm font-medium text-ink'>Order summary</h3>
      <dl className='mt-5 space-y-3 text-sm'>
        <div className='flex items-center justify-between'>
          <dt className='text-muted'>Subtotal</dt>
          <dd className='tabular-nums'>{formatVND(subtotal)}</dd>
        </div>
        <div className='flex items-center justify-between'>
          <dt className='text-muted'>Shipping</dt>
          <dd className='tabular-nums'>{formatVND(delivery_fee)}</dd>
        </div>
        <div className='flex items-center justify-between border-t border-line pt-3 text-base font-medium'>
          <dt>Total</dt>
          <dd className='tabular-nums'>{formatVND(total)}</dd>
        </div>
      </dl>
    </div>
  )
}

export default CartTotal
