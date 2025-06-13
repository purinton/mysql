// Example usage for CommonJS
const { createDb } = require('./index.cjs');

(async () => {
    try {
        const db = await createDb();
        console.log('MySQL pool created:', !!db);
        await db.end();
    } catch (err) {
        console.error('Error:', err);
    }
})();
