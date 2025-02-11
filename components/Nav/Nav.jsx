"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged } from "firebase/auth";

export default function Nav() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav>
      <ul style={{ display: 'flex', listStyle: 'none', gap: '1rem' }}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        {user && user.email === "jwilliams137.036@gmail.com" && (
          <li>
            <Link href="/admin">Admin</Link>
          </li>
        )}

      </ul>
    </nav>
  );
}
