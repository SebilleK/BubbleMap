import { Elysia, t } from 'elysia';
//? import handlers for routes
import { getUsers, getUserbyId, createUser, loginUser, updateUser, deleteUser } from './handlers';

const usersRoutes = new Elysia({ prefix: '/users' })
	// get all users
	.get('/', () => getUsers())
	// get user by id
	.get('/:id', ({ params: { id } }) => getUserbyId(id), {
		params: t.Object({
			id: t.String(),
		}),
	})
	// register a new user
	.post('/register', ({ body }) => createUser(body), {
		body: t.Object({
			username: t.String(),
			email: t.String(),
			password: t.String(),
		}),
	})
	// login a user
	.post('/login', ({ body }) => loginUser(body), {
		body: t.Object({
			email: t.String(),
			password: t.String(),
		}),
	})
	// update user by id
	.put('/:id', ({ params: { id }, body }) => updateUser(id, body), {
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
	// delete user by id
	.delete('/:id', ({ params: { id } }) => deleteUser(id), {
		params: t.Object({
			id: t.String(),
		}),
	});

export default usersRoutes;
