import { Button } from './Button'

export default {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
}

export const Primary = {
  args: {
    children: 'Add to Cart',
    variant: 'primary',
  },
}

export const Secondary = {
  args: {
    children: 'View Details',
    variant: 'secondary',
  },
}

export const Danger = {
  args: {
    children: 'Remove Item',
    variant: 'danger',
  },
}

export const Ghost = {
  args: {
    children: 'Cancel',
    variant: 'ghost',
  },
}

export const Loading = {
  args: {
    children: 'Processing...',
    variant: 'primary',
    isLoading: true,
  },
}

export const Disabled = {
  args: {
    children: 'Out of Stock',
    variant: 'primary',
    disabled: true,
  },
}

export const AllSizes = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}