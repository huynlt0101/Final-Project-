import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {

    const { products, loading } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        setLatestProducts(products.slice(0, 10));
    }, [products])

  return (
    <section className='py-16 sm:py-24'>
      <div className='text-center'>
          <Title text1='Latest' text2='Collections' align='center' />
          <p className='mx-auto mt-5 max-w-[52ch] text-sm leading-relaxed text-muted'>
            New pieces added each week — a rotating edit of tops, outerwear, and everyday layers.
          </p>
      </div>

      <div className='mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
        {loading
          ? Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className='animate-pulse'>
                <div className='aspect-[3/4] bg-surface' />
                <div className='mt-3 h-3 w-3/4 bg-surface' />
                <div className='mt-2 h-3 w-1/3 bg-surface' />
              </div>
            ))
          : latestProducts.map((item, index) => (
              <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
            ))}
      </div>

      <div className='mt-12 text-center'>
        <Link to='/collection' className='btn-outline'>View all</Link>
      </div>
    </section>
  )
}

export default LatestCollection
