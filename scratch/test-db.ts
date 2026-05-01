import { getPayload } from 'payload'
import config from './src/payload.config'

async function test() {
  try {
    console.log('Initializing Payload...')
    const payload = await getPayload({ config })
    console.log('Payload initialized.')
    
    console.log('Fetching products...')
    const products = await payload.find({
      collection: 'products',
      limit: 1,
    })
    console.log('Products fetched:', products.totalDocs)
    
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

test()
