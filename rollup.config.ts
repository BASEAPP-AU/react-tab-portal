import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json' with { type: 'json' };

export default [
  {
    input: 'src/index.ts',
    external: ['react', 'tabbable'],
    output: [
      { file: pkg.main, format: 'cjs' },
      {
        file: pkg.main.replace(/\.js$/, '.min.js'),
        format: 'cjs',
        plugins: [terser()],
      },
      { file: pkg.module, format: 'es' },
      {
        file: pkg.module.replace(/\.js$/, '.min.js'),
        format: 'es',
        plugins: [terser()],
      },
    ],
    plugins: [babel(), resolve(), commonjs(), typescript()],
  },
];
