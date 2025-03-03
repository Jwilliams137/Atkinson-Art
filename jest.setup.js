
if (process.env.NODE_ENV === 'development') {
  // jest.setup.js

// Mock Firebase modules
jest.mock('firebase/app', () => {
  return {
    initializeApp: jest.fn(),
    getAuth: jest.fn().mockReturnValue({
      // Mock authentication methods here if needed
    }),
    getFirestore: jest.fn().mockReturnValue({}),  // Mock getFirestore method here
    getStorage: jest.fn(),
  };
});

jest.mock('firebase/auth', () => {
  return {
    GoogleAuthProvider: jest.fn(),
    signInWithPopup: jest.fn(),
    getAuth: jest.fn(),
  };
});

jest.mock('firebase/storage', () => {
  return {
    getStorage: jest.fn(),
  };
});

jest.mock('firebase/firestore', () => {
  return {
    getFirestore: jest.fn().mockReturnValue({}), // Mock Firestore
  };
});
}