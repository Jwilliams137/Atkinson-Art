import { render, screen } from '@testing-library/react';
import { useAuth } from '../src/hooks/useAuth'; // Assuming useAuth uses Firebase
import AdminPage from '../src/app/admin/page';
import { getAuth } from 'firebase/auth';

// Mock the useAuth hook and Firebase
jest.mock('../src/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

describe('AdminPage', () => {
  test('should render AdminPage with mocked Firebase auth', async () => {
    // Mock Firebase auth
    const mockUser = { uid: '123', email: 'test@example.com' };
    const mockOnAuthStateChanged = jest.fn((callback) => {
      callback(mockUser); // Simulate user being authenticated
    });

    getAuth.mockReturnValue({
      currentUser: mockUser,
      onAuthStateChanged: mockOnAuthStateChanged,
    });

    useAuth.mockReturnValue({
      user: mockUser,
      isUserAllowed: true,
      restrictedUsers: ['test@example.com'],
    });

    render(<AdminPage />);

    // Assertions to check if the component renders correctly
    expect(screen.getByText('Admin Page')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument(); // Check for email
  });
});
