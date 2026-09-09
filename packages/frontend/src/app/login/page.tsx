import type { Metadata } from 'next'
import { Suspense } from 'react'

import Login from '@/components/login'

export const metadata: Metadata = {
  title: '登入',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full" />}>
      <Login />
    </Suspense>
  )
}
