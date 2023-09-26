import { Button } from '../button'
import { Title } from '../title'
import { ToggleThemeButton } from '../toggle-theme-button'

export const Navbar = () => {
  return (
    <div className='mx-16 my-8 flex justify-between'>
      <Title classes='text-4xl'>gametrakr</Title>
      <div className='flex gap-4'>
        {/* TODO: add games / community / search bar */}
        <Button variant='secondary'>Sign In</Button>
        <Button>Sign Up</Button>
        <ToggleThemeButton />
      </div>
    </div>
  )
}
