import { config } from '@keystone-6/core'
import express from 'express'
import Path from 'path'
import envVars from './environment-variables'
import { listDefinition as lists } from './lists'
import { withAuth, session } from './auth'
import extendGraphqlSchema from './extend-graphql-schemas/index'

export default withAuth(
  config({
    db: {
      provider: 'mysql',
      url: envVars.database.url,
      idField: {
        kind: 'autoincrement',
      },
    },
    ui: {
      // For our starter, we check that someone has session data before letting them see the Admin UI.
      isAccessAllowed: (context) => !!context.session?.data,
      getAdditionalFiles: [
        async () => [
          {
            mode: 'copy',
            inputPath: Path.resolve('public/favicon.ico'),
            outputPath: 'public/favicon.ico',
          },
        ],
      ],
    },
    lists,
    session,
    storage: {
      images: {
        kind: 'local',
        type: 'image',
        storagePath: envVars.images.storagePath,
        serverRoute: {
          path: '/images',
        },
        generateUrl: (path) => `/images${path}`,
      },
    },
    server: {
      extendExpressApp(app) {
        app.use(express.json({ limit: '50mb' }))
        app.use(express.urlencoded({ limit: '50mb', extended: true }))
      },
    },
    graphql: {
      extendGraphqlSchema,
    },
  })
)
