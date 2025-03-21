import { render, screen, act } from "@testing-library/react";
import AdminLogin from "../src/components/AdminLogin/AdminLogin";
import { getAuth } from "firebase/auth";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ restrictedUsers: ['authorized@example.com'] }),
  })
);

// Mock the auth object and onAuthStateChanged
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    onAuthStateChanged: jest.fn((callback) => {
      callback(null); // Simulate no user logged in
      return jest.fn(); // Return a mock unsubscribe function
    }),
  })),
}));

test("renders the Google login button when no user is logged in", async () => {
  await act(async () => {
    render(<AdminLogin />);
  });
  
  const loginButton = screen.getByText(/Sign in with Google/i);
  expect(loginButton).toBeInTheDocument();
});
