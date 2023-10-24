import { DataSource, DataSourceOptions } from 'typeorm';
import { readFileSync } from 'fs';

const dbHostname = process.env.DB_HOSTNAME;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbPort = process.env.DB_PORT;
const synchronizeEnabled = process.env.DB_SYNCHRONIZE === 'true';
const loggingEnabled = process.env.DATABASE_LOGGING === 'true';
const enableSSL = process.env.DB_ENABLE_SSL === 'true';

export const dataSourceOptions: DataSourceOptions = {
  host: dbHostname,
  type: 'mysql',
  port: parseInt(dbPort),
  username: dbUsername,
  password: dbPassword,
  database: dbName,
  synchronize: synchronizeEnabled,
  logging: loggingEnabled,
  entities: ['dist/**/*.entity.js'], // https://stackoverflow.com/a/59607836/5718964
  migrations: ['dist/db/migrations/*.js'],
  ssl: enableSSL ? { ca: readFileSync('./aws-global-bundle.cer') } : undefined,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
