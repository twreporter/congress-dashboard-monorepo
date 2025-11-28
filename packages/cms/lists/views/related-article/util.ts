enum Branch {
  Master,
  Dev,
  Staging,
  Release,
}

const getReleaseBranch = (): Branch => {
  // get branch from url prefix
  const hostname = window.location.hostname
  if (hostname === 'localhost') {
    return Branch.Master
  }
  if (hostname.startsWith('dev-')) {
    return Branch.Dev
  }
  if (hostname.startsWith('staging-')) {
    return Branch.Staging
  }
  return Branch.Release
}

const getTwreporterApiUrl = (): string => {
  const branch = getReleaseBranch()
  switch (branch) {
    case Branch.Release:
      return 'https://go-api.twreporter.org'
    case Branch.Dev:
    case Branch.Staging:
      return 'https://staging-go-api.twreporter.org'
    case Branch.Master:
    default:
      return 'http://localhost:8080'
  }
}

export const getTwreporterArticle = async (slug: string, hostname?: string) => {
  const twreporterApiUrl = hostname ?? getTwreporterApiUrl()
  const url = `${twreporterApiUrl}/v2/posts/${slug}?full=false`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`article not found, slug: ${slug}`)
  }

  const data = await res.json()
  return data?.data
}

export const getTwreporterArticles = async (
  slugs: string[],
  hostname?: string
) => {
  if (slugs.length === 0) {
    return { records: [] }
  }

  const twreporterApiUrl = hostname ?? getTwreporterApiUrl()
  const baseUrl = `${twreporterApiUrl}/v2/posts?full=false`
  const url = slugs.reduce((acc, slug) => acc + `&slug=${slug}`, baseUrl)
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`cannot get articles, slugs: ${slugs}`)
  }

  const data = await res.json()
  return data?.data
}

export const getTwreporterTopic = async (slug: string, hostname?: string) => {
  const twreporterApiUrl = hostname ?? getTwreporterApiUrl()
  const url = `${twreporterApiUrl}/v2/topics/${slug}?full=false`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`topic not found, slug: ${slug}`)
  }

  const data = await res.json()
  return data?.data
}

export const getTwreporterTopics = async (
  slugs: string[],
  hostname?: string
) => {
  if (slugs.length === 0) {
    return { records: [] }
  }

  const twreporterApiUrl = hostname ?? getTwreporterApiUrl()
  const baseUrl = `${twreporterApiUrl}/v2/topics?full=false`
  const url = slugs.reduce((acc, slug) => acc + `&slug=${slug}`, baseUrl)
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`cannot get topics, slugs: ${slugs}`)
  }

  const data = await res.json()
  return data?.data
}
