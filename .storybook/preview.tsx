import type { Preview } from '@storybook/nextjs-vite'
import { AppView } from '../app/app-view'

const preview: Preview = {
  decorators: [
    (Story) => (
      <AppView logout={() => {}} isLoggedIn={false}><Story /></AppView>
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