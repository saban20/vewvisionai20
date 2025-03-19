# VisionAI Testing Documentation

This directory contains tests for the VisionAI application, including unit tests, component tests, and end-to-end tests.

## Testing Structure

- **Unit Tests**: Located alongside the source files with `.test.js` or `.test.jsx` extensions
- **API Tests**: Tests for API services in `src/services/*.test.js`
- **End-to-End Tests**: Located in `tests/e2e-test.js`

## Running Tests

### Unit and Component Tests

To run the unit and component tests:

```bash
npm test
```

This will run all tests using Vitest and display the results in the console.

### End-to-End Tests

To run the end-to-end tests:

```bash
# Make sure the development server is running first
npm run dev

# In a separate terminal
npm run test:e2e
```

### All Tests

To run all tests (unit, component, and E2E):

```bash
# Make sure the development server is running first
npm run dev

# In a separate terminal
npm run test:all
```

## Test Data

- **test-face.jpg**: A sample face image used for testing face detection and measurement algorithms.
  - Place a test face image in this directory for the E2E tests to use.

## Setting Up the Test Environment

Before running tests, make sure you have installed all necessary dependencies:

```bash
npm install
```

For E2E tests, you also need to install the test-specific dependencies:

```bash
npm install --save-dev puppeteer node-fetch
```

## Troubleshooting Tests

If tests are failing, check the following:

1. **API Mock Data**: Ensure the mock data in `src/mocks/api.js` is up to date.
2. **Component Rendering**: Check that components are rendering correctly and that your selectors match the actual DOM structure.
3. **Network Issues**: For E2E tests, ensure the development server is running on port 5173.
4. **Authentication**: If tests involve authentication, make sure the test user credentials are valid.

## Adding New Tests

When adding new tests:

1. Unit tests should be placed next to the file they're testing with a `.test.js` extension
2. Use the existing test structure and naming conventions
3. Make sure to test both expected behavior and error cases
4. For UI components, test rendering and user interactions

## Continuous Integration

These tests are designed to be run in a CI environment. The E2E tests use Puppeteer which runs Chrome in headless mode by default in CI environments. 