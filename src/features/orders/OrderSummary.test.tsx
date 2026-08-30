import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { OrderSummary } from './OrderSummary'

const order = {
  id: 'ord-1',
  status: 'pending',
  created_at: '2026-08-30T10:00:00Z',
  total: '150.00',
  items: [{ product_id: 'p-1', quantity: 2, price: '75.00', total: '150.00' }],
}

describe('OrderSummary', () => {
  it('renders order details and item information', () => {
    render(
      <MemoryRouter>
        <OrderSummary
          order={order}
          products={[
            {
              id: 'p-1',
              name: 'Keyboard',
              description: '',
              price: '75.00',
              stock: 3,
            },
          ]}
        />
      </MemoryRouter>,
    )
    expect(screen.getByText('Order #ord-1')).toBeInTheDocument()
    expect(screen.getByText('pending')).toBeInTheDocument()
    expect(screen.getByText('Keyboard')).toBeInTheDocument()
    expect(screen.getByText(/Qty 2/)).toBeInTheDocument()
    expect(screen.getByText(/150\.00/)).toBeInTheDocument()
  })
})
