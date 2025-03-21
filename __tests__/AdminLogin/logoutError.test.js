import { render, screen, act, fireEvent } from "@testing-library/react";
import AdminLogin from "../../src/components/AdminLogin/AdminLogin";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ restrictedUsers: ['authorized@example.com'] }),
  })
);

jest.mock("firebase/auth", () => ({
    getAuth: jest.fn(() => ({
      onAuthStateChanged: jest.fn((callback) => {
        callback({ displayName: 'Test User', email: 'authorized@example.com' });
        return jest.fn();
      }),
      signOut: jest.fn(() => Promise.reject("Logout failed")),
    })),
  }));
  

test("shows error message when logout fails", async () => {
  await act(async () => {
    render(<AdminLogin />);
  });

  const logoutButton = screen.getByText(/Logout/i);
  await act(async () => {
    fireEvent.click(logoutButton);
  });

  const errorMessage = screen.getByText(/Logout failed. Please try again/i);
  expect(errorMessage).toBeInTheDocument();
});