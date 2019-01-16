import typescript from 'rollup-plugin-typescript';

export default {
  input: 'src/index.tsx',
  plugins: [
    typescript(),
  ],
  format: 'iife',
  external: ['react', 'react-flip-numbers', 'react-simple-animate'],
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
    },
    {
      file: 'dist/index.es.js',
      format: 'es',
    },
  ],
};
