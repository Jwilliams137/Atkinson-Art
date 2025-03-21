import { render, screen, act } from "@testing-library/react";
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
  })),
}));

test("renders user greeting and logout button when user is logged in", async () => {
  await act(async () => {
    render(<AdminLogin />);
  });

  const welcomeMessage = screen.getByText(/Welcome Test User/i);
  const logoutButton = screen.getByText(/Logout/i);

  expect(welcomeMessage).toBeInTheDocument();
  expect(logoutButton).toBeInTheDocument();
});