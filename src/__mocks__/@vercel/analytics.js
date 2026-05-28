// Mock for @vercel/analytics to support testing
export const Analytics = () => null;

export const track = jest.fn();
export const inject = jest.fn();
export const pageview = jest.fn();
