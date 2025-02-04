import { Preview } from '@storybook/react';
 
const preview: Preview = {
  parameters: {
    nextjs: {
      router: {
        basePath: '/components/',
      },
    },
  },
};

export default preview;
