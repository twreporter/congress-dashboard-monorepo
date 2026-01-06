import { PillButton } from '@twreporter/react-components/lib/button'
import { PillBtnNavigationLink } from '@/types/navigation-link'
import { ExternalRoutes } from '@/constants/routes'

export const PILL_BUTTON_LINKS: PillBtnNavigationLink[] = [
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
    text: '贊助',
    href: ExternalRoutes.Support,
    target: '_blank',
    type: PillButton.Type.PRIMARY,
  },
]
