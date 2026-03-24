import { getPayload } from 'payload'
import config from './src/payload.config'

async function checkUsers() {
    try {
        const payload = await getPayload({ config })
        const users = await payload.find({
            collection: 'users',
        })
        console.log('Total users:', users.totalDocs)
        if (users.totalDocs > 0) {
            console.log('First user:', users.docs[0].email)
        }
        process.exit(0)
    } catch (err) {
        console.error('Error checking users:', err)
        process.exit(1)
    }
}

checkUsers()
