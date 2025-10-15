import { describe, it, expect } from 'vitest'
import { createMockDiagram, createMockTable } from '../utils.js'

describe('Integration Tests', () => {
  it('should handle diagram data correctly', () => {
    const mockDiagram = createMockDiagram({
      name: 'Integration Test Diagram',
      tables: [
        createMockTable({
          id: 'table-1',
          name: 'users',
          fields: [
            { id: 'field-1', name: 'id', type: 'INT', primary: true },
            { id: 'field-2', name: 'email', type: 'VARCHAR' }
          ]
        })
      ]
    })

    expect(mockDiagram.name).toBe('Integration Test Diagram')
    expect(mockDiagram.tables).toHaveLength(1)
    expect(mockDiagram.tables[0].fields).toHaveLength(2)
    expect(mockDiagram.tables[0].name).toBe('users')
  })

  it('should create mock tables with correct structure', () => {
    const mockTable = createMockTable({
      name: 'products',
      fields: [
        { id: 'field-1', name: 'id', type: 'INT', primary: true },
        { id: 'field-2', name: 'name', type: 'VARCHAR' },
        { id: 'field-3', name: 'price', type: 'DECIMAL' }
      ]
    })

    expect(mockTable.name).toBe('products')
    expect(mockTable.fields).toHaveLength(3)
    expect(mockTable.fields[0].primary).toBe(true)
    expect(mockTable.x).toBe(100)
    expect(mockTable.y).toBe(100)
  })

  it('should handle empty diagrams', () => {
    const emptyDiagram = createMockDiagram({
      name: 'Empty Diagram',
      tables: [],
      relationships: [],
      notes: []
    })

    expect(emptyDiagram.name).toBe('Empty Diagram')
    expect(emptyDiagram.tables).toHaveLength(0)
    expect(emptyDiagram.relationships).toHaveLength(0)
    expect(emptyDiagram.notes).toHaveLength(0)
  })
})