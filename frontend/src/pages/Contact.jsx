import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div className='pt-12'>

      <Title text1='Contact' text2='Us' align='center' />

      <div className='mt-14 grid gap-10 md:grid-cols-2 md:items-center md:gap-16'>
        <img className='aspect-[4/5] w-full bg-surface object-cover' src={assets.contact_img} alt='The Foxie Shop storefront' />
        <div className='flex max-w-[52ch] flex-col gap-7'>
          <div>
            <p className='text-xs font-medium uppercase tracking-[0.18em] text-muted'>Visit</p>
            <p className='mt-2 text-sm leading-relaxed text-ink'>Ho Chi Minh City, Vietnam</p>
          </div>
          <div>
            <p className='text-xs font-medium uppercase tracking-[0.18em] text-muted'>Talk to us</p>
            <p className='mt-2 text-sm leading-relaxed text-ink'>hello@foxieshop.vn</p>
            <p className='mt-1 text-sm leading-relaxed text-ink'>+84 28 1234 5678</p>
          </div>
          <div>
            <p className='text-xs font-medium uppercase tracking-[0.18em] text-muted'>Careers</p>
            <p className='mt-2 text-sm leading-relaxed text-muted'>We are a small team. If you would like to work with us, say hello.</p>
          </div>
          <a href='mailto:hello@foxieshop.vn' className='btn-outline w-fit'>Email us</a>
        </div>
      </div>

      <div className='mt-20'>
        <NewsletterBox />
      </div>

    </div>
  )
}

export default Contact
