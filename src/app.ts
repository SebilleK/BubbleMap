import Elysia from 'elysia';
import { env } from './env';

//! import routes
import { usersRoutes, protectedUsersRoutes, adminProtectedUsersRoutes } from './routes/users';
import { storesRoutes, protectedStoresRoutes, adminProtectedStoresRoutes } from './routes/stores';
import { reviewsRoutes, protectedReviewsRoutes, adminProtectedReviewsRoutes } from './routes/reviews';

//? swagger plugin for documentation
import swagger from '@elysiajs/swagger';

//? cookies elysia
import cookie from '@elysiajs/cookie';

//? cors elysia
import cors from '@elysiajs/cors';

//? logxlisia (plugin)
import logixlysia from 'logixlysia';

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
	.use(
		logixlysia({
			config: {
				ip: true,
				customLogFormat: '🦊 Logger: {now} {duration} {method} {pathname} {status} ',
			},
		}),
	)
	.use(
		cors({
			credentials: true,
			origin: true,
			allowedHeaders: ['Content-Type', 'Authorization'],
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		}),
	)
	.use(cookie({ secure: false, httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 }))
	.group('/api', app =>
		app
			.use(usersRoutes)
			.use(protectedUsersRoutes)
			.use(adminProtectedUsersRoutes)
			.use(storesRoutes)
			.use(protectedStoresRoutes)
			.use(adminProtectedStoresRoutes)
			.use(reviewsRoutes)
			.use(protectedReviewsRoutes)
			.use(adminProtectedReviewsRoutes),
	)
	.listen({ port: env.API_PORT }, () => {
		console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}/swagger`);
	});

export default app;
