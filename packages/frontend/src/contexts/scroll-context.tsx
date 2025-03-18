'use client'
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
  useCallback,
} from 'react'
// lodash
import { throttle, type DebouncedFuncLeading } from 'lodash'
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
  // Store throttled function reference
  const throttledScrollHandlerRef =
    useRef<DebouncedFuncLeading<() => void>>(null)

  const handleScroll = useCallback(() => {
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
  }, [tabElement, setTabTop, setIsHeaderHidden, setIsHeaderAboveTab])

  // Create the throttled function in useEffect to ensure proper cleanup
  useEffect(() => {
    throttledScrollHandlerRef.current = _.throttle(handleScroll, 100)
    window.addEventListener('scroll', throttledScrollHandlerRef.current)
    throttledScrollHandlerRef.current()
    return () => {
      if (throttledScrollHandlerRef.current) {
        throttledScrollHandlerRef.current.cancel()
        window.removeEventListener('scroll', throttledScrollHandlerRef.current)
      }
    }
  }, [handleScroll]) // Only depends on handleScroll which has its own dependencies

  return (
    <ScrollContext.Provider
      value={{ isHeaderHidden, isHeaderAboveTab, setTabElement, tabTop }}
    >
      {children}
    </ScrollContext.Provider>
  )
}

export const useScrollContext = () => useContext(ScrollContext)
