import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ProductEmpty, ProductError } from './ProductState'

describe('ProductState', () => {
  it('renders an API failure and retries when requested', () => {
    const retry = vi.fn()
    render(<ProductError message="Unable to reach the server." onAction={retry} />)

    fireEvent.click(screen.getByRole('button', { name: /try again/i }))

    expect(screen.getByText('Unable to load products')).toBeInTheDocument()
    expect(retry).toHaveBeenCalledTimes(1)
  })

  it('renders the empty state', () => {
    render(<ProductEmpty />)

    expect(screen.getByText('No products found')).toBeInTheDocument()
  })
})
