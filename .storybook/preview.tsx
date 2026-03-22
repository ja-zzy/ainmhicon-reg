import type { Preview } from '@storybook/nextjs-vite'
import { AppLayout } from '../app/app-layout'

const preview: Preview = {
  decorators: [
    (Story) => (
      <AppLayout withAuth={false}><Story /></AppLayout>
    )
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;