import config from '../src/payload.config'
import { getPayload } from 'payload'

async function run() {
    const payload = await getPayload({ config })
    
    // Register
    const email = `test-${Date.now()}@example.com`
    const password = 'Password123!'
    
    console.log('Registering user:', email)
    const user = await payload.create({
        collection: 'users',
        data: {
            email,
            password,
            name: 'Test User',
            role: 'viewer'
        }
    })
    
    console.log('User created:', user.id)
    
    // Login
    try {
        const loginRes = await payload.login({
            collection: 'users',
            data: {
                email,
                password
            }
        })
        console.log('Login successful:', loginRes.user?.email)
    } catch (e) {
        console.error('Login failed:', e)
    }
}

run()
