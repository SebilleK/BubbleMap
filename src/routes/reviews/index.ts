import { Elysia, t } from 'elysia';
//? import handlers for routes
import { getReviews } from './handlers';

//? Permission helpers
import { confirmLogin } from '../../utils/auth/authVerify';

const reviewsRoutes = new Elysia({ prefix: '/reviews' }).get('/', () => {
	return 'Hello from Reviews. No routes are here currently but maybe in the future there will be =)';
});

const protectedReviewsRoutes = new Elysia({ prefix: '/reviews' }).guard(
	{
		beforeHandle: async ({ set, cookie: { cookieAuth } }) => {
			//! AUTH Logic: check if token is valid and user is logged in
			// console.log(cookieAuth);

			if ((await confirmLogin(set, cookieAuth)) === false) {
				return (set.status = 'Unauthorized');
			}
		},
	},
	app => {
		return app.get('/', () => getReviews());
	},
);

const adminProtectedReviewsRoutes = new Elysia({ prefix: '/reviews' }).get('/admin', () => {
	return 'Hello from Admin Protected Reviews. No routes are here currently but maybe in the future there will be =)';
});

export { reviewsRoutes, protectedReviewsRoutes, adminProtectedReviewsRoutes };
