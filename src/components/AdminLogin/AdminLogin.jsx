"use client";
import { signInWithGoogle } from "../../utils/firebase";
import { getAuth, signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import styles from './AdminLogin.module.css';

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [allowedEmails, setAllowedEmails] = useState([]);
  const auth = getAuth();
  
  // Fetch restricted users on mount
  useEffect(() => {
    fetch("/api/restricted-users")
      .then((res) => res.json())
      .then((data) => setAllowedEmails(data.restrictedUsers))
      .catch(() => setError("Failed to load admin access list."));
  }, []);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  // Google login function
  const handleGoogleLogin = async () => {
    setError(""); // Reset error before login attempt

    try {
      const user = await signInWithGoogle();
      const { email } = user;

      // Check if user email is allowed
      if (allowedEmails.includes(email)) {
        setUser(user); // Set user if email is allowed
      } else {
        setError("You are not authorized to access this page.");
        await signOut(auth); // Sign out if not authorized
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear user state after logout
    } catch (err) {
      setError("Logout failed. Please try again.");
    }
  };

  // Display login button if no user, otherwise display user info
  const renderAuthButtons = () => (
    <div className={styles.authContainer}>
      <button onClick={handleGoogleLogin} className={styles.button}>
        Sign in with Google
      </button>
    </div>
  );

  const renderUserGreeting = () => {
    const { displayName, email } = user || {};
    return (
      <div className={styles.userContainer}>
        <p className={styles.welcomeText}>Welcome {displayName || email}!</p>
        <button onClick={handleLogout} className={styles.button}>
          Logout
        </button>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Show error message if it exists */}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* Render login or user greeting based on authentication state */}
      {!user ? renderAuthButtons() : renderUserGreeting()}
    </div>
  );
}
