import { getPayload } from 'payload'
import configPromise from './src/payload.config'

async function run() {
    try {
        console.log('Initializing payload...')
        const payload = await getPayload({ config: configPromise })
        console.log('Payload initialized. Creating first user...')

        await payload.create({
            collection: 'users',
            data: { email: 'test_local@example.com', password: 'password' }
        })
        console.log('User created successfully')
    } catch (e: any) {
        console.error('ERROR OCCURRED:')
        console.error(e.stack)
    }
}

run().catch(console.error)
