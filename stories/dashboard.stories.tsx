import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DashboardView } from '../app/dashboard/view'
import { defaultMockAttendee, defaultMockUser, defaultRegistration } from './mocks/mock-types';

const meta = {
    title: 'dashboard',
    component: DashboardView,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    }
} satisfies Meta<typeof DashboardView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultRegisteredState: Story = {
    args: {
        attendee: defaultMockAttendee,
        registration: defaultRegistration,
        logout: () => { },
        regStartTime: Date.now() - 1000,
        regEndTime: Date.now() + (1000 * 60 * 60 * 24 * 100) /* 100 days */,
    }
};

export const DefaultUnregisteredState: Story = {
    args: {
        attendee: defaultMockAttendee,
        registration: null,
        logout: () => { },
        regStartTime: Date.now() - 1000,
        regEndTime: Date.now() + (1000 * 60 * 60 * 24 * 100) /* 100 days */,
    }
};

export const WithPreRegTimer: Story = {
    args: {
        attendee: defaultMockAttendee,
        registration: null,
        logout: () => { },
        regStartTime: Date.now() + (1000 * 60 * 60) /* 1 hour */,
        regEndTime: Date.now() + (1000 * 60 * 60 * 24 * 100) /* 100 days */,
    }
}

export const WithRegEndingTimer: Story = {
    args: {
        attendee: defaultMockAttendee,
        registration: null,
        logout: () => { },
        regStartTime: Date.now() - 1000,
        regEndTime: Date.now() + (1000 * 60 * 60 * 26) /* 1 day 2 hours */,
    }
}

export const WithRegClosed: Story = {
    args: {
        attendee: defaultMockAttendee,
        registration: null,
        logout: () => { },
        regStartTime: Date.now() - 1000,
        regEndTime: Date.now() - 1000,
    }
}
