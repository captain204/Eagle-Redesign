import { getPayload } from 'payload'
import config from './src/payload.config'

async function test() {
  try {
    const payload = await getPayload({ config })
    const categoriesResult = await payload.find({
      collection: 'categories',
      sort: '-createdAt',
      depth: 1,
      limit: 100,
    })
    console.log('Categories found:', categoriesResult.docs.length)
    process.exit(0)
  } catch (error) {
    console.error('Error fetching categories:', error)
    process.exit(1)
  }
}

test()
