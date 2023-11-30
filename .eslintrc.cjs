/** @type {import("eslint").Linter.Config} */
const config = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ["standard-with-typescript", "prettier"],
    overrides: [
        {
            env: {
                node: true,
            },
            files: [".eslintrc.{js,cjs}"],
            parserOptions: {
                sourceType: "script",
            },
        },
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    rules: {},
};

module.exports = config;
