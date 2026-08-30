import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ProductCard } from './ProductCard'

const product = {
  id: 'p-1', name: 'Keyboard', description: 'Mechanical keyboard', price: '75.00', stock: 4,
  created_at: '2026-08-30T10:00:00Z', updated_at: '2026-08-30T10:00:00Z',
}

describe('ProductCard', () => {
  it('renders product information and detail link', () => {
    render(<MemoryRouter><ProductCard product={product} /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Keyboard' })).toBeInTheDocument()
    expect(screen.getByText('Mechanical keyboard')).toBeInTheDocument()
    expect(screen.getByText('75.00')).toBeInTheDocument()
    expect(screen.getByText('4 in stock')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view details/i })).toHaveAttribute('href', '/products/p-1')
  })
})
