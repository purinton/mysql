// Example usage for ES Modules
import { createDb } from '@purinton/mysql';

(async () => {
    try {
        const db = await createDb();
        console.log('MySQL pool created:', !!db);
        await db.end();
    } catch (err) {
        console.error('Error:', err);
    }
})();
