import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

test("Firebase Auth mock works", async () => {
  const auth = getAuth();
  await signInWithEmailAndPassword(auth, "test@example.com", "password123");

  expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, "test@example.com", "password123");
});