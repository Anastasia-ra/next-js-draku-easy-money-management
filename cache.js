module.exports = [
  {
    urlPattern: 'https://draku-easy-money-management.herokuapp.com/',
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'users',
      expiration: {
        maxAgeSeconds: 30, // 30 seconds
      },
    },
  },
];
