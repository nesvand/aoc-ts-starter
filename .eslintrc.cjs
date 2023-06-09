/** @type { import('eslint').Linter.Config } */
module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
    plugins: ['@typescript-eslint', 'prettier'],
    root: true,
    rules: {
        'prettier/prettier': 'error',
    },
    env: {
        node: true,
    },
};
