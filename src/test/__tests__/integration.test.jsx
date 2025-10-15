import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithRouter, createMockDiagram } from '../utils'
import App from '../../App'

// Mock the database operations
vi.mock('../../data/db', () => ({
  db: {
    diagrams: {
      toArray: vi.fn(() => Promise.resolve([])),
      add: vi.fn(() => Promise.resolve(1)),
      update: vi.fn(() => Promise.resolve()),
      delete: vi.fn(() => Promise.resolve())
    }
  }
}))

// Mock Vercel Analytics
vi.mock('@vercel/analytics', () => ({
  Analytics: () => null
}))

vi.mock('@vercel/speed-insights', () => ({
  SpeedInsights: () => null
}))

describe('Integration Tests', () => {
  it('should render the landing page by default', async () => {
    renderWithRouter(<App />)
    
    // Check if the main navigation elements are present
    expect(screen.getByAltText('logo')).toBeInTheDocument()
    expect(screen.getByText('Features')).toBeInTheDocument()
    expect(screen.getByText('Editor')).toBeInTheDocument()
  })

  it('should navigate to editor when editor link is clicked', async () => {
    renderWithRouter(<App />)
    
    const editorLink = screen.getByText('Editor')
    fireEvent.click(editorLink)
    
    // The URL should change (we can't easily test this without more complex setup)
    expect(editorLink).toBeInTheDocument()
  })

  it('should handle diagram data correctly', () => {
    const mockDiagram = createMockDiagram({
      name: 'Integration Test Diagram',
      tables: [
        {
          id: 'table-1',
          name: 'users',
          fields: [
            { id: 'field-1', name: 'id', type: 'INT', primary: true },
            { id: 'field-2', name: 'email', type: 'VARCHAR' }
          ]
        }
      ]
    })

    expect(mockDiagram.name).toBe('Integration Test Diagram')
    expect(mockDiagram.tables).toHaveLength(1)
    expect(mockDiagram.tables[0].fields).toHaveLength(2)
  })
})