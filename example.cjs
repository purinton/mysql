// Example usage for CommonJS
const log = require('@purinton/log');
const { createDb } = require('@purinton/mysql');

(async () => {
    try {
        const db = await createDb({ log });
        log.info('MySQL pool created:', { db: !!db });
        await db.end();
    } catch (err) {
        log.error('Error:', err);
    }
})();
