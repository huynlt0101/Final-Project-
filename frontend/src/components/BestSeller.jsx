import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {

    const { products, loading } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        const bestProduct = products.filter((item) => (item.bestseller));
        setBestSeller(bestProduct.slice(0, 5))
    }, [products])

  return (
    <section className='border-t border-line py-16 sm:py-24'>
      <div className='text-center'>
        <Title text1='Best' text2='Sellers' align='center' />
        <p className='mx-auto mt-5 max-w-[52ch] text-sm leading-relaxed text-muted'>
          The pieces our customers keep coming back to — tried, trusted, and restocked.
        </p>
      </div>

      <div className='mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className='animate-pulse'>
                <div className='aspect-[3/4] bg-surface' />
                <div className='mt-3 h-3 w-3/4 bg-surface' />
                <div className='mt-2 h-3 w-1/3 bg-surface' />
              </div>
            ))
          : bestSeller.map((item, index) => (
              <ProductItem key={index} id={item._id} name={item.name} image={item.image} price={item.price} />
            ))}
      </div>
    </section>
  )
}

export default BestSeller
