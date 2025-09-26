import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
  auth: {
    currentUser: null,
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
  },
  db: {},
  storage: {},
}));

// Mock Gemini API
jest.mock('@/lib/gemini', () => ({
  analyzeUrl: jest.fn().mockResolvedValue({
    riskLevel: 'safe',
    riskScore: 15,
    threats: [],
    recommendations: ['Safe to visit'],
    explanation: 'This URL appears to be safe.',
  }),
}));

// Mock zustand store
jest.mock('zustand', () => ({
  create: jest.fn(() => ({
    user: null,
    scanHistory: [],
    badges: [],
    currentScreen: 'home',
    petVisible: false,
    petMessage: '',
    setUser: jest.fn(),
    addScanResult: jest.fn(),
    addXP: jest.fn(),
    unlockBadge: jest.fn(),
    setCurrentScreen: jest.fn(),
    showPet: jest.fn(),
    hidePet: jest.fn(),
    updateStreak: jest.fn(),
  })),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
  },
  Toaster: () => null,
}));

// Mock goQR.me API
jest.mock('@/lib/qr-scanner', () => ({
  scanImageFile: jest.fn().mockResolvedValue({ data: 'https://example.com' }),
  scanImageUrl: jest.fn().mockResolvedValue({ data: 'https://example.com' }),
  scanVideoFrame: jest.fn().mockResolvedValue({ data: 'https://example.com' }),
  captureVideoFrame: jest.fn().mockResolvedValue(new Blob()),
}));

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
