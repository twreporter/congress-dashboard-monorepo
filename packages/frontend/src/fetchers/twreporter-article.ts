import useSWR from 'swr'
import { get, last } from 'lodash'
const _ = {
  get,
  last,
}

const getCDNUrl = (url: string | URL = '') => {
  if (!url) {
    return ''
  }

  const urlObj = new URL(url)
  const imageId = _.last(urlObj.pathname.split('/'))

  return imageId
    ? `${process.env.NEXT_PUBLIC_TWREPORTER_URL}/images/${imageId}`
    : ''
}

const getArticleUrl = (slug: string, style: string) => {
  const entry = style === 'interactive' ? 'i' : 'a'
  return `${process.env.NEXT_PUBLIC_TWREPORTER_URL}/${entry}/${slug}`
}

export type ArticleData =
  | {
      category?: string
      publishedDate?: string
      title: string
      image?: {
        description?: string
        url?: string
      }
      style: string
      url: string
    }
  | undefined

const fetchTwreporterArticle = async (slug: string): Promise<ArticleData> => {
  const url = process.env.NEXT_PUBLIC_TWREPORTER_API_URL as string
  const endpoint = `/v2/posts/${slug}?full=false`
  const res = await fetch(`${url}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch twreporter article slug: ${slug}`)
  }
  const data = await res.json()
  const articles = data?.data
  if (!articles) {
    return undefined
  }

  const style = _.get(articles, 'style', 'article')
  return {
    category: _.get(articles, ['category_set', '0', 'category', 'name'], ''),
    publishedDate: _.get(articles, 'published_date'),
    title: _.get(articles, 'title', ''),
    image: {
      description: _.get(articles, ['hero_image', 'description']),
      url: getCDNUrl(
        _.get(articles, ['hero_image', 'resized_targets', 'mobile', 'url'])
      ),
    },
    style,
    url: getArticleUrl(slug, style),
  }
}
const useTwreporterArticle = (slug: string) => {
  const { data, isLoading, error } = useSWR(slug, fetchTwreporterArticle)
  return {
    data,
    isLoading,
    error,
  }
}

export default useTwreporterArticle
