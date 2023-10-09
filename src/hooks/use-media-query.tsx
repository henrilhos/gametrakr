import { useEffect, useState } from "react";

export const useMediaQuery = (mediaQuery: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(mediaQuery);

    const listener = () => setMatches(!!mediaQueryList.matches);
    listener();

    mediaQueryList.addEventListener("change", listener);

    return () => mediaQueryList.removeEventListener("change", listener);
  }, [mediaQuery]);

  return matches;
};
