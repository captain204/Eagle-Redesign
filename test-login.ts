import { getPayload } from 'payload'
import configPromise from './src/payload.config'

async function testLogin() {
    try {
        console.log('Initializing Payload...')
        const payload = await getPayload({ config: configPromise })

        console.log('Attempting login for info@tjanehealth.com...')
        // Note: We don't know the password, but even with a wrong password 
        // it should return a 401, NOT a 500 (crash).
        try {
            const result = await payload.login({
                collection: 'users',
                data: {
                    email: 'info@tjanehealth.com',
                    password: 'wrong-password',
                },
            })
            console.log('Login result:', result)
        } catch (err: any) {
            console.error('Login Error (caught):', err)
            if (err.data) console.error('Error data:', JSON.stringify(err.data, null, 2))
        }
    } catch (initErr) {
        console.error('Initialization Error:', initErr)
    }
}

testLogin()
