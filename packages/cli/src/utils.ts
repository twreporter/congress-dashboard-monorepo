const releaseBranch = process.env.RELEASE_BRANCH || 'local'

export function getUrlOrigin(): string {
  let urlOrigin

  switch (releaseBranch) {
    case 'dev': {
      urlOrigin = 'https://dev-lawmaker.twreporter.org'
      break
    }
    case 'staging': {
      urlOrigin = 'https://staging-lawmaker.twreporter.org'
      break
    }
    case 'prod': {
      urlOrigin = 'https://lawmaker.twreporter.org'
      break
    }
    case 'local':
    default: {
      urlOrigin = ''
      break
    }
  }

  return urlOrigin
}
