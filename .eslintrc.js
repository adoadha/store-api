module.exports = {
  env: { es6: true, node: true, es2021: true },
  ignorePatterns: ["node_modules", "build", "coverage"],
  plugins: [
    "import",
    "eslint-comments",
    "functional",
    "@typescript-eslint",
    "unused-imports",
  ],
  extends: [
    "eslint:recommended",
    "plugin:eslint-comments/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
    // "plugin:functional/lite",
    "prettier",
  ],
  globals: { BigInt: true, console: true, WebAssembly: true },
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "unused-imports/no-unused-imports": "warn",
    // 'simple-import-sort/exports': 'warn',
    // 'simple-import-sort/imports': [
    //   'warn',
    //   {
    //     groups: [
    //       // Lib and hooks
    //       ['^@/lib'],
    //       // utils
    //       ['^@/utils'],
    //       // interface
    //       ['^@/interfaces'],
    //       // others imports
    //       ['^@/'],
    //       // relative paths up until 3 level
    //       [
    //         '^\\./?$',
    //         '^\\.(?!/?$)',
    //         '^\\.\\./?$',
    //         '^\\.\\.(?!/?$)',
    //         '^\\.\\./\\.\\./?$',
    //         '^\\.\\./\\.\\.(?!/?$)',
    //         '^\\.\\./\\.\\./\\.\\./?$',
    //         '^\\.\\./\\.\\./\\.\\.(?!/?$)',
    //       ],
    //       // other that didnt fit in
    //       ['^'],
    //     ],
    //   },
    // ],
    "@typescript-eslint/ban-types": [
      "error",
      {
        extendDefaults: true,
        types: {
          "{}": false,
        },
      },
    ],
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: ["./tsconfig.json"],
      },
    },
  },
};
