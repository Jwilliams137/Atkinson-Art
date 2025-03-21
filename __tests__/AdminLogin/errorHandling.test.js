import { render, screen, act } from "@testing-library/react";
import AdminLogin from "../../src/components/AdminLogin/AdminLogin";

global.fetch = jest.fn(() =>
  Promise.reject("API fetch failed")
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
  
test("shows error message when fetch fails", async () => {
  await act(async () => {
    render(<AdminLogin />);
  });

  const errorMessage = screen.getByText(/Failed to load admin access list/i);
  expect(errorMessage).toBeInTheDocument();
});