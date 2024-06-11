import { describe, it, expect } from 'bun:test';
import app from '../app';
import prisma from '../../prisma/prisma';

// https://bun.sh/docs/cli/test

describe('Users Endpoints', () => {
	//! PUBLIC ENDPOINTS
	describe('Public Endpoints', () => {
		//? get all users
		it('GET /api/users is working, returns a users array with correct properties', async () => {
			const response = await app.handle(new Request(`http://${app.server?.hostname}:${app.server?.port}/api/users`));

			// returns 200 OK, right headers
			expect(response.headers.get('Content-Type')).toBe('application/json;charset=utf-8');
			expect(response.status).toBe(200);
			expect(response.body).toBeTypeOf('object');

			const responseJSON = await response.json();
			// console.log(responseJSON);

			// returns a list of users with correct properties as per schema
			responseJSON.forEach((user: any) => {
				expect(user).toHaveProperty('id');
				expect(user).toHaveProperty('username');
				expect(user).toHaveProperty('email');
				expect(user).toHaveProperty('password');
				expect(user).toHaveProperty('favoriteStores');
				expect(user).toHaveProperty('admin');
			});
		});

		//? register a new user
		it('POST /api/users/register is working, returns 201 and user object with correct properties', async () => {
			const newUser = {
				username: 'EdelvHresvelg',
				email: 'edie@be.com',
				password: 'bl4ck34gl3s',
			};

			const response = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/users/register`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newUser),
				}),
			);

			// returns 200 OK
			expect(response.status).toBe(201);
			expect(response.body).toBeTypeOf('object');

			const responseJSON = await response.json();
			// console.log(responseJSON);

			// returns THE CREATED user object with correct properties as per schema
			expect(responseJSON).toHaveProperty('id');
			expect(responseJSON).toHaveProperty('username', newUser.username);
			expect(responseJSON).toHaveProperty('email', newUser.email);

			//! remove the created user you have to be an admin to delete the user
		});

		//? registering a new user with an existing username or email is forbidden
		it('Users cant register with an existing username or email', async () => {
			const newUserExisting = {
				username: 'user2',
				email: 'user2@test.com',
				password: 'unsafe_user_password2',
			};

			const response = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/users/register`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newUserExisting),
				}),
			);

			// const responseJSON = await response.json();

			// console.log(responseJSON);

			// returns 500 Internal Server Error, user already exists
			expect(response.status).toBe(500);
		});

		//? registering a new user with an invalid email
		it('Users cant register with an invalid email', async () => {
			const newUserInvalidEmail = {
				username: 'Dimitri',
				email: 'notanemail',
				password: 'Blu3B3rr1',
			};

			const response = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/users/register`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newUserInvalidEmail),
				}),
			);

			expect(response.status).toBe(422);
		});

		//? registering a new user with a less than 8 characters password
		it('Users cant register with a less than 8 characters password', async () => {
			const newUserInvalidPassword = {
				username: 'Dimitri',
				email: 'dimitri@test.com',
				password: 'Blu3',
			};

			const response = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/users/register`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newUserInvalidPassword),
				}),
			);

			expect(response.status).toBe(422);
		});
	});

	//! LOGIN PROTECTED ENDPOINTS
	describe('Login Protected Endpoints', () => {
		//? Login protection
		it('Routes are protected by login, returns 401 if not logged in', async () => {
			const response = await app.handle(new Request(`http://${app.server?.hostname}:${app.server?.port}/api/users/1`));

			expect(response.status).toBe(401);
		});
		//? get user by id
		it('GET /api/users/:id is working, returns 200 and a single user', async () => {
			// login first
			const responseLogin = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/users/login`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email: 'user1@test.com', password: 'unsafe_user_password1' }),
				}),
			);
			expect(responseLogin.status).toBe(200);

			// use the cookie
			const setCookieHeader = responseLogin.headers.get('set-cookie');
			expect(setCookieHeader).not.toBeNull();
			// console.log(setCookieHeader);

			const response = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/users/1`, {
					method: 'GET',
					headers: {
						Cookie: setCookieHeader!,
						'Content-Type': 'application/json',
					},
				}),
			);

			expect(response.status).toBe(200);

			expect(response.body).toBeTypeOf('object');

			const responseJSON = await response.json();

			expect(responseJSON).toHaveProperty('id');
			expect(responseJSON).toHaveProperty('username');
			expect(responseJSON).toHaveProperty('email');
			expect(responseJSON).toHaveProperty('password');
			expect(responseJSON).toHaveProperty('favoriteStores');
			expect(responseJSON).toHaveProperty('admin');
		});

		//? update user by id
		it('PUT /api/users/:id is working, returns 200 and updates a single user', async () => {
			//?  (only the logged in user can update themselves)
			// login first
			const responseLogin = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/users/login`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email: 'user1@test.com', password: 'unsafe_user_password1' }),
				}),
			);
			expect(responseLogin.status).toBe(200);

			// use the cookie
			const setCookieHeader = responseLogin.headers.get('set-cookie');
			expect(setCookieHeader).not.toBeNull();

			const response = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/users/2`, {
					method: 'PUT',
					headers: {
						Cookie: setCookieHeader!,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ email: 'user1@test.com' }),
				}),
			);

			expect(response.status).toBe(200);

			expect(response.body).toBeTypeOf('object');

			const responseJSON = await response.json();
			// console.log(responseJSON);

			expect(responseJSON).toHaveProperty('id');
			expect(responseJSON).toHaveProperty('username');
			expect(responseJSON).toHaveProperty('email');
			expect(responseJSON).toHaveProperty('password');
			expect(responseJSON).toHaveProperty('favoriteStores');
			expect(responseJSON).toHaveProperty('admin');
		});
	});

	//! ADMIN PROTECTED ENDPOINTS
	describe('Admin Protected Endpoints', () => {
		//? Admin protection
		it('Routes are protected by admin, returns 401 if not admin', async () => {
			const responseLogin = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/users/login`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email: 'user1@test.com', password: 'unsafe_user_password1' }),
				}),
			);

			expect(responseLogin.status).toBe(200);

			// use the cookie
			const setCookieHeader = responseLogin.headers.get('set-cookie');
			expect(setCookieHeader).not.toBeNull();

			// get id of user created to delete
			const userToDelete = await prisma.user.findUnique({ where: { email: 'edie@be.com' } });

			const response = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/users/${userToDelete?.id}`, {
					method: 'DELETE',
					headers: {
						Cookie: setCookieHeader!,
						'Content-Type': 'application/json',
					},
				}),
			);
			// user can't delete other users
			expect(response.status).toBe(401);
		});
		//? delete user by id
		it('DELETE /api/users/:id is working, returns 204 and deletes a single user', async () => {
			// login first
			const responseLogin = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/users/login`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email: 'admin@test.com', password: 'unsafe_password_admin' }),
				}),
			);

			expect(responseLogin.status).toBe(200);

			// use the cookie
			const setCookieHeader = responseLogin.headers.get('set-cookie');
			expect(setCookieHeader).not.toBeNull();

			// get id of user created to delete
			const userToDelete = await prisma.user.findUnique({ where: { email: 'edie@be.com' } });

			const response = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/users/${userToDelete?.id}`, {
					method: 'DELETE',
					headers: {
						Cookie: setCookieHeader!,
						'Content-Type': 'application/json',
					},
				}),
			);
			expect(response.status).toBe(204);
		});
	});
});
