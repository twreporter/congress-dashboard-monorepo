import { PillButton } from '@twreporter/react-components/lib/button'
import { NavigationLink, PillBtnNavigationLink } from '@/types/navigation-link'

export enum InternalRoutes {
  Home = '/',
  About = '/about',
  Feedback = '/feedback', // TODO: need to change
  Legislator = '/legislators',
  Topic = '/topics',
  Speech = '/a',
}

export enum ExternalRoutes {
  Medium = 'https://medium.com/twreporter',
  Subscription = 'https://www.twreporter.org/account/email-subscription',
  Support = 'https://support.twreporter.org/',
}

export const COMMON_MENU_LINKS: NavigationLink[] = [
  { text: '發言主頁', href: InternalRoutes.Home, target: '_self' },
  { text: '關於透視板', href: InternalRoutes.About, target: '_self' },
]

export const SECONDARY_LINKS: NavigationLink[] = [
  { text: '意見回饋', href: InternalRoutes.Feedback, target: '_self' },
  {
    text: '報導者開放實驗室',
    href: ExternalRoutes.Medium,
    target: '_blank',
  },
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
