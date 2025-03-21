import { render, screen, act, fireEvent, waitFor } from "@testing-library/react";
import AdminLogin from "../../src/components/AdminLogin/AdminLogin";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ restrictedUsers: ["authorized@example.com"] }),
  })
);

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    onAuthStateChanged: jest.fn((callback) => {
      callback(null);
      return jest.fn();
    }),
    signOut: jest.fn(() => Promise.resolve()),
  })),
}));

jest.mock("../../src/utils/firebase", () => ({
  signInWithGoogle: jest.fn(() =>
    Promise.resolve({ displayName: "Unauthorized User", email: "unauthorized@example.com" })
  ),
}));

test("shows error message when unauthorized user logs in", async () => {
    await act(async () => {
      render(<AdminLogin />);
    });
  
    const loginButton = screen.getByText(/Sign in with Google/i);
    expect(loginButton).toBeInTheDocument();
  
    await act(async () => {
      fireEvent.click(loginButton);
    });
  
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  
    const errorMessage = await screen.findByText(/Login failed. Please try again./i);
    expect(errorMessage).toBeInTheDocument();
  });