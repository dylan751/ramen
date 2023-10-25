// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getConfig = () => ({
  node_env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT) || 4000,
  role: process.env.ROLE || 'all',
  request_timeout_ms:
    parseInt(process.env.REQUEST_TIMEOUT_SEC) * 1000 || 10 * 1000, // use 10 sec as default
  database: {
    host: process.env.DB_HOSTNAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 3306,
  },
  google: {
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
  },
  frontend_url: process.env.FRONTEND_URL,
  jwt_secret: process.env.JWT_SECRET,
  scim_jwt_secret: process.env.SCIM_JWT_SECRET,
  admin_jwt_secret: process.env.ADMIN_JWT_SECRET,
  public_api_jwt_secret: process.env.PUBLIC_API_JWT_SECRET,
  extension_jwt_secret: process.env.EXTENSION_JWT_SECRET,
});

export default getConfig;

export type AppConfigObject = ReturnType<typeof getConfig>;
