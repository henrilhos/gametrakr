'use client'

import { useEffect, useState } from 'react'

/**
 * Modified from link below
 * @see https://observablehq.com/@werehamster/avoiding-hydration-mismatch-when-using-react-hooks
 * @param mediaQueryString
 * @returns {unknown}
 */
export default function useBetterMediaQuery(mediaQueryString: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQueryList = window.matchMedia(mediaQueryString)
    // @ts-ignore
    const listener = (event) => setMatches(!!event.matches)
    listener(mediaQueryList)
    mediaQueryList.addEventListener('change', listener)
    return () => mediaQueryList.removeEventListener('change', listener)
  }, [mediaQueryString])

  return matches
}
