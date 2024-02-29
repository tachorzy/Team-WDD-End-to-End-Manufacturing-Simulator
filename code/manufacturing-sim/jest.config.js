module.exports = {
    globals: {
        "ts-jest": {
            tsConfig: "tsconfig.test.json",
        },
    },
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
};
