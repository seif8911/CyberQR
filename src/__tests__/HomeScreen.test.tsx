import { render, screen, fireEvent } from '@testing-library/react';
import HomeScreen from '@/components/screens/HomeScreen';

// Mock the store
jest.mock('@/lib/store', () => ({
  useAppStore: () => ({
    user: {
      id: '1',
      email: 'test@example.com',
      displayName: 'Test User',
      xp: 50,
      level: 1,
      streak: 3,
      badges: [],
      lastActive: new Date(),
      premium: false,
    },
    setCurrentScreen: jest.fn(),
    showPet: jest.fn(),
    updateStreak: jest.fn(),
  }),
}));

describe('HomeScreen', () => {
  it('renders the main title', () => {
    render(<HomeScreen />);
    expect(screen.getByText('CyberQR')).toBeInTheDocument();
  });

  it('displays user streak information', () => {
    render(<HomeScreen />);
    expect(screen.getByText('Day 3 🔥 Streak')).toBeInTheDocument();
  });

  it('shows quick action buttons', () => {
    render(<HomeScreen />);
    expect(screen.getByText('Start QR Scan')).toBeInTheDocument();
    expect(screen.getByText('Start First Lesson')).toBeInTheDocument();
    expect(screen.getByText('Open ICSA Hub')).toBeInTheDocument();
  });

  it('displays XP progress bar', () => {
    render(<HomeScreen />);
    const progressBar = document.querySelector('.progress > div');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveStyle('width: 50%');
  });
});
