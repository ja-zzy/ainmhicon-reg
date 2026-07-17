import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import LoginPage from '../app/login/page'

const meta = {
    title: 'login',
    component: LoginPage,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    }
} satisfies Meta<typeof LoginPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InitialState: Story =  {
    args: {

    }
}

export const SignInWithEmail: Story = {
    args: {},

    play: async ({ canvasElement }) => {
        canvasElement.ownerDocument.location.hash = "login-carousel-check"
    },
};