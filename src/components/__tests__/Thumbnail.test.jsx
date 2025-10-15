import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Thumbnail from '../Thumbnail'

// Mock html-to-image
vi.mock('html-to-image', () => ({
  toPng: vi.fn(() => Promise.resolve('data:image/png;base64,mock'))
}))

describe('Thumbnail', () => {
  const mockProps = {
    diagram: {
      name: 'Test Diagram',
      tables: [],
      relationships: [],
      notes: [],
      areas: []
    },
    setThumbnail: vi.fn(),
    diagramId: 'test-id'
  }

  it('renders without crashing', () => {
    render(<Thumbnail {...mockProps} />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('displays diagram name', () => {
    render(<Thumbnail {...mockProps} />)
    expect(screen.getByText('Test Diagram')).toBeInTheDocument()
  })
})