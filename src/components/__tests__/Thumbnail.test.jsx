import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import Thumbnail from '../Thumbnail'

// Mock html-to-image
vi.mock('html-to-image', () => ({
  toPng: vi.fn(() => Promise.resolve('data:image/png;base64,mock'))
}))

// Mock the canvas context and other dependencies
vi.mock('../../context/CanvasContext', () => ({
  useCanvas: () => ({
    zoom: 1,
    pan: { x: 0, y: 0 },
    canvasWidth: 800,
    canvasHeight: 600
  })
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
    const { container } = render(<Thumbnail {...mockProps} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders an SVG element', () => {
    const { container } = render(<Thumbnail {...mockProps} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })
})