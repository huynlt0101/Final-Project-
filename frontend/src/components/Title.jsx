const Title = ({ text1, text2, align = 'left', className = '' }) => {
  const centered = align === 'center'

  return (
    <div className={`${centered ? 'text-center' : ''} ${className}`}>
      <h2 className='display text-[clamp(1.7rem,3.4vw,2.75rem)] leading-[1.02] text-ink'>
        {text1}
        {text2 ? <span className='text-muted'> {text2}</span> : null}
      </h2>
      <span className={`mt-4 block h-px w-14 bg-ink ${centered ? 'mx-auto' : ''}`} aria-hidden='true' />
    </div>
  )
}

export default Title
