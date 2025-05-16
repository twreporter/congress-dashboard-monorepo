'use client'

// twreporter
import { DEFAULT_SCREEN } from '@twreporter/core/lib/utils/media-query'

export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia(
    `(max-width: ${DEFAULT_SCREEN.tablet.minWidth - 1}px)`
  ).matches
}
