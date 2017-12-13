module.exports = {
    parserOptions: {
        ecmaVersion: 7,
        ecmaFeatures: {
            impliedStrict: true,
            jsx: true,
            experimentalObjectRestSpread: true
        },
        sourceType: 'module'
    },
    parser: 'babel-eslint',
    env: {
        node: true,
        es6: true
    },
    globals: {
        __DEV__: true,
        __PROD__: true,
    },
    plugins: [
        'prettier',
    ],
    extends:[
        "prettier",
    ],
    rules: {
        "prettier/prettier": [
            "error", 
            {
                "singleQuote":true, 
                "semi":false,
                tabWidth: 4,
            }
        ],
        // disallow the use of console
        'no-console': "warn"
    }
}