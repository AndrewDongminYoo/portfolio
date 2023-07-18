import { Button, buttonVariants } from 'components/ui/button';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Button> = {
    title: 'Actual/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        variant: buttonVariants,
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        variant: 'default',
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
    },
};

export const Destructive: Story = {
    args: {
        variant: 'destructive',
    },
};

export const Ghost: Story = {
    args: {
        variant: 'ghost',
    },
};
