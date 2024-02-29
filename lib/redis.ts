import { createClient } from 'redis';

const redis = async () => await createClient({}).connect();

export default redis;
