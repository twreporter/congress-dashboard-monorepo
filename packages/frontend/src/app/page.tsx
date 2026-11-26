// home page cache is on cloudflare
export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
// fetcher
import fetchEditorSelecteds from '@/fetchers/server/editor-pick'
// components
import HomePage from '@/components/home'
// constants
import { InternalRoutes } from '@/constants/routes'
// type
import type { EditorSelect } from '@/types/editor-pick'

// feature toggle (server runtime env), off unless explicitly set to 'true'
const isNewHomePageEnabled = () => process.env.NEW_HOME_PAGE === 'true'

export default async function Home() {
  if (!isNewHomePageEnabled()) {
    // temporary redirect so browsers won't cache it once the toggle is on
    redirect(InternalRoutes.Congress)
  }

  let selecteds: EditorSelect[] = []
  try {
    selecteds = await fetchEditorSelecteds()
  } catch (err) {
    console.error(err)
  }

  return <HomePage selecteds={selecteds} />
}
