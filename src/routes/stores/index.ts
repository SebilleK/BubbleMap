import { Elysia, t } from 'elysia';
//? import handlers for routes
import { getStores, createStore, deleteStore, updateStore } from './handlers';

//? Permission helpers
import { confirmLogin, confirmAdmin } from '../../utils/auth/authVerify';

const storesRoutes = new Elysia({ prefix: '/stores' }).get('/', () => getStores());

const protectedStoresRoutes = new Elysia({ prefix: '/stores' }).get('/protected', () => {
	return 'Hello from Protected Stores. No routes are here currently but maybe in the future there will be =)';
});

const adminProtectedStoresRoutes = new Elysia({ prefix: '/stores' }).guard(
	{
		beforeHandle: async ({ set, cookie: { cookieAuth } }) => {
			//! AUTH Logic: check if token is valid and user is admin
			// console.log(cookieAuth);
			if ((await confirmAdmin(set, cookieAuth)) === false) {
				return (set.status = 'Unauthorized');
			}
		},
	},
	app => {
		return app
			.post('/create', ({ body }) => createStore(body), {
				body: t.Object({
					name: t.String(),
					description: t.Optional(t.String()),
					address: t.Optional(t.String()),
					latitude: t.Number(),
					longitude: t.Number(),
				}),
			})
			.delete('/:id', ({ params: { id } }) => deleteStore(id), {
				params: t.Object({
					id: t.String(),
				}),
			})
			.put('/:id', ({ params: { id }, body }) => updateStore(id, body), {
				params: t.Object({
					id: t.String(),
				}),
				body: t.Object({
					name: t.Optional(t.String()),
					description: t.Optional(t.String()),
					address: t.Optional(t.String()),
					latitude: t.Optional(t.Number()),
					longitude: t.Optional(t.Number()),
					photo: t.Optional(t.String()),
				}),
			});
	},
);

export { storesRoutes, protectedStoresRoutes, adminProtectedStoresRoutes };
