import { describe, it, expect } from 'bun:test';
import app from '../app';
import prisma from '../../prisma/prisma';

// https://bun.sh/docs/cli/test

describe('Reviews Endpoints', () => {
	//! PUBLIC ENDPOINTS
	describe('Public Endpoints', () => {
		//? get all reviews
		it('GET /api/reviews is working, returns a reviews array with correct properties', async () => {
			const response = await app.handle(new Request(`http://${app.server?.hostname}:${app.server?.port}/api/reviews`));

			expect(response.status).toBe(200);

			const responseJSON = await response.json();
			// console.log(responseJSON);

			responseJSON.forEach((store: any) => {
				expect(store).toHaveProperty('id');
				expect(store).toHaveProperty('userId');
				expect(store).toHaveProperty('storeId');
				expect(store).toHaveProperty('rating');
				expect(store).toHaveProperty('reviewText');
			});
		});

		//? get review by id
		it('GET /api/reviews/:id is working, returns 200 and a single review', async () => {
			const response = await app.handle(new Request(`http://${app.server?.hostname}:${app.server?.port}/api/reviews/1`));

			expect(response.status).toBe(200);
		});
	});

	//! LOGIN PROTECTED ENDPOINTS
	describe('Login Protected Endpoints', () => {
		//? Login protection
		it('Routes are protected by login, returns 401 if not logged in', async () => {
			const response = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/reviews/delete/1`, {
					method: 'DELETE',
					headers: {
						Cookie: '', // reseting cookie so that no auth is provided
						'Content-Type': 'application/json',
					},
				}),
			);

			expect(response.status).toBe(401);
		});

		//? Create review
		it('POST /create/:id/:storeId is working, returns 201 and new review', async () => {
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

			const newReview = {
				rating: 3,
				reviewText: 'good aesthetic and vibes but kinda painfully mid on everything else idk what else to say',
			};

			const response = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/reviews/create/2/1`, {
					method: 'POST',
					headers: {
						Cookie: setCookieHeader!,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(newReview),
				}),
			);

			expect(response.status).toBe(201);
			// console.log(response);

			const responseJSON = await response.json();
			// console.log(responseJSON);

			expect(responseJSON).toHaveProperty('id');
			expect(responseJSON).toHaveProperty('userId');
			expect(responseJSON).toHaveProperty('storeId');
			expect(responseJSON).toHaveProperty('rating');
			expect(responseJSON).toHaveProperty('reviewText');
		});

		//? Update review
		it('PUT /api/reviews/update/:id is working, returns 200 and updated review', async () => {
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

			const reviewToUpdateSearch = await prisma.review.findMany({ where: { storeId: 1, userId: 2 }, orderBy: { id: 'asc' } });

			const reviewToUpdate = reviewToUpdateSearch[1];

			const newReview = {
				rating: 4,
				reviewText: 'good aesthetic and vibes but kinda painfully mid on everything else idk what else to say, but honestly worth it',
			};

			const response = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/reviews/update/${reviewToUpdate.id}`, {
					method: 'PUT',
					headers: {
						Cookie: setCookieHeader!,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(newReview),
				}),
			);

			expect(response.status).toBe(200);
		});

		//? A user cant update another users review
		it('A user cant update another users review', async () => {
			const responseLogin = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/users/login`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email: 'user2@test.com', password: 'unsafe_user_password2' }),
				}),
			);

			expect(responseLogin.status).toBe(200);

			// use the cookie
			const setCookieHeader = responseLogin.headers.get('set-cookie');
			expect(setCookieHeader).not.toBeNull();

			// making sure the review deleted is the one created
			const reviewToUpdateSearch = await prisma.review.findMany({ where: { storeId: 1, userId: 2 }, orderBy: { id: 'asc' } });

			const reviewToUpdate = reviewToUpdateSearch[1];

			const newReview = {
				rating: 5,
				reviewText: 'best store ever!! haha Im review bombing haha',
			};

			const response = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/reviews/update/${reviewToUpdate.id}`, {
					method: 'PUT',
					headers: {
						Cookie: setCookieHeader!,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(newReview),
				}),
			);

			expect(response.status).toBe(401);
		});

		//? A user cant delete another users review
		it('A user cant delete another users review', async () => {
			const responseLogin = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/users/login`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email: 'user2@test.com', password: 'unsafe_user_password2' }),
				}),
			);

			expect(responseLogin.status).toBe(200);

			// use the cookie
			const setCookieHeader = responseLogin.headers.get('set-cookie');
			expect(setCookieHeader).not.toBeNull();

			// making sure the review deleted is the one created
			const reviewToDeleteSearch = await prisma.review.findMany({ where: { storeId: 1, userId: 2 }, orderBy: { id: 'asc' } });

			const reviewToDelete = reviewToDeleteSearch[1];

			const response = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/reviews/delete/${reviewToDelete.id}`, {
					method: 'DELETE',
					headers: {
						Cookie: setCookieHeader!,
						'Content-Type': 'application/json',
					},
				}),
			);

			expect(response.status).toBe(401);
		});

		//? Delete review
		it('DELETE /api/reviews/delete/:id is working, returns 204', async () => {
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

			// making sure the review deleted is the one created
			const reviewToDeleteSearch = await prisma.review.findMany({ where: { storeId: 1, userId: 2 }, orderBy: { id: 'asc' } });

			const reviewToDelete = reviewToDeleteSearch[1];
			// ______

			const response = await app.handle(
				new Request(`http://${app.server?.hostname}:${app.server?.port}/api/reviews/delete/${reviewToDelete.id}`, {
					method: 'DELETE',
					headers: {
						Cookie: setCookieHeader!,
						'Content-Type': 'application/json',
					},
				}),
			);

			expect(response.status).toBe(204);
		});

		//! ADMIN PROTECTED ENDPOINTS
		/* describe('Admin Protected Endpoints', () => {
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
            });
        }); */
	});
});
