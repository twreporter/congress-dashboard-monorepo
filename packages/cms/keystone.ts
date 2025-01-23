import { config } from '@keystone-6/core'
import envVars from './environment-variables'
import { listDefinition as lists } from './lists'
import { withAuth, session } from './auth'

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
  })
)
