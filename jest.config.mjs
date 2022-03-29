const config = {
  //  testEnvironment: 'jsdom',
  // testPathIgnorePatterns: ['<rootDir>/integration'],
  preset: 'jest-puppeteer',
  testTimeout: 1000000,
  testPathIgnorePatterns: ['<rootDir>/util/__tests__'],
};

export default config;
