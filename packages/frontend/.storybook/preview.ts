import { Preview } from '@storybook/react'

const preview: Preview = {
  parameters: {
    nextjs: {
      router: {
        basePath: '/components/',
      },
    },
    backgrounds: {
      values: [
        { name: 'Gray100', value: '#f1f1f1' },
        { name: 'Gray200', value: '#e2e2e2' },
      ],
      default: 'Gray100',
    },
  },
}

export default preview
