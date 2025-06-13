// Minimal CommonJS test stub
const { createDb } = require('./index.cjs');
const { test, expect, describe } = require('@jest/globals');

describe('createDb (CJS)', () => {
    test('creates pool with valid env', async () => {
        const fakePool = { end: jest.fn() };
        const fakeMysqlLib = { createPool: jest.fn(() => fakePool) };
        const env = {
            MYSQL_HOST: 'localhost',
            MYSQL_USERNAME: 'root',
            MYSQL_PASSWORD: 'password',
            MYSQL_DATABASE: 'test',
        };
        const db = await createDb({ env, mysqlLib: fakeMysqlLib, logger: { error: jest.fn() } });
        expect(fakeMysqlLib.createPool).toHaveBeenCalledWith(expect.objectContaining({ host: 'localhost' }));
        expect(db).toBe(fakePool);
    });

    test('throws if env is missing', async () => {
        await expect(createDb({ env: {} })).rejects.toThrow('Database environment variables are not set');
    });

    test('logs and throws on pool creation error', async () => {
        const fakeMysqlLib = { createPool: jest.fn(() => { throw new Error('fail'); }) };
        const env = {
            MYSQL_HOST: 'localhost',
            MYSQL_USERNAME: 'root',
            MYSQL_PASSWORD: 'password',
            MYSQL_DATABASE: 'test',
        };
        const logger = { error: jest.fn() };
        await expect(createDb({ env, mysqlLib: fakeMysqlLib, logger })).rejects.toThrow('fail');
        expect(logger.error).toHaveBeenCalledWith('Failed to create MySQL connection pool', expect.any(Error));
    });
});
