// @ts-nocheck
/**
 * Standalone script to initialize the Payload database schema.
 * Attempts to bypass the undici Illegal constructor error by clearing CacheStorage global.
 */
(async () => {
    // Attempt workaround for undici error
    if (typeof globalThis.CacheStorage === 'function') {
        const originalCacheStorage = globalThis.CacheStorage;
        try {
            // @ts-ignore
            delete globalThis.CacheStorage;
        } catch (e) {
            // If delete fails, try setting to undefined
            // @ts-ignore
            globalThis.CacheStorage = undefined;
        }
    }

    try {
        const { getPayload } = await import('payload');
        const config = await import('../payload.config');

        console.log('Attempting to initialize Payload and synchronize database...');

        // This should trigger the database initialization/push if configured
        const payload = await getPayload({
            config: config.default || config
        });

        console.log('Payload initialized successfully!');

        // Check if we can see any collections to verify DB state
        const users = await payload.find({
            collection: 'users',
            limit: 1,
        });

        console.log('Database check: users collection is accessible.');
        process.exit(0);
    } catch (error) {
        console.error('Initialization failed:', error);
        process.exit(1);
    }
})();
