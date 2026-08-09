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
        user: defaultMockUser,
        attendee: defaultMockAttendee,
        registration: defaultRegistration,
        logout: () => { },
        regStartTime: Date.now() - 1000,
        regEndTime: Date.now() + (1000 * 60 * 60 * 24 * 100) /* 100 days */,
        achievements: null
    }
};

export const DefaultUnregisteredState: Story = {
    args: {
        user: defaultMockUser,
        attendee: defaultMockAttendee,
        registration: null,
        logout: () => { },
        regStartTime: Date.now() - 1000,
        regEndTime: Date.now() + (1000 * 60 * 60 * 24 * 100) /* 100 days */,
        achievements: null
    }
};

export const WithPreRegTimer: Story = {
    args: {
        user: defaultMockUser,
        attendee: defaultMockAttendee,
        registration: null,
        logout: () => { },
        regStartTime: Date.now() + (1000 * 60 * 60) /* 1 hour */,
        regEndTime: Date.now() + (1000 * 60 * 60 * 24 * 100) /* 100 days */,
        achievements: null
    }
}

export const WithRegEndingTimer: Story = {
    args: {
        user: defaultMockUser,
        attendee: defaultMockAttendee,
        registration: null,
        logout: () => { },
        regStartTime: Date.now() - 1000,
        regEndTime: Date.now() + (1000 * 60 * 60 * 26) /* 1 day 2 hours */,
        achievements: null
    }
}

export const WithRegClosed: Story = {
    args: {
        user: defaultMockUser,
        attendee: defaultMockAttendee,
        registration: null,
        logout: () => { },
        regStartTime: Date.now() - 1000,
        regEndTime: Date.now() - 1000,
        achievements: null
    }
}


export const WithBelowMinimumAgeUnregisteredState: Story = {
    args: {
        user: defaultMockUser,
        attendee: { ...defaultMockAttendee, dob: new Date().toISOString() },
        registration: null,
        logout: () => { },
        regStartTime: Date.now() - 1000,
        regEndTime: Date.now() + (1000 * 60 * 60 * 24 * 100) /* 100 days */,
        achievements: null
    }
};

export const WithOneAchievement: Story = {
    args: {
        user: defaultMockUser,
        attendee: defaultMockAttendee,
        registration: defaultRegistration,
        logout: () => { },
        regStartTime: Date.now() - 1000,
        regEndTime: Date.now() + (1000 * 60 * 60 * 24 * 100) /* 100 days */,
        achievements: ['2026_attendee']
    }
};

export const WithTwoAchievements: Story = {
    args: {
        user: defaultMockUser,
        attendee: defaultMockAttendee,
        registration: defaultRegistration,
        logout: () => { },
        regStartTime: Date.now() - 1000,
        regEndTime: Date.now() + (1000 * 60 * 60 * 24 * 100) /* 100 days */,
        achievements: ['2026_attendee', '2027_attendee']
    }
};