import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <section className='grid grid-cols-1 border-b border-line md:grid-cols-2'>
      <div className='order-2 flex animate-rise-in flex-col justify-center py-14 sm:px-10 md:order-1 md:py-24 lg:px-16'>
        <h1 className='display text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95] tracking-tightest'>
          Latest<br /><span className='text-muted'>Arrivals</span>
        </h1>
        <p className='mt-6 max-w-[36ch] text-base leading-relaxed text-muted'>
          Considered pieces for the season ahead — cut clean, worn easy, and made to move beyond the trend cycle.
        </p>
        <Link to='/collection' className='group mt-10 inline-flex w-fit items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-ink'>
          Shop the collection
          <span className='h-px w-10 bg-ink transition-all duration-300 ease-out-expo group-hover:w-16' />
        </Link>
      </div>
      <div className='relative order-1 min-h-[55vh] overflow-hidden bg-surface md:order-2 md:min-h-[78vh]'>
        <img src={assets.hero_img} alt='Model wearing the latest Foxie Shop collection' className='h-full w-full object-cover' />
      </div>
    </section>
  )
}

export default Hero
