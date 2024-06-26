/* import { config } from 'dotenv';
import { z } from 'zod';

if (process.env.NODE_ENV === 'test') {
	config({ path: '.env.test' });
} else {
	config();
}

//! .ENV SCHEMA
const envSchema = z.object({
	DB_NAME: z.string(),
	DB_PASS: z.string(),
	DB_USER: z.string(),
	DB_TYPE: z.string(),
	DB_HOST: z.string(),
	DATABASE_URL: z.string(),
	MYSQL_ALLOW_EMPTY_PASSWORD: z.string().default('yes'),
	NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
	API_PORT: z.coerce.number().default(3000),
	JWT_SECRET: z.string().default('your_secret_key'),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
	console.error('❌ The required environment variables were not provided or were invalid \n ⚠️ Please check the .env file on the root directory and make sure it matches the schema');
	console.error('❌ Invalid environment variables:\n', _env.error.format());

	throw new Error('Invalid environment variables');
}

export const env = _env.data;
 */