import { Noto_Serif_TC, Noto_Sans_TC } from 'next/font/google'

export const notoSerif = Noto_Serif_TC({
  weight: '700',
  subsets: ['latin'],
})

export const notoSans = Noto_Sans_TC({
  weight: ['400', '700'],
  subsets: ['latin'],
})
