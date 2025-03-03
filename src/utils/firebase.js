// firebase.js or firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGESENDERID,
  appId: process.env.NEXT_PUBLIC_APPID,
};

// Declare variables at the top level
let app, auth, storage, db, provider;

// Only initialize Firebase if not in a test environment
if (process.env.NODE_ENV !== 'test') {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  storage = getStorage(app);
  db = getFirestore(app);
  provider = new GoogleAuthProvider();
}

// Function to sign in with Google
const signInWithGoogle = async () => {
  try {
    if (!auth) throw new Error("Firebase auth is not initialized");
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

// Export necessary Firebase components
export { app, auth, storage, db, signInWithGoogle };
