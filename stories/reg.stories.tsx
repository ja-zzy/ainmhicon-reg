import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { RegView } from '../app/reg/view'
import { defaultMockAttendee, defaultMockUser } from './mocks/mock-types';

const meta = {
    title: 'reg',
    component: RegView,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    }
} satisfies Meta<typeof RegView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StepOneSoldOut: Story = {
    args: {
        user: defaultMockUser,
        attendee: defaultMockAttendee,
        onRedirect: () => { },
        startingStep: 0,
        ticketData: new Set()
    }
};

export const StepOneOneDayAvailable: Story = {
    args: {
        user: defaultMockUser,
        attendee: defaultMockAttendee,
        onRedirect: () => { },
        startingStep: 0,
        ticketData: new Set([1])
    }
};


export const StepOneTwoDaysAvailable: Story = {
    args: {
        user: defaultMockUser,
        attendee: defaultMockAttendee,
        onRedirect: () => { },
        startingStep: 0,
        ticketData: new Set([1,2])
    }
};

export const StepOneAllDaysAvailable: Story = {
    args: {
        user: defaultMockUser,
        attendee: defaultMockAttendee,
        onRedirect: () => { },
        startingStep: 0,
        ticketData: new Set([1,2,3])
    }
};

export const StepTwo: Story = {
    args: {
        user: defaultMockUser,
        attendee: defaultMockAttendee,
        onRedirect: () => { },
        startingStep: 1,
        ticketData: new Set()
    }
};

export const StepThree: Story = {
    args: {
        user: defaultMockUser,
        attendee: defaultMockAttendee,
        onRedirect: () => { },
        startingStep: 2,
        ticketData: new Set()
    }
};

export const ConfirmationPage: Story = {
    args: {
        user: defaultMockUser,
        attendee: defaultMockAttendee,
        onRedirect: () => { },
        startingStep: 3,
        ticketData: new Set()
    }
};
