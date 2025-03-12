// __mocks__/firebaseMock.js
const auth = {
  getAuth: jest.fn(() => ({
    currentUser: { uid: "123", email: "test@example.com" },
  })),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn((callback) => {
    callback({ uid: "123", email: "test@example.com" }); // Mock user object
    return () => {}; // Return a function to unsubscribe
  }),
};

const firestore = {
  getFirestore: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
};

const storage = {
  getStorage: jest.fn(),
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(() => Promise.resolve("mock-url")),
};

module.exports = { ...auth, ...firestore, ...storage };
