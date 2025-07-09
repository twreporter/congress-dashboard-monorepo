import type { ValuesOf } from '@/types/index'

export const layoutVariants = {
  Default: 'default', // search bar in the body of the page
  Header: 'header', // search bar in the header
  Modal: 'modal', // search bar in the modal
  Menu: 'menu', // search bar in the mobile open menu
} as const

export type LayoutVariant = ValuesOf<typeof layoutVariants>
