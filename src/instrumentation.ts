export async function register() {
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
