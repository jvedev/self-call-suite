module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    "<rootDir>/views",
    "<rootDir>/web-components",
    "<rootDir>/styles",
    "<rootDir>/modules"
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: [
    "**/__tests__/**/*.(ts|js)",
    "**/?(*.)+(spec|test).(ts|js)"
  ]
};

