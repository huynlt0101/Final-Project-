import { formatVND } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({ id, image, name, price }) => {

  return (
    <Link onClick={() => scrollTo(0, 0)} className='group block' to={`/product/${id}`}>
      <div className='relative aspect-[3/4] overflow-hidden bg-surface'>
        <img
          className='h-full w-full object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.04]'
          src={image[0]}
          alt={name}
          loading='lazy'
        />
        {image[1] &&
          <img
            className='absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100'
            src={image[1]}
            alt=''
            aria-hidden='true'
            loading='lazy'
          />}
      </div>
      <div className='flex items-start justify-between gap-3 pt-3'>
        <p className='text-sm leading-snug text-ink'>{name}</p>
        <p className='shrink-0 text-sm font-medium tabular-nums'>{formatVND(price)}</p>
      </div>
    </Link>
  )
}

export default ProductItem
