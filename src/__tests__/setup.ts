import '@testing-library/jest-dom'

// IntersectionObserver is not implemented in jsdom
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof IntersectionObserver

// scrollIntoView is not implemented in jsdom
window.HTMLElement.prototype.scrollIntoView = () => {}
