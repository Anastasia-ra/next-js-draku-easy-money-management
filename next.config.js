/** @type {import('next').NextConfig} */
// const withPWA = require('next-pwa');
// const runtimeCaching = require('next-pwa/cache');

const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;

// module.exports = withPWA({
//   reactStrictMode: true,
//   pwa: {
//     dest: 'public',
//     register: true,
//     skipWaiting: true,
//     runtimeCaching,
//     buildExcludes: [/middleware-manifest.json$/],
//   },
// });

const withPWA = require('next-pwa');
const runtimeCaching = require('./cache.js');

module.exports = withPWA({
  pwa: {
    dest: 'public',
    runtimeCaching,
    disable: process.env.NODE_ENV === 'development',
    cacheOnFrontEndNav: true,
    register: true,
    skipWaiting: true,
  },
});
