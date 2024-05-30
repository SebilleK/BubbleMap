import Elysia from 'elysia';
import { env } from './env';

//! import routes
import usersRoutes from './routes/users';

//? swagger plugin for documentation
import swagger from '@elysiajs/swagger';

const app = new Elysia();

app
	.use(
		swagger({
			documentation: {
				info: {
					title: 'BubbleMap API',
					version: '1.0.0',
					description: 'This is the API for the BubbleMap project.',
				},
			},
		}),
)
	.group('/api', app => app.use(usersRoutes))
	.listen({ port: env.API_PORT }, () => {
		console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}/swagger`);
	})
	.onError(({ error }) => {
		console.error('❌ There was an error trying to start the server:', error);
	});
