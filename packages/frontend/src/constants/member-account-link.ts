import { ExternalRoutes } from '@/constants/routes'

export const MEMBER_ACCOUNT_LINKS = [
  {
    label: '贊助紀錄',
    href: `${ExternalRoutes.TwReporter}/account/donation-history`,
    icon: 'history',
  },
  {
    label: '電子報管理',
    href: `${ExternalRoutes.TwReporter}/account/email-subscription`,
    icon: 'email',
  },
  {
    label: '專屬回饋',
    href: `${ExternalRoutes.TwReporter}/account/exclusive-offers`,
    icon: 'star',
  },
  {
    label: '個人資料',
    href: `${ExternalRoutes.TwReporter}/account`,
    icon: 'member',
  },
] as const
