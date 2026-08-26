import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { HotelBookingView } from '../app/hotel-booking/view'

const meta = {
    title: 'hotel booking',
    component: HotelBookingView,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    }
} satisfies Meta<typeof HotelBookingView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CodeLoading: Story = {
    args: {}
};

export const CodeLoaded: Story = {
    args: {
        discountCode: 'FOOBAR'
    }
};