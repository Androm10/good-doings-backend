export default () => ({
  auth: {
    secret: process.env.AUTH_SECRET || 'secret',
    expiresIn: process.env.AUTH_EXPIRES || 1000 * 60 * 60,
    refreshSecret: process.env.AUTH_REFRESH_SECRET || 'secret2',
    refreshExpiresIn: +process.env.AUTH_REFRESH_EXPIRES || 1000 * 60 * 60 * 24,
  },
});
