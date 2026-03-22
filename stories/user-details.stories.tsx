import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { UserDetailsView } from '../app/user-details/view'
import { defaultMockAttendee, defaultMockUser } from './mocks/mock-types';

const meta = {
    title: 'user-details',
    component: UserDetailsView,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    }
} satisfies Meta<typeof UserDetailsView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultState: Story = {
    args: {
        attendee: defaultMockAttendee,
        user: defaultMockUser,
        onRedirect: () => { },
        updateProfile: (_) => Promise.resolve()
    }
};

export const WithUpdatesDisabled: Story = {
    args: {
        attendee: defaultMockAttendee,
        user: defaultMockUser,
        onRedirect: () => { },
        updateProfile: (_) => Promise.resolve(),
        updatesDisabled: true
    }
};

