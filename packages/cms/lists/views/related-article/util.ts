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

export const getTwreporterApiUrl = (): string => {
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
