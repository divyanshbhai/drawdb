# Testing Guide

This document provides information about the testing infrastructure and how to run tests in the drawDB project.

## Testing Framework

We use [Vitest](https://vitest.dev/) as our testing framework, which provides:
- Fast execution with native ES modules support
- Jest-compatible API
- Built-in TypeScript support
- Coverage reporting with v8

## Testing Libraries

- **@testing-library/react**: For testing React components
- **@testing-library/jest-dom**: Custom Jest matchers for DOM elements
- **@testing-library/user-event**: For simulating user interactions
- **jsdom**: Browser environment simulation for Node.js

## Running Tests

### Development Mode
```bash
# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui
```

### CI Mode
```bash
# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

## Test Structure

Tests are organized using the following structure:
```
src/
├── components/
│   ├── __tests__/
│   │   ├── Component.test.jsx
│   └── Component.jsx
├── hooks/
│   ├── __tests__/
│   │   ├── useHook.test.js
│   └── useHook.js
├── utils/
│   ├── __tests__/
│   │   ├── utils.test.js
│   └── utils.js
└── test/
    └── setup.js
```

## Writing Tests

### Component Tests
```javascript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Component from '../Component'

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Hook Tests
```javascript
import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import useCustomHook from '../useCustomHook'

describe('useCustomHook', () => {
  it('should return expected value', () => {
    const { result } = renderHook(() => useCustomHook())
    expect(result.current).toBe(expectedValue)
  })
})
```

### Utility Tests
```javascript
import { describe, it, expect } from 'vitest'
import { utilityFunction } from '../utils'

describe('utilityFunction', () => {
  it('should process input correctly', () => {
    expect(utilityFunction('input')).toBe('expected output')
  })
})
```

## Mocking

### External Dependencies
```javascript
import { vi } from 'vitest'

vi.mock('external-library', () => ({
  default: vi.fn(() => 'mocked value')
}))
```

### DOM APIs
```javascript
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  }
})
```

## Coverage

Coverage reports are generated in the `coverage/` directory and include:
- HTML report: `coverage/index.html`
- LCOV report: `coverage/lcov.info`
- JSON report: `coverage/coverage-final.json`

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it
2. **Use Descriptive Test Names**: Test names should clearly describe what is being tested
3. **Arrange, Act, Assert**: Structure tests with clear setup, execution, and verification phases
4. **Mock External Dependencies**: Isolate units under test by mocking external dependencies
5. **Test Edge Cases**: Include tests for error conditions and boundary values
6. **Keep Tests Simple**: Each test should verify one specific behavior

## Continuous Integration

Tests run automatically on:
- Push to main/develop branches
- Pull requests to main/develop branches
- Multiple Node.js versions (18.x, 20.x)

Coverage reports are uploaded to Codecov for tracking test coverage over time.