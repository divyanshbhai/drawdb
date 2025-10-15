import { describe, it, expect } from 'vitest'
import {
  arrayIsEqual,
  strHasQuotes,
  isKeyword,
  isFunction,
  areFieldsCompatible,
  getTableHeight,
} from '../utils'

describe('utils', () => {
  describe('arrayIsEqual', () => {
    it('should return true for equal arrays', () => {
      expect(arrayIsEqual([1, 2, 3], [1, 2, 3])).toBe(true)
      expect(arrayIsEqual([], [])).toBe(true)
    })

    it('should return false for different arrays', () => {
      expect(arrayIsEqual([1, 2, 3], [1, 2, 4])).toBe(false)
      expect(arrayIsEqual([1, 2], [1, 2, 3])).toBe(false)
    })
  })

  describe('strHasQuotes', () => {
    it('should return true for quoted strings', () => {
      expect(strHasQuotes("'hello'")).toBe(true)
      expect(strHasQuotes('"hello"')).toBe(true)
      expect(strHasQuotes('`hello`')).toBe(true)
    })

    it('should return false for unquoted strings', () => {
      expect(strHasQuotes('hello')).toBe(false)
      expect(strHasQuotes("'hello")).toBe(false)
      expect(strHasQuotes('h')).toBe(false)
      expect(strHasQuotes('')).toBe(false)
    })
  })

  describe('isKeyword', () => {
    it('should return true for SQL keywords', () => {
      expect(isKeyword('NULL')).toBe(true)
      expect(isKeyword('true')).toBe(true)
      expect(isKeyword('CURRENT_DATE')).toBe(true)
    })

    it('should return false for non-keywords', () => {
      expect(isKeyword('hello')).toBe(false)
      expect(isKeyword('SELECT')).toBe(false)
    })
  })

  describe('isFunction', () => {
    it('should return true for function calls', () => {
      expect(isFunction('NOW()')).toBe(true)
      expect(isFunction('COUNT(*)')).toBe(true)
      expect(isFunction('SUM(price)')).toBe(true)
    })

    it('should return false for non-functions', () => {
      expect(isFunction('hello')).toBe(false)
      expect(isFunction('NOW')).toBe(false)
      expect(isFunction('COUNT(')).toBe(false)
    })
  })

  describe('getTableHeight', () => {
    it('should calculate table height correctly', () => {
      const table = { fields: [1, 2, 3] }
      const height = getTableHeight(table)
      expect(typeof height).toBe('number')
      expect(height).toBeGreaterThan(0)
    })
  })
})