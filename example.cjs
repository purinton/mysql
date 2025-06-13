// Example usage for CommonJS
const log = require('@purinton/log');
const { createDb } = require('@purinton/mysql');

(async () => {
    try {
        const db = await createDb({ logger: log });
        log.info('MySQL pool created:', !!db);
        await db.end();
    } catch (err) {
        log.error('Error:', err);
    }
})();
