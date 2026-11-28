import { assets } from '../assets/assets'

const policies = [
  { icon: assets.exchange_icon, title: 'Easy exchanges', copy: 'Swap sizes within 7 days.' },
  { icon: assets.quality_icon, title: '7-day returns', copy: 'Changed your mind? Send it back within a week.' },
  { icon: assets.support_img, title: 'Responsive support', copy: 'Questions answered by a real person.' },
]

const OurPolicy = () => {
  return (
    <div className='grid grid-cols-1 divide-y divide-line border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0'>
      {policies.map((policy) => (
        <div key={policy.title} className='flex flex-col items-center gap-3 px-6 py-12 text-center'>
          <img src={policy.icon} className='h-8 w-8 opacity-80' alt='' />
          <p className='text-sm font-medium'>{policy.title}</p>
          <p className='max-w-[26ch] text-sm leading-relaxed text-muted'>{policy.copy}</p>
        </div>
      ))}
    </div>
  )
}

export default OurPolicy
