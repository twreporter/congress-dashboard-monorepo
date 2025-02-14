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
  const HEADER_HEIGHT = 64

  const handleScroll = _.throttle(() => {
    const currentScrollY = window.scrollY
    const tabRect = tabElement?.getBoundingClientRect()

    if (tabRect) {
      setTabTop(tabRect.top)
    }

    if (currentScrollY === 0) {
      if (isHeaderHidden) setIsHeaderHidden(false)
      if (isHeaderAboveTab) setIsHeaderAboveTab(false)
      return
    }

    if (tabRect?.top !== undefined) {
      setIsHeaderAboveTab(tabRect.top <= HEADER_HEIGHT)
    }

    if (currentScrollY < lastScrollY.current - 5) {
      if (isHeaderHidden) setIsHeaderHidden(false)
    } else if (
      currentScrollY > lastScrollY.current &&
      tabRect?.top !== undefined
    ) {
      if (tabRect.top <= HEADER_HEIGHT && currentScrollY > HEADER_HEIGHT) {
        if (!isHeaderHidden) setIsHeaderHidden(true)
      }
    }

    lastScrollY.current = currentScrollY
  }, 10)

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      handleScroll.cancel()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [tabElement])

  return (
    <ScrollContext.Provider
      value={{ isHeaderHidden, isHeaderAboveTab, setTabElement, tabTop }}
    >
      {children}
    </ScrollContext.Provider>
  )
}

export const useScrollContext = () => useContext(ScrollContext)
