import log from '@purinton/log';
/**
 * Creates and returns a MySQL connection pool, allowing dependency injection for testability.
 *
 * @param {Object} [options]
 * @param {Object} [options.env] - Environment variables (default: process.env)
 * @param {Object} [options.mysqlLib] - mysql2/promise module (default: dynamic import, must have createPool)
 * @param {Object} [options.logger] - Logger instance (default: log)
 * @returns {Promise<import('mysql2/promise').Pool>} MySQL pool instance (see mysql2 docs)
 * @throws {Error} If required environment variables are missing or mysqlLib is invalid
 *
 * Example usage:
 *   const pool = await createDb();
 *   // ... use pool.query(...)
 *   // pool.end() to close
 *
 * Default connection options:
 *   waitForConnections: true (unless MYSQL_WAIT_FOR_CONNECTIONS is 'false', '0', 'no', 'off')
 *   connectionLimit: 10 (from MYSQL_CONNECTION_LIMIT)
 *   queueLimit: 0 (from MYSQL_QUEUE_LIMIT)
 */
export async function createDb({ env = process.env, mysqlLib, logger = log } = {}) {
  const requiredVars = ['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE'];
  const missing = requiredVars.filter((v) => !env[v]);
  if (missing.length) {
    throw new Error(`Database environment variables are not set: ${missing.join(', ')}. Please check your .env file.`);
  }

  // Parse boolean and numeric env vars robustly
  const parseBool = (val, def = true) => {
    if (val === undefined) return def;
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') {
      const falsy = ['false', '0', 'no', 'off'];
      return !falsy.includes(val.trim().toLowerCase());
    }
    return Boolean(val);
  };
  const parseIntEnv = (val, def) => {
    const n = parseInt(val, 10);
    return Number.isNaN(n) ? def : n;
  };

  let db;
  try {
    logger.debug && logger.debug('Loading mysql2/promise module...');
    let mysqlModule = mysqlLib;
    if (!mysqlModule) {
      mysqlModule = (await import('mysql2/promise'));
      logger.debug && logger.debug('mysql2/promise dynamically imported');
    }
    if (typeof mysqlModule.createPool !== 'function') {
      throw new Error('Provided mysqlLib does not have a createPool method.');
    }
    logger.debug && logger.debug('Creating MySQL pool with config', {
      host: env.MYSQL_HOST,
      user: env.MYSQL_USER,
      database: env.MYSQL_DATABASE,
      waitForConnections: parseBool(env.MYSQL_WAIT_FOR_CONNECTIONS, true),
      connectionLimit: parseIntEnv(env.MYSQL_CONNECTION_LIMIT, 10),
      queueLimit: parseIntEnv(env.MYSQL_QUEUE_LIMIT, 0)
    });
    db = mysqlModule.createPool({
      host: env.MYSQL_HOST,
      user: env.MYSQL_USER,
      password: env.MYSQL_PASSWORD,
      database: env.MYSQL_DATABASE,
      waitForConnections: parseBool(env.MYSQL_WAIT_FOR_CONNECTIONS, true),
      connectionLimit: parseIntEnv(env.MYSQL_CONNECTION_LIMIT, 10),
      queueLimit: parseIntEnv(env.MYSQL_QUEUE_LIMIT, 0)
    });
    logger.debug && logger.debug('MySQL pool created');
  } catch (err) {
    logger.error('Failed to create MySQL connection pool', err instanceof Error ? err.message : err);
    if (logger.debug && err instanceof Error && err.stack) {
      logger.debug('Stack trace:', err.stack);
    }
    throw err;
  }
  return db;
}

// To close the pool: await pool.end();
