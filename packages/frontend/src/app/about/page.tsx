import { Metadata } from 'next'
// components
import AboutPage from '@/components/about'
// constants
import { InternalRoutes } from '@/constants/routes'

export function generateMetadata(): Metadata {
  return {
    title: '關於觀測站 - 報導者觀測站',
    description: '報導者議會透視版',
    alternates: {
      canonical: `https://lawmaker.twreporter.org${InternalRoutes.About}`,
    },
    openGraph: {
      title: '關於觀測站 - 報導者觀測站',
      url: `https://lawmaker.twreporter.org${InternalRoutes.About}`,
      type: 'article',
    },
  }
}

export default async function Page() {
  return <AboutPage />
}
