import { getPayload } from 'payload'
import configPromise from './src/payload.config'

async function run() {
    const payload = await getPayload({ config: configPromise })
    try {
        const order = await payload.create({
            collection: 'orders',
            data: {
                email: "test@test.com",
                items: [{ product: 1, quantity: 1, price: 100 }],
                total: 100,
                status: "pending",
                paymentStatus: "unpaid",
                shippingAddress: {
                    name: "Test",
                    street: "Test",
                    lga: "Test",
                    state: "Lagos",
                    country: "Nigeria",
                    zip: "5300001"
                }
            }
        })
        console.log("Success:", order)
    } catch (e) {
        console.error("Payload Create Error:", e)
    }
    process.exit(0)
}
run()
