'use client'
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react'
// lodash
import { throttle } from 'lodash'
// constants
import { HEADER_HEIGHT } from '@/constants/header'

const _ = {
  throttle,
}

type ScrollContextType = {
  isHeaderHidden: boolean
  isHeaderAboveTab: boolean
  setTabElement: (element: HTMLDivElement) => void
  tabTop: number
}

const ScrollContext = createContext<ScrollContextType>({
  isHeaderHidden: false,
  isHeaderAboveTab: false,
  setTabElement: () => {},
  tabTop: 0,
})

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  const [isHeaderHidden, setIsHeaderHidden] = useState(false)
  const [isHeaderAboveTab, setIsHeaderAboveTab] = useState(false)
  const [tabElement, setTabElement] = useState<HTMLDivElement | null>(null)
  const [tabTop, setTabTop] = useState(0)

  const lastScrollY = useRef(0)

  const handleScroll = _.throttle(() => {
    const currentScrollY = window.scrollY
    const tabRect = tabElement?.getBoundingClientRect()

    if (tabRect) {
      setTabTop(tabRect.top)
    }

    if (currentScrollY === 0) {
      setIsHeaderHidden(false)
      setIsHeaderAboveTab(false)
      return
    }

    if (tabRect?.top !== undefined) {
      setIsHeaderAboveTab(
        tabRect.top > 0 ? tabRect.top <= HEADER_HEIGHT : false
      )
    }

    // Trigger animation when scrolling up > 5px
    if (lastScrollY.current - currentScrollY > 5) {
      setIsHeaderHidden(false)
    }
    // Trigger animation when scrolling down
    else if (
      currentScrollY > lastScrollY.current &&
      tabRect &&
      tabRect.top <= HEADER_HEIGHT &&
      currentScrollY > HEADER_HEIGHT
    ) {
      setIsHeaderHidden(true)
    }

    lastScrollY.current = currentScrollY
  }, 100)

  useEffect(() => {
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => {
      handleScroll.cancel()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [tabElement, handleScroll])

  return (
    <ScrollContext.Provider
      value={{ isHeaderHidden, isHeaderAboveTab, setTabElement, tabTop }}
    >
      {children}
    </ScrollContext.Provider>
  )
}

export const useScrollContext = () => useContext(ScrollContext)
