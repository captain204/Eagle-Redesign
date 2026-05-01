
import { getPayload } from 'payload';
import config from './src/payload.config';

async function test() {
    try {
        console.log('Connecting to Payload...');
        const payload = await getPayload({ config });
        console.log('Connected!');
        const users = await payload.find({ collection: 'users' });
        console.log('Users found:', users.totalDocs);
        process.exit(0);
    } catch (error) {
        console.error('Connection failed:', error);
        process.exit(1);
    }
}

test();
