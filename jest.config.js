const config = {
  clearMocks: true,
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^firebase/auth$": process.env.NODE_ENV === "test" ? "<rootDir>/__mocks__/firebaseMock.js" : "firebase/auth",
    "^firebase/firestore$": process.env.NODE_ENV === "test" ? "<rootDir>/__mocks__/firebaseMock.js" : "firebase/firestore",
    "^firebase/storage$": process.env.NODE_ENV === "test" ? "<rootDir>/__mocks__/firebaseMock.js" : "firebase/storage",
    '\\.module\\.css$': 'identity-obj-proxy', 
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
};

module.exports = config;