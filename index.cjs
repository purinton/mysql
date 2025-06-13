const log = require('@purinton/log');
/**
 * Creates and returns a MySQL connection pool, allowing dependency injection for testability.
 * @param {Object} [options]
 * @param {Object} [options.env] - Environment variables (default: process.env)
 * @param {Object} [options.mysqlLib] - mysql2/promise module (default: require)
 * @param {Object} [options.logger] - Logger instance (default: log)
 * @returns {Object|Promise<Object>} MySQL pool instance
 */
async function createDb({ env = process.env, mysqlLib, logger = log } = {}) {
  if (!env.MYSQL_HOST || !env.MYSQL_USERNAME || !env.MYSQL_PASSWORD || !env.MYSQL_DATABASE) {
    throw new Error('Database environment variables are not set. Please check your .env file.');
  }
  let db;
  try {
    let mysqlModule = mysqlLib;
    if (!mysqlModule) {
      mysqlModule = require('mysql2/promise');
    }
    db = mysqlModule.createPool({
      host: env.MYSQL_HOST,
      user: env.MYSQL_USERNAME,
      password: env.MYSQL_PASSWORD,
      database: env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  } catch (err) {
    logger.error('Failed to create MySQL connection pool', err);
    throw err;
  }
  return db;
}

module.exports.createDb = createDb;
