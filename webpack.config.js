import path from 'path';
import { fileURLToPath } from 'url';
import CopyPlugin from 'copy-webpack-plugin';
import WebExtPlugin from 'web-ext-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default (env, argv) => ({
  mode: argv.mode || 'development',
  devtool: argv.mode === 'production' ? false : 'inline-source-map',
  entry: {
    'scripts/background': './app/scripts/background.js',
    'scripts/content': './app/scripts/content.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'app/manifest.json', to: 'manifest.json' },
      ],
    }),
    new WebExtPlugin({
      sourceDir: path.resolve(__dirname, 'dist'),
      target: 'chromium',
      buildPackage: argv.mode === 'production',
    }),
  ],
});
