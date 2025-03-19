import { vi } from 'vitest';

// Mock ThemeContext used by many components
vi.mock('./src/main', () => ({
  ThemeContext: {
    Consumer: ({ children }) => children({ themeMode: 'light', setThemeMode: vi.fn() }),
  },
  AccessibilityContext: {
    Consumer: ({ children }) => children({ enableVoiceControl: vi.fn() }),
  },
  AIContext: {
    Consumer: ({ children }) => children({ status: { loading: false, initialized: true, error: null } }),
  },
  AuthContext: {
    Consumer: ({ children }) => children({ isLoggedIn: false, login: vi.fn(), logout: vi.fn() }),
  },
})); 