import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  external: Object.keys(pkg.devDependencies),
  plugins: [
    babel({
      babelHelpers: 'bundled',
    }),
    replace({
      __DEV__: "process.env.NODE_ENV === 'development'",
    }),
  ],
};
