import { render, screen, act } from "@testing-library/react";
import AdminLogin from "../../src/components/AdminLogin/AdminLogin";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ restrictedUsers: ['authorized@example.com'] }),
  })
);

// Mock the auth object and onAuthStateChanged to simulate a logged-in user
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    onAuthStateChanged: jest.fn((callback) => {
      callback({ displayName: 'Test User', email: 'authorized@example.com' }); // Simulate a logged-in user
      return jest.fn(); // Return a mock unsubscribe function
    }),
  })),
}));

test("renders user greeting and logout button when user is logged in", async () => {
  await act(async () => {
    render(<AdminLogin />);
  });

  const welcomeMessage = screen.getByText(/Welcome Test User/i); // Check if the greeting contains the user's name
  const logoutButton = screen.getByText(/Logout/i); // Check if the logout button is rendered

  expect(welcomeMessage).toBeInTheDocument();
  expect(logoutButton).toBeInTheDocument();
});
