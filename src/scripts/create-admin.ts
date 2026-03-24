import { getPayload } from 'payload'
import configPromise from '../payload.config'

async function createAdmin() {
    // Workaround for undici Illegal constructor error in some environments
    if (typeof globalThis.CacheStorage === 'function') {
        try {
            // @ts-ignore
            delete globalThis.CacheStorage;
        } catch (e) {
            // @ts-ignore
            globalThis.CacheStorage = undefined;
        }
    }

    try {
        console.log('Initializing Payload...')
        const payload = await getPayload({ config: configPromise })

        console.log('Checking for existing users...')
        const users = await payload.find({
            collection: 'users',
            limit: 1,
        })

        if (users.totalDocs > 0) {
            console.log('Users already exist. No need for first-register script.')
            return
        }

        console.log('Creating first admin user...')
        const user = await payload.create({
            collection: 'users',
            data: {
                email: 'admin@1steagle.com',
                password: 'Password123!',
                name: 'Admin',
                role: 'super-admin',
            },
        })

        console.log('Admin user created successfully:', user.email)
        process.exit(0)
    } catch (error) {
        console.error('Failed to create admin:', error)
        process.exit(1)
    }
}

createAdmin()
