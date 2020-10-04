import fs from 'fs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import pkg from './package.json';

const isDevBuild = process.env.BUILD === 'development';

export default {
  input: 'src/index.js',
  output: [
    !isDevBuild && {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: isDevBuild,
    },
  ],
  external: Object.keys(pkg.peerDependencies),
  plugins: [
    babel({
      babelHelpers: 'bundled',
    }),
    replace({
      __DEV__: "process.env.NODE_ENV === 'development'",
    }),
    copyFile('src/index.d.ts', 'dist/index.d.ts'),
  ],
};

function copyFile(source, dest) {
  let called = false;
  return {
    async writeBundle() {
      if (called) return;
      called = true;
      try {
        await fs.promises.copyFile(source, dest);
        console.log(`copied ${source} → ${dest}`);
      } catch (err) {
        console.log(err);
        process.exit(1);
      }
    },
  };
}
