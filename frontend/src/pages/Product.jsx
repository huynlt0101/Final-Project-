import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext, formatVND } from '../context/ShopContext';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {

  const { productId } = useParams();
  const { products, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const [tab, setTab] = useState('description')

  const fetchProductData = async () => {

    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        return null;
      }
    })

  }

  useEffect(() => {
    fetchProductData();
  }, [productId, products])

  return productData ? (
    <div className='pt-10'>
      <div className='grid gap-10 md:grid-cols-2 md:gap-14'>

        {/*---------- Product Images------------- */}
        <div className='flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex gap-3 overflow-x-auto sm:w-24 sm:flex-col sm:overflow-visible'>
              {
                productData.image.map((item, index) => (
                  <button
                    type='button'
                    onClick={() => setImage(item)}
                    key={index}
                    aria-label={`View image ${index + 1}`}
                    className={`w-[22%] shrink-0 border transition-colors sm:w-full ${image === item ? 'border-ink' : 'border-transparent hover:border-line'}`}
                  >
                    <img src={item} key={index} className='aspect-[3/4] w-full object-cover' alt='' />
                  </button>
                ))
              }
          </div>
          <div className='flex-1 bg-surface'>
              <img className='aspect-[4/5] w-full object-cover' src={image} alt={productData.name} />
          </div>
        </div>

        {/* -------- Product Info ---------- */}
        <div className='flex flex-col'>
          <h1 className='display text-[clamp(1.8rem,3vw,2.75rem)] leading-tight'>{productData.name}</h1>
          <p className='mt-4 text-2xl font-medium tabular-nums'>{formatVND(productData.price)}</p>
          <p className='mt-5 max-w-[52ch] text-sm leading-relaxed text-muted'>{productData.description}</p>

          <div className='mt-8'>
              <p className='text-xs font-medium uppercase tracking-[0.18em] text-muted'>Select size</p>
              <div className='mt-3 flex flex-wrap gap-2'>
                {productData.sizes.map((item, index) => (
                  <button
                    onClick={() => setSize(item)}
                    key={index}
                    className={`min-w-12 border px-4 py-2.5 text-sm transition-colors ${item === size ? 'border-ink bg-ink text-paper' : 'border-line bg-paper text-ink hover:border-ink'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
          </div>

          <button onClick={() => addToCart(productData._id, size)} className='btn-primary mt-8 w-full sm:w-auto'>Add to cart</button>

          <div className='mt-8 space-y-1.5 border-t border-line pt-6 text-sm text-muted'>
              <p>Cash on delivery available.</p>
              <p>Returns and exchanges within 7 days.</p>
              <p>Questions? Get in touch.</p>
          </div>
        </div>
      </div>

      {/* ---------- Description & Review Section ------------- */}
      <div className='mt-20'>
        <div className='flex border-b border-line'>
          <button
            onClick={() => setTab('description')}
            className={`-mb-px border-b-2 px-1 py-3 text-xs font-medium uppercase tracking-[0.18em] transition-colors ${tab === 'description' ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'}`}
          >
            Description
          </button>
          <button
            onClick={() => setTab('reviews')}
            className={`-mb-px ml-8 border-b-2 px-1 py-3 text-xs font-medium uppercase tracking-[0.18em] transition-colors ${tab === 'reviews' ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'}`}
          >
            Reviews
          </button>
        </div>

        <div className='py-8'>
          {tab === 'description' ? (
            <div className='max-w-[65ch] space-y-4 text-sm leading-relaxed text-muted'>
              <p>{productData.description}</p>
              <p>Category: {productData.category} · {productData.subCategory}</p>
              <p>Available sizes: {productData.sizes.join(', ')}</p>
            </div>
          ) : (
            <p className='max-w-[65ch] text-sm leading-relaxed text-muted'>
              No reviews yet. Reviews will appear here once customers have received their orders.
            </p>
          )}
        </div>
      </div>

      {/* --------- display related products ---------- */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

    </div>
  ) : <div className='min-h-[50vh]' />
}

export default Product
