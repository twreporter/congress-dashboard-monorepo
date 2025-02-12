'use client'

import { useSyncExternalStore } from 'react'
// @twreporter
import { DEFAULT_SCREEN } from '@twreporter/core/lib/utils/media-query'

// Subscribe to window resize events
const subscribe = (callback: () => void) => {
  window.addEventListener('resize', callback)
  return () => window.removeEventListener('resize', callback)
}

// Get the current window width (client-side)
const getSnapshot = () =>
  typeof window !== 'undefined'
    ? window.innerWidth
    : DEFAULT_SCREEN.desktop.minWidth // Default width for SSR

// Provide a fallback for SSR to avoid hydration errors
const getServerSnapshot = () => DEFAULT_SCREEN.desktop.minWidth // Default value for initial render on the server

const useWindowWidth = () => {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export default useWindowWidth
