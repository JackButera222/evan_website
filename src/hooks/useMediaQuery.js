import { useEffect, useState } from "react";

export function useMediaQuery(query) {
  // Read the real value on the first render (browser-only SPA) so layout that
  // depends on it isn't computed one frame with the wrong breakpoint — which
  // would leave draggable icons anchored to the wrong (desktop) positions.
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const updateMatches = () => setMatches(mediaQuery.matches);

    updateMatches();
    mediaQuery.addEventListener("change", updateMatches);

    return () => mediaQuery.removeEventListener("change", updateMatches);
  }, [query]);

  return matches;
}
