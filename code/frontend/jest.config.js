module.exports = {
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: "tsconfig.test.json",
            },
        ],
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/app/api/factories/factoryAPI",
    },
};
