import { useEffect, useState } from 'react'

const useResizeObserver = (ref: React.RefObject<HTMLDivElement | null>) => {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!ref?.current) return

    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      })
    })

    observer.observe(ref.current)

    return () => observer.disconnect() // Cleanup
  }, [ref])

  return size
}

export default useResizeObserver
