'use client'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
// lodash
import { throttle } from 'lodash'

const _ = {
  throttle,
}

type ScrollContextType = {
  isHeaderHidden: boolean
  isHeaderAboveTab: boolean
  setTabElement: (element: HTMLDivElement) => void
}

const ScrollContext = createContext<ScrollContextType>({
  isHeaderHidden: false,
  isHeaderAboveTab: false,
  setTabElement: () => {},
})

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const [isHeaderHidden, setIsHeaderHidden] = useState(false)
  const [isHeaderAboveTab, setIsHeaderAboveTab] = useState(false)
  const [TabElement, setTabElement] = useState<HTMLDivElement | null>(null)
  const lastScrollPosition = useRef(0)
  const headerHeight = 64

  useEffect(() => {
    const handleScroll = _.throttle(() => {
      const currentScroll = window.scrollY
      const tabRect = TabElement?.getBoundingClientRect()

      // Always show header at top of page
      if (currentScroll === 0) {
        setIsHeaderHidden(false)
        setIsHeaderAboveTab(false)
        return
      }

      // Check if header is close to search bar
      if (tabRect && tabRect.top <= headerHeight) {
        setIsHeaderAboveTab(true)
      } else {
        setIsHeaderAboveTab(false)
      }

      // When scrolling up
      if (currentScroll < lastScrollPosition.current) {
        setIsHeaderHidden(false)
      }
      // When scrolling down
      else if (
        currentScroll > lastScrollPosition.current &&
        tabRect &&
        tabRect.top <= headerHeight &&
        currentScroll > headerHeight
      ) {
        setIsHeaderHidden(true)
      }

      lastScrollPosition.current = currentScroll
    }, 500)

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [TabElement])

  return (
    <ScrollContext.Provider
      value={{ isHeaderHidden, isHeaderAboveTab, setTabElement }}
    >
      {children}
    </ScrollContext.Provider>
  )
}

export const useScrollContext = () => useContext(ScrollContext)
