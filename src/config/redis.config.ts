export default () => ({
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    uri: `redis://:@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
  },
});
