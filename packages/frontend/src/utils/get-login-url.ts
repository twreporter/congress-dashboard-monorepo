import { InternalRoutes } from '@/constants/routes'

export function getLoginUrl() {
  const destination =
    typeof window === 'undefined' ? '' : encodeURIComponent(window.location.href)

  return destination
    ? `${InternalRoutes.Login}?destination=${destination}`
    : InternalRoutes.Login
}