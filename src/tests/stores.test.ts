import { describe, it, expect } from 'bun:test';
import app from '../app';
import prisma from '../../prisma/prisma';

describe('Stores Endpoints', () => {
	//! PUBLIC ENDPOINTS
	describe('Public Endpoints', () => {
		//? get all stores
		it('GET /api/stores is working, returns a stores array with correct properties', async () => {
			const response = await app.handle(new Request(`http://${app.server?.hostname}:${app.server?.port}/api/stores`));

			expect(response.status).toBe(200);

			const responseJSON = await response.json();
			// console.log(responseJSON);

			// returns a list of stores with correct properties as per schema
			responseJSON.forEach((store: any) => {
				expect(store).toHaveProperty('id');
				expect(store).toHaveProperty('name');
				expect(store).toHaveProperty('description');
				expect(store).toHaveProperty('address');
				expect(store).toHaveProperty('latitude');
				expect(store).toHaveProperty('longitude');
				expect(store).toHaveProperty('photo');
			});
		});

		//? get store by id
		it('GET /api/stores/:id is working, returns a single store', async () => {
			const response = await app.handle(new Request(`http://${app.server?.hostname}:${app.server?.port}/api/stores/1`));

			expect(response.status).toBe(200);

			const responseJSON = await response.json();
			// console.log(responseJSON);

			// returns a single store with correct properties as per schema
			expect(responseJSON).toHaveProperty('id');
			expect(responseJSON).toHaveProperty('name');
			expect(responseJSON).toHaveProperty('description');
			expect(responseJSON).toHaveProperty('address');
			expect(responseJSON).toHaveProperty('latitude');
			expect(responseJSON).toHaveProperty('longitude');
			expect(responseJSON).toHaveProperty('photo');
		});
	});

	//! LOGIN PROTECTED ENDPOINTS
	/* describe('Login Protected Endpoints', () => {
		//? Login protection
	}); */

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

			const response = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/stores/create`, {
					method: 'POST',
					headers: {
						Cookie: setCookieHeader!,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: 'Mega Bubble Empire',
						description: 'idk this is a new fake store !',
						address: 'Av. No.5, Piltover City',
						latitude: 0,
						longitude: 0,
					}),
				}),
			);

			expect(response.status).toBe(401);
		});

		//? Create store
		it('POST /api/stores/create is working, returns 201', async () => {
			const responseLogin = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/users/login`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email: 'admin@test.com', password: 'unsafe_password_admin' }),
				}),
			);
			expect(responseLogin.status).toBe(200);

			const newStoreToCreate = {
				name: 'Mega Bubble Empire',
				description: 'idk this is a new fake store !',
				address: 'Av. No.5, Piltover City',
				latitude: 0.34,
				longitude: 0.2,
			};

			// use the cookie
			const setCookieHeader = responseLogin.headers.get('set-cookie');
			expect(setCookieHeader).not.toBeNull();

			const response = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/stores/create`, {
					method: 'POST',
					headers: {
						Cookie: setCookieHeader!,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(newStoreToCreate),
				}),
			);

			expect(response.status).toBe(201);
		});

		//? Update store
		it('PUT /api/stores/:id is working, returns 200', async () => {
			const responseLogin = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/users/login`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email: 'admin@test.com', password: 'unsafe_password_admin' }),
				}),
			);
			expect(responseLogin.status).toBe(200);

			const setCookieHeader = responseLogin.headers.get('set-cookie');
			expect(setCookieHeader).not.toBeNull();

			const response = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/stores/1`, {
					method: 'PUT',
					headers: {
						Cookie: setCookieHeader!,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name: 'Bubble Time',
					}),
				}),
			);
			expect(response.status).toBe(200);
		});

		//? Delete store
		it('DELETE /api/stores/:id is working, returns 204', async () => {
			const responseLogin = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/users/login`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email: 'admin@test.com', password: 'unsafe_password_admin' }),
				}),
			);
			expect(responseLogin.status).toBe(200);

			const setCookieHeader = responseLogin.headers.get('set-cookie');
			expect(setCookieHeader).not.toBeNull();

			const storeToDelete = await prisma.store.findUnique({ where: { name: 'Mega Bubble Empire' } });

			const response = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/stores/${storeToDelete?.id}`, {
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
