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
        "^@/(.*)$": "<rootDir>/$1",
    },
};

process.env.NEXT_PUBLIC_AWS_ENDPOINT = 'https://aws.com/api';