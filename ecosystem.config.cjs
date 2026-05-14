module.exports = {
  apps: [
    {
      name: 'furusato-web',
      script: 'server/index.js',
      env: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: 4000,
      },
      max_memory_restart: '300M',
      watch: false,
    },
  ],
};
