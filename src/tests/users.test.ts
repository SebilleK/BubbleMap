import { describe, it, expect } from 'bun:test';
import app from '../app';

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
		it('POST /api/users/register is working, registers a new user and returns a user object with correct properties', async () => {
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
			expect(response.status).toBe(200);
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
	});

	//! LOGIN PROTECTED ENDPOINTS

	//! ADMIN PROTECTED ENDPOINTS
});
