import { Elysia, t } from 'elysia';
// import { env } from '../../env';
//? import handlers for routes
import { getUsers, getUserbyId, createUser, loginUser, updateUser, deleteUser } from './handlers';

//? Permission helpers
import { confirmLogin, confirmAdmin } from '../../utils/auth/authVerify';

//? all users can access this
const usersRoutes = new Elysia({ prefix: '/users' })
	// get all users
	.get('/', () => getUsers())
	// register a new user
	.post('/register', ({ body, set}) => createUser(body, set), {
		body: t.Object({
			username: t.String(),
			email: t.String(),
			password: t.String(),
		}),
	})
	// login a user
	.post('/login', async ({ body, cookie: { cookieAuth } }) => await loginUser(body, cookieAuth), {
		body: t.Object({
			email: t.String(),
			password: t.String(),
		}),
	});

//? only logged in users can access this
const protectedUsersRoutes = new Elysia({ prefix: '/users' }).guard(
	{
		beforeHandle: async ({ set, cookie: { cookieAuth } }) => {
			//! AUTH Logic: check if token is valid (user logged in)
			// console.log(cookieAuth);

			if ((await confirmLogin(set, cookieAuth)) === false) {
				return (set.status = 'Unauthorized');
			}
		},
	},
	app => {
		return (
			app
				// get user by id
				.get('/:id', ({ params: { id } }) => getUserbyId(id), {
					params: t.Object({
						id: t.String(),
					}),
				})
				// update user by id
				.put('/:id', ({ params: { id }, body, cookie: { cookieAuth }, set }) => updateUser(id, body, cookieAuth, set), {
					params: t.Object({
						id: t.String(),
					}),
					body: t.Object(
						{
							username: t.Optional(
								t.String({
									minLength: 3,
									maxLength: 20,
								}),
							),
							email: t.Optional(
								t.String({
									minLength: 5,
									maxLength: 256,
									format: 'email',
								}),
							),
							password: t.Optional(
								t.String({
									minLength: 8,
									maxLength: 256,
								}),
							),
						},
						{
							minProperties: 1,
						},
					),
				})
		);
	},
);

//? only admins can access this
const adminProtectedUsersRoutes = new Elysia({ prefix: '/users' }).guard(
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
		return (
			app
				// delete user by id
				.delete('/:id', ({ params: { id }, cookie: { cookieAuth } ,set}) => deleteUser(id, cookieAuth, set), {
					params: t.Object({
						id: t.String(),
					}),
				})
		);
	},
);

export { usersRoutes, protectedUsersRoutes, adminProtectedUsersRoutes };
