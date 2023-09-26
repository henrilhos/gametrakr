'use client'

import { useEffect, useState } from 'react'
import { faMoon } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTheme } from 'next-themes'
import { Button } from '../button'

export const ToggleThemeButton = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <Button icon variant='secondary' onClick={toggleTheme}>
      <FontAwesomeIcon size='xl' height='20px' width='20px' icon={faMoon} />
    </Button>
  )
}
