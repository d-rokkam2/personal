import { useState, useEffect } from 'react'

/**
 * Returns true once the given element scrolls into the viewport.
 * Disconnects the observer after first intersection (fire-once).
 */
export function useIntersection(
  ref: { current: Element | null },
  threshold = 0.15
): boolean {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, threshold])

  return visible
}
