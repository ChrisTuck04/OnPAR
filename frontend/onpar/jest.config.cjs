module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.app.json" }],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
