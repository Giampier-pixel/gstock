import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const config = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts', '.vercel/**', 'src/**'],
  },
  {
    rules: {
      // useActionState + dialog close on success is an acceptable pattern; React 19 lints it
      // as a perf warning. Keep as warn rather than error so it doesn't block builds.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];

export default config;
