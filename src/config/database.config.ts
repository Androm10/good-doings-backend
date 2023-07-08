const e = process.env;

export default () => ({
  database: {
    dialect: e.DB_DIAL || 'postgres',
    host: e.DB_HOST || 'postgres',
    port: +e.DB_PORT || 3306,
    username: e.DB_USER || 'root',
    password: e.DB_PASS || '1111',
    database: e.DB_NAME || 'good-doings',
    uri: `${e.DB_DIAL}://${e.DB_USER}:${e.DB_PASS}@${e.DB_HOST}:${e.DB_PORT}/${e.DB_NAME}`,
  },
});
