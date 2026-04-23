// Vitest global test setup: registers jest-dom matchers and polyfills browser APIs
// (IntersectionObserver, scrollIntoView) that jsdom does not implement.
import '@testing-library/jest-dom'

// IntersectionObserver is not implemented in jsdom
globalThis.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof IntersectionObserver

// scrollIntoView is not implemented in jsdom
window.HTMLElement.prototype.scrollIntoView = () => {}
