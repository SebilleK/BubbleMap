import { app } from './app';
import { env } from './env';

app
	.listen({ port: env.API_PORT }, () => {
		console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);
	})
	.onError(({ error }) => {
		console.error('❌ There was an error trying to start the server:', error);
	});
