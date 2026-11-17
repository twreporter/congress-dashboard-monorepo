// home page cache is on cloudflare
export const dynamic = 'force-dynamic'

// fetcher
import fetchEditorSelecteds from '@/fetchers/server/editor-pick'
// components
import HomePage from '@/components/home'
// type
import type { EditorSelect } from '@/types/editor-pick'

export default async function Home() {
  let selecteds: EditorSelect[] = []
  try {
    selecteds = await fetchEditorSelecteds()
  } catch (err) {
    console.error(err)
  }

  return <HomePage selecteds={selecteds} />
}
