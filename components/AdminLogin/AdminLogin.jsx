"use client";
import { signInWithGoogle } from "../../firebase";
import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth } from "../../firebase";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setError("");

    try {
      const user = await signInWithGoogle();
      const allowedEmails = [
        "jwilliams137.036@gmail.com",
        "linda.atkinson111@gmail.com"
      ];
      
      if (allowedEmails.includes(user.email)) {
        setUser(user);
      } else {
        setError("You are not authorized to access this page.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      setError("Logout failed. Please try again.");
    }
  };

  return (
    <div>
      {!user ? (
        <>
          <button onClick={handleGoogleLogin}>Sign in with Google</button>
          {error && <p>{error}</p>}
        </>
      ) : (
        <>
          <p>Welcome {user.displayName || user.email}!</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
}
