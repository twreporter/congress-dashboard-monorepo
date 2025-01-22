const {
  NODE_ENV,
  DATABASE_URL,
  GCS_ORIGIN,
  IMAGES_BASE_URL,
  IMAGES_RESIZED_URL,
  IMAGES_STORAGE_PATH,
  RELEASE_BRANCH,
} = process.env

const environmentVariables = {
  nodeEnv: NODE_ENV || 'development', // value could be 'development', 'production' or 'test'
  database: {
    url: DATABASE_URL || 'mysql://root:password@localhost:3306/congress-dashboard',
  },
  gcs: {
    origin: GCS_ORIGIN || 'http://localhost:3000',
  },
  images: {
    baseUrl: IMAGES_BASE_URL || '/images',
    resizedUrl: IMAGES_RESIZED_URL || '/resized-images',
    storagePath: IMAGES_STORAGE_PATH || 'public/images',
  },
  releaseBranch: RELEASE_BRANCH || 'master',
}

export default environmentVariables
