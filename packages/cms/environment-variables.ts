const {
  NODE_ENV,
  DATABASE_URL,
  GCS_ORIGIN,
  IMAGES_BASE_URL,
  IMAGES_STORAGE_PATH,
  RELEASE_BRANCH,
  NEXT_PUBLIC_TWREPORTER_API_URL,
} = process.env

const environmentVariables = {
  nodeEnv: NODE_ENV || 'development', // value could be 'development', 'production' or 'test'
  database: {
    url:
      DATABASE_URL || 'mysql://root:password@localhost:3306/congress-dashboard',
  },
  gcs: {
    origin: GCS_ORIGIN || 'http://localhost:3000',
  },
  images: {
    baseUrl: IMAGES_BASE_URL || '/images',
    storagePath: IMAGES_STORAGE_PATH || 'public/images',
  },
  releaseBranch: RELEASE_BRANCH || 'master',
  twreporterApiUrl: NEXT_PUBLIC_TWREPORTER_API_URL || 'http://localhost:8080',
}

export default environmentVariables
