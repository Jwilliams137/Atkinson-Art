"use client";
import { signInWithGoogle } from "../../../utils/firebase";
import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth } from "../../../utils/firebase";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [allowedEmails, setAllowedEmails] = useState([]);

  useEffect(() => {
    // Fetch allowed admin emails from API route
    fetch("/api/restricted-users")
      .then((res) => res.json())
      .then((data) => setAllowedEmails(data.restrictedUsers))
      .catch(() => setError("Failed to load admin access list."));
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setError("");

    try {
      const user = await signInWithGoogle();
      const { email } = user;

      if (allowedEmails.includes(email)) {
        setUser(user);
      } else {
        setError("You are not authorized to access this page.");
        await signOut(auth); // Log them out immediately
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

  const renderAuthButtons = () => (
    <div>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
      {error && <p>{error}</p>}
    </div>
  );

  const renderUserGreeting = () => {
    const { displayName, email } = user || {};
    return (
      <div>
        <p>Welcome {displayName || email}!</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  };

  return <div>{!user ? renderAuthButtons() : renderUserGreeting()}</div>;
}
