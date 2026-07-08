import '@testing-library/jest-dom'

if (typeof ResizeObserver === 'undefined') {
  ;(globalThis as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

// This jsdom setup doesn't implement Storage (real browsers always do), so
// tests exercising localStorage-backed features need an in-memory stand-in.
if (typeof localStorage === 'undefined') {
  class MemoryStorage {
    private store = new Map<string, string>()
    getItem(key: string) {
      return this.store.has(key) ? this.store.get(key)! : null
    }
    setItem(key: string, value: string) {
      this.store.set(key, String(value))
    }
    removeItem(key: string) {
      this.store.delete(key)
    }
    clear() {
      this.store.clear()
    }
    key(index: number) {
      return Array.from(this.store.keys())[index] ?? null
    }
    get length() {
      return this.store.size
    }
  }
  const memoryStorage = new MemoryStorage()
  ;(globalThis as any).localStorage = memoryStorage
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'localStorage', { value: memoryStorage, configurable: true })
  }
}

// jsdom does not implement layout, so getBoundingClientRect() always returns
// all-zero dimensions. Recharts' ResponsiveContainer reads this on mount to
// size the chart, so without a non-zero stub it never renders its children.
Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
  configurable: true,
  value: () => ({
    width: 400,
    height: 400,
    top: 0,
    left: 0,
    bottom: 400,
    right: 400,
    x: 0,
    y: 0,
    toJSON: () => {},
  }),
})
