import { Elysia, t } from 'elysia';
//? import handlers for routes
import { getReviews, getReviewsbyId, getAllReviewsbyUserId, createReview, deleteReview, updateReview } from './handlers';

//? Permission helpers
import { confirmLogin } from '../../utils/auth/authVerify';

const reviewsRoutes = new Elysia({ prefix: '/reviews' })
	.get('/', () => getReviews())
	.get('/:id', ({ params: { id } }) => getReviewsbyId(id), {
		params: t.Object({
			id: t.String(),
		}),
	})
	.get('/all/:id', ({ params: { id } }) => getAllReviewsbyUserId(id), {
		params: t.Object({
			id: t.String(),
		}),
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
		return app
			.post('/create/:id/:storeId', ({ params: { id, storeId }, body, set, cookie: { cookieAuth } }) => createReview(id, storeId, body, set, cookieAuth), {
				body: t.Object({
					rating: t.Number(),
					reviewText: t.String(),
				}),
			})
			.delete('/delete/:id', ({ params: { id }, cookie: { cookieAuth }, set }) => deleteReview(id, cookieAuth, set), {
				params: t.Object({
					id: t.String(),
				}),
			})
			.put('/update/:id', ({ params: { id, rating, reviewText }, cookie: { cookieAuth }, set }) => updateReview(id, cookieAuth, set, rating, reviewText), {
				params: t.Object({
					id: t.String(),
					rating: t.Optional(t.Number()),
					reviewText: t.Optional(t.String()),
				}),
			});
	},
);

const adminProtectedReviewsRoutes = new Elysia({ prefix: '/reviews' }).get('/admin', () => {
	return 'Hello from Admin Protected Reviews. No routes are here currently but maybe in the future there will be =)';
});

export { reviewsRoutes, protectedReviewsRoutes, adminProtectedReviewsRoutes };
