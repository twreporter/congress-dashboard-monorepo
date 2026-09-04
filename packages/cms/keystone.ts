import { config } from '@keystone-6/core'
import express from 'express'
import { mkdirSync } from 'fs'
import Path from 'path'
import envVars from './environment-variables'
import { listDefinition as lists } from './lists'
import { withAuth, session } from './auth'
import extendGraphqlSchema from './extend-graphql-schemas/index'

mkdirSync(envVars.files.storagePath, { recursive: true })
mkdirSync(envVars.images.storagePath, { recursive: true })

export default withAuth(
  config({
    db: {
      provider: 'mysql',
      url: envVars.database.url,
      idField: {
        kind: 'autoincrement',
      },
      extendPrismaSchema: (schema) =>
        schema.replace(
          'provider = "prisma-client-js"',
          'provider = "prisma-client-js"\n  binaryTargets = ["native", "debian-openssl-3.0.x"]'
        ),
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
      files: {
        kind: 'local',
        type: 'file',
        storagePath: envVars.files.storagePath,
        serverRoute: {
          path: '/files',
        },
        generateUrl: (path) => `/files${path}`,
      },
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
