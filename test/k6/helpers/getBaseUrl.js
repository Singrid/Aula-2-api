// Helper to obtain base URL from environment variable BASE_URL
export function getBaseUrl() {
  // k6 exposes environment variables through the global __ENV
  return __ENV.BASE_URL || 'http://localhost:3000';
}
