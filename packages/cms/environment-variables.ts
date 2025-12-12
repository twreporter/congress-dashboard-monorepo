const {
  NODE_ENV,
  DATABASE_URL,
  GCS_ORIGIN,
  IMAGES_BASE_URL,
  IMAGES_STORAGE_PATH,
  RELEASE_BRANCH,
  TWREPORTER_API_URL,
  FILES_BASE_URL,
  FILES_STORAGE_PATH,
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
  files: {
    baseUrl: FILES_BASE_URL || '/files',
    storagePath: FILES_STORAGE_PATH || 'public/files',
  },
  images: {
    baseUrl: IMAGES_BASE_URL || '/images',
    storagePath: IMAGES_STORAGE_PATH || 'public/images',
  },
  releaseBranch: RELEASE_BRANCH || 'master',
  twreporterApiUrl: TWREPORTER_API_URL || 'http://localhost:8080',
}

export default environmentVariables
