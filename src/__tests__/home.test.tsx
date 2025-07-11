import { render, screen } from '@testing-library/react'

// Simple test for basic functionality
describe('Testing Setup', () => {
  it('renders a basic component', () => {
    const TestComponent = () => <div>Test Component</div>
    
    render(<TestComponent />)
    
    const element = screen.getByText('Test Component')
    expect(element).toBeInTheDocument()
  })

  it('performs basic math operations', () => {
    expect(2 + 2).toBe(4)
    expect(10 * 3).toBe(30)
  })

  it('handles string operations', () => {
    const str = 'IECA'
    expect(str.toLowerCase()).toBe('ieca')
    expect(str.length).toBe(4)
  })
})
