import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import pkg from './package.json' with { type: 'json' };

export default [
  {
    input: 'src/index.ts',
    external: ['react', 'tabbable'],
    output: [
      { file: pkg.main, format: 'cjs', exports: 'named' },
      {
        file: pkg.main.replace(/\.js$/, '.min.js'),
        format: 'cjs',
        exports: 'named',
        plugins: [terser()],
      },
      { file: pkg.module, format: 'es', exports: 'named' },
      {
        file: pkg.module.replace(/\.js$/, '.min.js'),
        format: 'es',
        exports: 'named',
        plugins: [terser()],
      },
    ],
    plugins: [
      babel({
        babelHelpers: 'bundled',
      }),
      resolve(),
      commonjs(),
      typescript(),
    ],
  },
  {
    input: 'src/index.ts',
    external: ['react', 'tabbable'],
    output: {
      file: pkg.types,
      format: 'es',
      exports: 'default',
    },
    plugins: [dts()],
  },
];
