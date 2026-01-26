import { useRef, useEffect, useCallback } from 'react'

const useOutsideClick = <T extends HTMLElement = HTMLDivElement>(
  callback: (e: MouseEvent) => void
) => {
  const elementRef = useRef<T | null>(null)

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (typeof callback !== 'function') {
        return
      }
      if (
        !elementRef.current ||
        (elementRef.current &&
          !elementRef.current.contains(event.target as Node))
      ) {
        callback(event)
      }
    }

    // to work with react synthetic events, we need to add event handler on window instead of document
    // ref: https://dev.to/dvnrsn/why-isn-t-event-stoppropagation-working-1bnm
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [callback])

  // Return a callback ref that can be easily combined with other refs
  const callbackRef = useCallback((node: T | null) => {
    elementRef.current = node
  }, [])

  return callbackRef
}

export default useOutsideClick
