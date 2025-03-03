import '@testing-library/jest-dom';

// jest.setup.js
jest.mock('firebase/app', () => {
  return {
    initializeApp: jest.fn(),
    getAuth: jest.fn().mockReturnValue({
      // Mock authentication methods here if needed
    }),
    getFirestore: jest.fn(),
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
    getFirestore: jest.fn(),
  };
});
