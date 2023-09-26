'use client'

import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '../button'
import { Title } from '../title'
import { ToggleThemeButton } from '../toggle-theme-button'
import useBetterMediaQuery from '@/hooks/use-better-media-query'

export const Navbar = () => {
  const isMobile = useBetterMediaQuery('only screen and (max-width : 768px)')

  return (
    <div className='mx-8 my-4 flex justify-between md:mx-16 md:my-8'>
      <Title classes='text-4xl'>gametrakr</Title>

      {isMobile ? (
        // TODO: add mobile menu
        <div className='inline-flex items-center'>
          <FontAwesomeIcon icon={faBars} size='xl' />
        </div>
      ) : (
        <div className='flex gap-4'>
          {/* TODO: add games / community / search bar */}
          <Button variant='secondary'>Sign In</Button>
          <Button>Sign Up</Button>
          <ToggleThemeButton />
        </div>
      )}
    </div>
  )
}
