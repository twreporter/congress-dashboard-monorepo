import { useState, useRef, useEffect } from 'react'
import throttle from 'lodash/throttle'

const _ = {
  throttle,
}

const SCROLL_THRESHOLD = 16
const SCROLL_THROTTLE_DELAY = 500
const MAX_SCROLL_STAGE = 3

export const useScrollStage = () => {
  const [scrollStage, setScrollStage] = useState(1)
  const lastY = useRef(0)
  const currentY = useRef(0)

  useEffect(() => {
    const handleScroll = _.throttle(() => {
      lastY.current = window.pageYOffset
      const scrollDistance = Math.abs(currentY.current - lastY.current)

      if (scrollDistance < SCROLL_THRESHOLD) return

      const scrollDirection = lastY.current > currentY.current ? 'down' : 'up'
      currentY.current = lastY.current

      if (scrollDirection === 'up') {
        setScrollStage((prevStage) => Math.max(1, prevStage - 1))
      } else {
        setScrollStage((prevStage) => Math.min(MAX_SCROLL_STAGE, prevStage + 1))
      }
    }, SCROLL_THROTTLE_DELAY)

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return scrollStage
}
