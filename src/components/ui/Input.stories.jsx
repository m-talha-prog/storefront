import { useState } from 'react'
import { Input } from './Input'

export default {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
}

export const Default = {
  args: {
    label: 'Search products',
    placeholder: 'Search...',
  },
}

export const WithHelperText = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    helperText: "We'll never share your email.",
  },
}

export const WithError = {
  args: {
    label: 'Email',
    value: 'not-an-email',
    error: 'Please enter a valid email address.',
    readOnly: true,
  },
}

export const Disabled = {
  args: {
    label: 'Promo code',
    placeholder: 'Enter code',
    disabled: true,
  },
}

export const Controlled = {
  render: () => {
    const [value, setValue] = useState('')
    return (
      <Input
        label="Search products"
        placeholder="Search..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        helperText={`${value.length} characters typed`}
      />
    )
  },
}