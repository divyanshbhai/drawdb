import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useFullscreen from '../useFullscreen'

// Mock usehooks-ts
vi.mock('usehooks-ts', () => ({
  useEventListener: vi.fn((event, handler) => {
    // Store the handler for manual triggering in tests
    document._fullscreenHandler = handler
  })
}))

describe('useFullscreen', () => {
  beforeEach(() => {
    // Reset document.fullscreenElement
    Object.defineProperty(document, 'fullscreenElement', {
      writable: true,
      configurable: true,
      value: null
    })
  })

  it('should return false when not in fullscreen', () => {
    const { result } = renderHook(() => useFullscreen())
    expect(result.current).toBe(false)
  })

  it('should return true when in fullscreen', () => {
    // Mock fullscreen state
    Object.defineProperty(document, 'fullscreenElement', {
      writable: true,
      configurable: true,
      value: document.documentElement
    })

    const { result } = renderHook(() => useFullscreen())
    expect(result.current).toBe(true)
  })

  it('should update when fullscreen state changes', () => {
    const { result } = renderHook(() => useFullscreen())
    
    expect(result.current).toBe(false)

    // Simulate entering fullscreen
    act(() => {
      Object.defineProperty(document, 'fullscreenElement', {
        writable: true,
        configurable: true,
        value: document.documentElement
      })
      
      // Trigger the event handler
      if (document._fullscreenHandler) {
        document._fullscreenHandler()
      }
    })

    expect(result.current).toBe(true)
  })
})