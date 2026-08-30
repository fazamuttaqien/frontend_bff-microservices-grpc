import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OrderEmpty, OrderLoading } from './OrderState'

describe('OrderState', () => {
  it('renders an accessible loading state', () => {
    render(<OrderLoading />)

    expect(
      screen.getByRole('status', { name: /loading orders/i }),
    ).toBeInTheDocument()
  })

  it('renders the empty state', () => {
    render(<OrderEmpty />)

    expect(screen.getByText('No orders yet')).toBeInTheDocument()
  })
})
