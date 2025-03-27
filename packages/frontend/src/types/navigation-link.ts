import { PillButton } from '@twreporter/react-components/lib/button'

export interface NavigationLink {
  text: string
  href: string
  target: '_blank' | '_parent' | '_self' | '_top'
}

export interface PillBtnNavigationLink extends NavigationLink {
  type: PillButton.Type
}
