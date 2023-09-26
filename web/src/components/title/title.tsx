import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type Props = {
  classes?: string
  children: ReactNode
}

export const Title = ({ classes, children }: Props) => {
  const titleClasses = twMerge(
    'bg-title px-1 font-apfel text-5xl font-bold text-black dark:bg-dark-title dark:text-white',
    classes
  )

  return (
    <div className='text-center'>
      <span className={titleClasses}>{children}</span>
    </div>
  )
}
