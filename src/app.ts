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
//! NOTES
/* FOR CUSTOM ERRORS & customization: SEE ELYSIA ERROR CODES
	!!Needed handler for custom errors
	.error({
	
		BadRequestError,
		SuperCoolError, 
		
	}) 
	 !!These are the error codes that elysia provides.
		.onError(({ error, code, set }) => {
		switch (code) {
			case 'NOT_FOUND':
				set.status = 404;
				return 'The requested resource was not found.' + error.message;
			case 'INTERNAL_SERVER_ERROR':
				set.status = 500;
				return 'An internal server error occurred. Please try again later?' + error.message;
			case 'VALIDATION':
				set.status = 400;
				return 'The request body is invalid. Please verify all fields and try again.' + error.message;
			case 'PARSE':
				set.status = 400;
				return 'The request body is invalid. Please verify all fields and try again.' + error.message;
			case 'UNKNOWN':
				set.status = 500;
				return 'An unknown error occurred. Please try again later?' + error.message;
			default:
				set.status = 500;
				return 'An unknown error occurred. Please try again later?' + error.message;
		}
	}) */
