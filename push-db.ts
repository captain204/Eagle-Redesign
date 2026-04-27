import { getPayload } from 'payload'
import configPromise from './src/payload.config'

async function run() {
    // @ts-ignore
    delete globalThis.CacheStorage
    try {
        console.log('Initializing Payload...')
        const payload = await getPayload({ config: configPromise })
        console.log('Pushing database schema...')
        if (payload.db.push) {
            await payload.db.push()
            console.log('Database pushed successfully')
        } else {
            console.log('payload.db.push is not available. This might be due to the adapter type.')
        }
        process.exit(0)
    } catch (error) {
        console.error('Failed to push database:', error)
        process.exit(1)
    }
}
run()
