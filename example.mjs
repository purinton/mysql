// Example usage for ES Modules
import log from '@purinton/log';
import { createDb } from '@purinton/mysql';

(async () => {
    try {
        const db = await createDb({ log });
        log.info('MySQL pool created:', { db: !!db });
        await db.end();
    } catch (err) {
        log.error('Error:', err);
    }
})();
