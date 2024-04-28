const esModules = ['d3', 'd3-array'].join('|');

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
        'd3': '<rootDir>/node_modules/d3/dist/d3.min.js',
    },
    transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
};

process.env.NEXT_PUBLIC_AWS_ENDPOINT = "https://aws.com/api";
