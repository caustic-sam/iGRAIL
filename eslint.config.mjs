import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  {
    // These directories are generated, vendored, or intentionally out of scope
    // for the app lint pass. Keeping the ignore list explicit makes it easier
    // for junior developers to understand why ESLint is skipping them.
    ignores: [
      '.next/**',
      'coverage/**',
      'node_modules/**',
      '.pnpm-store/**',
      'docs/archive/**',
    ],
  },
  ...nextCoreWebVitals,
];

export default eslintConfig;
