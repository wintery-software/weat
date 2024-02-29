import { createClient } from 'redis';

export const redis = async () => await createClient({}).connect();
