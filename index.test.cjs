// Minimal CommonJS test stub
const { createDb } = require('@purinton/mysql');
const { test, expect, describe } = require('@jest/globals');

describe('createDb (CJS)', () => {
    test('creates pool with valid env', async () => {
        const fakePool = { end: jest.fn() };
        const fakeMysqlLib = { createPool: jest.fn(() => fakePool) };
        const env = {
            MYSQL_HOST: 'localhost',
            MYSQL_USER: 'root',
            MYSQL_PASSWORD: 'password',
            MYSQL_DATABASE: 'test',
        };
        const log = { error: jest.fn(), debug: jest.fn() };
        const db = await createDb({ env, mysqlLib: fakeMysqlLib, log });
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
            MYSQL_USER: 'root',
            MYSQL_PASSWORD: 'password',
            MYSQL_DATABASE: 'test',
        };
        const log = { error: jest.fn(), debug: jest.fn() };
        await expect(createDb({ env, mysqlLib: fakeMysqlLib, log })).rejects.toThrow('fail');
        expect(log.error).toHaveBeenCalledWith('Failed to create MySQL connection pool', 'fail');
    });
});
