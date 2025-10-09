module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    "<rootDir>/shared",
    "<rootDir>/apps"
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: [
    "**/__tests__/**/*.(ts|js)",
    "**/?(*.)+(spec|test).(ts|js)"
  ]
};

