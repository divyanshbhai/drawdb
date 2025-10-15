import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import useThemedPage from '../useThemedPage'

describe('useThemedPage', () => {
  let originalClassList

  beforeEach(() => {
    // Mock document.body.classList
    originalClassList = document.body.classList
    document.body.classList = {
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn(() => false)
    }
  })

  afterEach(() => {
    document.body.classList = originalClassList
  })

  it('should add themed-page class to body on mount', () => {
    renderHook(() => useThemedPage())
    expect(document.body.classList.add).toHaveBeenCalledWith('themed-page')
  })

  it('should remove themed-page class from body on unmount', () => {
    const { unmount } = renderHook(() => useThemedPage())
    unmount()
    expect(document.body.classList.remove).toHaveBeenCalledWith('themed-page')
  })
})