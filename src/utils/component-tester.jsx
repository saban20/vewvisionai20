import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../main';

/**
 * Utility function to render components with Router and/or AuthContext
 * 
 * @param {React.Component} Component - The component to test
 * @param {Object} options - Test options
 * @param {Object} options.props - Props to pass to the component
 * @param {Boolean} options.withRouter - Whether to wrap with MemoryRouter
 * @param {String} options.path - Route path when using router
 * @param {Object} options.authContext - Auth context values
 * @param {Boolean} options.isLoggedIn - Whether user is logged in
 * @returns {Object} Testing utilities
 */
export const renderWithContext = (Component, options = {}) => {
  const {
    props = {},
    withRouter = false, 
    path = '/',
    authContext = {},
    isLoggedIn = false
  } = options;
  
  const defaultAuthContext = {
    isLoggedIn,
    login: jest.fn(),
    logout: jest.fn(),
    ...authContext
  };

  if (withRouter) {
    return render(
      <AuthContext.Provider value={defaultAuthContext}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path={path} element={<Component {...props} />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
  }
  
  return render(
    <AuthContext.Provider value={defaultAuthContext}>
      <Component {...props} />
    </AuthContext.Provider>
  );
};

/**
 * Utility to test a face scanning component
 * @param {React.Component} ScannerComponent - Component to test
 * @returns {Promise} Test result
 */
export const testFaceScanner = async (ScannerComponent) => {
  // Mock the MediaPipe/face detection libraries
  const mockMeasurements = {
    pupillaryDistance: 63.5,
    bridge_width: 17.2,
  };
  
  // Mock the face detection function
  global.detectFace = jest.fn().mockResolvedValue(mockMeasurements);
  
  // Render the scanner component
  const { container } = renderWithContext(ScannerComponent);
  
  // Find and simulate starting the scan
  const startButton = screen.getByText(/start scan/i) || screen.getByText(/scan face/i);
  fireEvent.click(startButton);
  
  // Wait for measurements to be displayed
  await waitFor(() => {
    expect(screen.getByText(/pupillary distance/i)).toBeInTheDocument();
  });
  
  return { container, mockMeasurements };
};

/**
 * Test API integration for a component
 * @param {React.Component} Component - Component to test
 * @param {String} apiEndpoint - API endpoint to mock
 * @param {Object} mockData - Mock data to return
 * @param {Object} props - Props to pass to component
 */
export const testApiIntegration = async (Component, apiEndpoint, mockData, props = {}) => {
  // Create a fetch mock
  const originalFetch = global.fetch;
  global.fetch = jest.fn().mockImplementation((url) => {
    if (url.includes(apiEndpoint)) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData)
      });
    }
    return originalFetch(url);
  });
  
  // Render the component
  renderWithContext(Component, { props, withRouter: true });
  
  // Wait for API data to be displayed
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining(apiEndpoint), expect.anything());
  });
  
  // Restore original fetch
  global.fetch = originalFetch;
};

/**
 * Test error handling in a component
 * @param {React.Component} Component - Component to test
 * @param {String} apiEndpoint - API endpoint to mock an error for
 * @param {Number} errorStatus - HTTP error status code
 * @param {Object} props - Props to pass to component
 */
export const testErrorHandling = async (Component, apiEndpoint, errorStatus = 500, props = {}) => {
  // Create a fetch mock that returns an error
  const originalFetch = global.fetch;
  global.fetch = jest.fn().mockImplementation((url) => {
    if (url.includes(apiEndpoint)) {
      return Promise.resolve({
        ok: false,
        status: errorStatus,
        statusText: 'Error',
        json: () => Promise.resolve({ error: 'Test error' })
      });
    }
    return originalFetch(url);
  });
  
  // Render the component
  renderWithContext(Component, { props, withRouter: true });
  
  // Wait for error to be displayed
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
  
  // Restore original fetch
  global.fetch = originalFetch;
}; 