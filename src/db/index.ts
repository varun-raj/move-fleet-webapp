import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { ENV } from '@/config/env';
// You can specify any property from the node-postgres connection options
export const db = drizzle({
  connection: {
    connectionString: ENV.DATABASE_URL,
    ssl: false
  },
  schema: schema
});