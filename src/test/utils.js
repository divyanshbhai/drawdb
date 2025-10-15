// Test utilities for common testing patterns

// Mock data generators
export const createMockTable = (overrides = {}) => ({
  id: 'table-1',
  name: 'users',
  x: 100,
  y: 100,
  fields: [
    {
      id: 'field-1',
      name: 'id',
      type: 'INT',
      primary: true,
      notNull: true,
      unique: false,
      autoIncrement: true,
      comment: ''
    },
    {
      id: 'field-2',
      name: 'email',
      type: 'VARCHAR',
      size: 255,
      primary: false,
      notNull: true,
      unique: true,
      autoIncrement: false,
      comment: ''
    }
  ],
  comment: '',
  indices: [],
  color: '#3B82F6',
  ...overrides
})

export const createMockDiagram = (overrides = {}) => ({
  id: 'diagram-1',
  name: 'Test Diagram',
  database: 'mysql',
  tables: [createMockTable()],
  relationships: [],
  notes: [],
  areas: [],
  ...overrides
})

// Test helpers
export const waitForElement = (callback, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    
    const check = () => {
      try {
        const result = callback()
        if (result) {
          resolve(result)
        } else if (Date.now() - startTime > timeout) {
          reject(new Error('Element not found within timeout'))
        } else {
          setTimeout(check, 10)
        }
      } catch (error) {
        if (Date.now() - startTime > timeout) {
          reject(error)
        } else {
          setTimeout(check, 10)
        }
      }
    }
    
    check()
  })
}