export default {
    testEnvironment: "node",
    transform: {},
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    testMatch: ["**/tests/**/*.test.js"],
    // Configurações para suporte a ESM
    transformIgnorePatterns: ["/node_modules/(?!.*\\.mjs$)"],
};
