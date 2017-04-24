const assets = require('./src/assets.json');

const swVersion = assets.metadata.version;
const CACHE_NAME = `cache-step-7-${swVersion}`;

module.exports = {
  cacheId: CACHE_NAME,
  staticFileGlobs: ['dist/**/*.{js,html,css,png,jpg,gif}'],
  stripPrefix: 'dist',
  skipWaiting: true,
  clientsClaim: false,
}