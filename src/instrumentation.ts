export async function register() {
    // Workaround for undici Illegal constructor error in Node v20+ environments
    if (typeof globalThis.CacheStorage === 'function') {
        try {
            // @ts-ignore
            delete globalThis.CacheStorage;
        } catch (e) {
            // @ts-ignore
            globalThis.CacheStorage = undefined;
        }
    }

    if (process.env.NEXT_RUNTIME === 'nodejs') {
        if (process.env.DISABLE_DB_PUSH === '1') {
            console.log('Skipping Payload DB initialization during build phase...');
            return;
        }

        try {
            console.log('Ensuring Payload DB schema is synchronized on boot...');
            const { getPayload } = await import('payload');
            const configPromise = (await import('./payload.config')).default;
            await getPayload({ config: configPromise });
            console.log('Payload DB schema initialized.');
        } catch (error) {
            console.error('Error initializing Payload DB during instrumentation:', error);
        }
    }
}
