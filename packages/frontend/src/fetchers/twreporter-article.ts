import useSWR from 'swr'
// type
import type { RelatedType } from '@/types/related-twreporter-item'
// lodash
import { get, last } from 'lodash'
const _ = {
  get,
  last,
}

const getCDNUrl = (url: string | URL = '') => {
  if (!url) {
    return ''
  }

  try {
    const urlObj = new URL(url)
    const imageId = _.last(urlObj.pathname.split('/'))

    return imageId
      ? `${process.env.NEXT_PUBLIC_TWREPORTER_URL}/images/${imageId}`
      : ''
  } catch (err) {
    console.error('Invalid URL provided to getCDNUrl:', url, err)
    return ''
  }
}

const getArticleUrl = (slug: string, style: string) => {
  const entry = style === 'interactive' ? 'i' : 'a'
  return `${process.env.NEXT_PUBLIC_TWREPORTER_URL}/${entry}/${slug}`
}

export type ItemData = {
  category?: string
  publishedDate?: string
  title: string
  image?: {
    description?: string
    url?: string
  }
  style?: string
  url: string
}

const fetchTwreporterArticle = async (
  slug: string
): Promise<ItemData | undefined> => {
  const url = process.env.NEXT_PUBLIC_TWREPORTER_API_URL as string
  const endpoint = `/v2/posts/${slug}?full=false`
  const res = await fetch(`${url}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch twreporter article, slug: ${slug}`)
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

const fetchTwreporterTopic = async (
  slug: string
): Promise<ItemData | undefined> => {
  const url = process.env.NEXT_PUBLIC_TWREPORTER_API_URL as string
  const endpoint = `/v2/topics/${slug}?full=false`
  const res = await fetch(`${url}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch twreporter topic, slug: ${slug}`)
  }
  const data = await res.json()
  const topic = data?.data
  if (!topic) {
    return undefined
  }

  return {
    category: '專題',
    publishedDate: _.get(topic, 'published_date'),
    title: _.get(topic, 'title', ''),
    image: {
      description: _.get(topic, ['og_image', 'description']),
      url: getCDNUrl(
        _.get(topic, ['og_image', 'resized_targets', 'mobile', 'url'])
      ),
    },
    url: `${process.env.NEXT_PUBLIC_TWREPORTER_URL}/topics/${slug}`,
  }
}

const useTwreporterArticle = (type: RelatedType, slug: string) => {
  const fetcher =
    type === 'www-topic' ? fetchTwreporterTopic : fetchTwreporterArticle
  const { data, isLoading, error } = useSWR(slug, fetcher)
  return {
    data,
    isLoading,
    error,
  }
}

export default useTwreporterArticle
