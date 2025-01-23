/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@keystone-ui/core'
import type { AdminConfig } from '@keystone-6/core/types'

function CustomLogo() {
  return <h3>議會透視板 CMS</h3>
}

export const components: AdminConfig['components'] = {
  Logo: CustomLogo,
}
