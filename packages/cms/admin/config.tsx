/** @jsxRuntime classic */
/** @jsx jsx */
import { useEffect } from 'react'
import { jsx } from '@keystone-ui/core'
import type { AdminConfig } from '@keystone-6/core/types'

function CustomLogo() {
  useEffect(() => {
    const currentTitle = document.title
    const newTitle = currentTitle.replace('Keystone', '報導者觀測站 CMS')
    if (newTitle !== currentTitle) document.title = newTitle
  })
  return <h3>報導者觀測站 CMS</h3>
}

export const components: AdminConfig['components'] = {
  Logo: CustomLogo,
}
