export const LayoutVariants = {
  Default: 'default', // search bar in the body of the page
  Header: 'header', // search bar in the header
  Modal: 'modal', // search bar in the modal
} as const

export type LayoutVariant = (typeof LayoutVariants)[keyof typeof LayoutVariants]
