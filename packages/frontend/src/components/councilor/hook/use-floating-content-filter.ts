'use client'

import { useEffect, useRef, useState } from 'react'

const topicListVisibilityOffset = 200

const useFloatingContentFilter = (refreshKey: string) => {
  const topicListRef = useRef<HTMLDivElement>(null)
  const inlineFilterRef = useRef<HTMLDivElement>(null)
  const fixedFilterRef = useRef<HTMLDivElement>(null)
  const [isInlineFilterActive, setIsInlineFilterActive] = useState(false)
  const [isWithinFloatingRange, setIsWithinFloatingRange] = useState(false)
  const [filterCenter, setFilterCenter] = useState<number | null>(null)

  useEffect(() => {
    const topicList = topicListRef.current
    if (!topicList) return

    let animationFrame: number | null = null

    const updatePosition = () => {
      animationFrame = null
      const inlineFilter = inlineFilterRef.current
      const fixedFilter = fixedFilterRef.current

      const topicListRect = topicList.getBoundingClientRect()
      const inlineFilterRect = inlineFilter?.getBoundingClientRect()
      const fixedFilterRect = fixedFilter?.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      setIsWithinFloatingRange(
        viewportHeight - topicListRect.top > topicListVisibilityOffset &&
          topicListRect.bottom > 0
      )

      if (!inlineFilterRect) {
        setIsInlineFilterActive(false)
        setFilterCenter(topicListRect.left + topicListRect.width / 2)
        return
      }

      setIsInlineFilterActive(
        inlineFilterRect.bottom > 0 &&
          Boolean(
            fixedFilterRect && inlineFilterRect.top <= fixedFilterRect.top
          )
      )
      setFilterCenter(inlineFilterRect.left + inlineFilterRect.width / 2)
    }

    const scheduleUpdate = () => {
      if (animationFrame !== null) return
      animationFrame = window.requestAnimationFrame(updatePosition)
    }

    updatePosition()
    const resizeObserver = new ResizeObserver(scheduleUpdate)
    resizeObserver.observe(topicList)
    if (inlineFilterRef.current) resizeObserver.observe(inlineFilterRef.current)
    if (fixedFilterRef.current) resizeObserver.observe(fixedFilterRef.current)
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame)
      }
    }
  }, [refreshKey])

  return {
    topicListRef,
    inlineFilterRef,
    fixedFilterRef,
    isInlineFilterActive,
    isWithinFloatingRange,
    filterCenter,
  }
}

export default useFloatingContentFilter
