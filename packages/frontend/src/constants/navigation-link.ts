import { PillButton } from '@twreporter/react-components/lib/button'
import { NavigationLink, PillBtnNavigationLink } from '@/types/navigation-link'
import { InternalRoutes, ExternalRoutes } from '@/constants/routes'

export const COMMON_MENU_LINKS: NavigationLink[] = [
  { text: '觀測站首頁', href: InternalRoutes.Home, target: '_self' },
  { text: '關於觀測站', href: InternalRoutes.About, target: '_self' },
]

export const PILL_BUTTON_LINKS: PillBtnNavigationLink[] = [
  {
    text: '訂閱電子報',
    href: ExternalRoutes.Subscription,
    target: '_blank',
    type: PillButton.Type.SECONDARY,
  },
  {
    text: '贊助我們',
    href: ExternalRoutes.Support,
    target: '_blank',
    type: PillButton.Type.PRIMARY,
  },
]

// Shortened version for mobile/compact displays
export const COMPACT_PILL_BUTTON_LINKS: PillBtnNavigationLink[] = [
  {
    text: '電子報',
    href: ExternalRoutes.Subscription,
    target: '_blank',
    type: PillButton.Type.SECONDARY,
  },
  {
    text: '贊助',
    href: ExternalRoutes.Support,
    target: '_blank',
    type: PillButton.Type.PRIMARY,
  },
]
