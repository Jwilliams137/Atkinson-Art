import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
}));

test("Firebase Auth mock works with restricted users", async () => {
  const auth = getAuth();

  (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
    user: {
      email: "test@example.com",
    },
  });

  const userCredential = await signInWithEmailAndPassword(auth, "test@example.com", "password123");

  expect(userCredential.user.email).toBe("test@example.com");
  expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, "test@example.com", "password123");
});
