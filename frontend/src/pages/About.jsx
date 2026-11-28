import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div className='pt-12'>

      <Title text1='About' text2='Us' align='center' />

      <div className='mt-14 grid gap-10 md:grid-cols-2 md:items-center md:gap-16'>
          <img className='aspect-[4/5] w-full bg-surface object-cover' src={assets.about_img} alt='Inside the Foxie Shop studio' />
          <div className='flex max-w-[60ch] flex-col gap-5 text-sm leading-relaxed text-muted'>
              <p>Foxie Shop is an independent clothing label built around a simple idea: everyday pieces should be easy to find, easy to wear, and easy to buy.</p>
              <p>We curate a focused edit of tops, outerwear, and layers for men, women, and kids — pieces chosen for how they fit into a real wardrobe rather than how they look on a runway.</p>
              <p className='pt-2 font-medium text-ink'>Our mission</p>
              <p>To make shopping feel straightforward. Clear product information, honest prices, and a checkout that works — from browsing to delivery and beyond.</p>
          </div>
      </div>

      <div className='mt-20'>
          <Title text1='Why' text2='Choose Us' />
      </div>

      <div className='mt-8 grid divide-y divide-line border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0'>
          <div className='flex flex-col gap-3 px-0 py-8 sm:px-8 sm:py-10'>
            <p className='text-sm font-medium text-ink'>Quality assurance</p>
            <p className='text-sm leading-relaxed text-muted'>Every piece is selected and checked before it reaches the collection.</p>
          </div>
          <div className='flex flex-col gap-3 px-0 py-8 sm:px-8 sm:py-10'>
            <p className='text-sm font-medium text-ink'>Convenience</p>
            <p className='text-sm leading-relaxed text-muted'>A clear interface and a short checkout — shopping without the friction.</p>
          </div>
          <div className='flex flex-col gap-3 px-0 py-8 sm:px-8 sm:py-10'>
            <p className='text-sm font-medium text-ink'>Responsive service</p>
            <p className='text-sm leading-relaxed text-muted'>Questions are answered by a real person, as quickly as we can.</p>
          </div>
      </div>

      <div className='mt-20'>
        <NewsletterBox />
      </div>

    </div>
  )
}

export default About
