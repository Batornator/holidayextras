module.exports = {
  "env": {
    "commonjs": true,
    "browser": true,
    "es6": true,
    "node": true,
  },
  "extends": "eslint:recommended",
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly",
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
  },
  "rules": {
    indent: ["error", "tab"],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "array-bracket-spacing": ["error", "always"],
    "object-curly-spacing": ["error", "always"],
    "space-in-parens": ["error", "always"]
  },
};