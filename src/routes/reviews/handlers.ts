import { InternalServerError, NotFoundError, ValidationError } from 'elysia';
import prisma from '../../../prisma/prisma';
import { parse } from 'dotenv';
import { typeCheckerReview } from '../../utils/errors/validationSchemas';

//? auth helpers
import { confirmUser } from '../../utils/auth/authVerify';
import { decodeToken } from '../../utils/auth/authJWT';

//? all

export async function getReviews() {
	try {
		return await prisma.review.findMany({ orderBy: { id: 'asc' } });
	} catch (error) {
		// console.error(`Error while fetching reviews: `, error);
		throw new InternalServerError('Error while fetching reviews');
	}
}

export async function getReviewsbyId(id: string) {
	try {
		const numberId = parseInt(id);

		const reviews = await prisma.review.findUnique({ where: { id: numberId } });

		if (!reviews) {
			console.log('Reviews not found');
			throw new NotFoundError('Reviews not found');
		}

		return reviews;
	} catch (error) {
		console.error(`Error while fetching reviews: `, error);
		throw new InternalServerError('Error while fetching reviews');
	}
}

export async function getAllReviewsbyUserId(id: string) {
	try {
		const numberId = parseInt(id);

		const reviews = await prisma.review.findMany({ where: { userId: numberId } });

		if (!reviews) {
			console.log('Reviews not found');
			throw new NotFoundError('Reviews not found');
		}

		return reviews;
	} catch (error) {
		console.error(`Error while fetching reviews: `, error);
		throw new InternalServerError('Error while fetching reviews');
	}
}

export async function getAllReviewsbyStoreId(id: string) {
	try {
		const numberId = parseInt(id);

		const reviews = await prisma.review.findMany({ where: { storeId: numberId } });

		if (!reviews) {
			console.log('Reviews not found');
			throw new NotFoundError('Reviews not found');
		}

		return reviews;
	} catch (error) {
		console.error(`Error while fetching reviews: `, error);
		throw new InternalServerError('Error while fetching reviews');
	}
}

//? protected

export async function createReview(id: string, storeId: string, body: any, set: any, cookieAuth: any) {
	try {
		// rating and reviewText validation
		const reviewData = {
			rating: body.rating,
			reviewText: body.reviewText,
		};

		if (!typeCheckerReview.Check(reviewData)) {
			console.log('Please enter a valid rating and review text');
			throw new ValidationError('Please enter a valid rating and review text', typeCheckerReview, reviewData);
		}

		const userId = parseInt(id);
		// confirm user
		if ((await confirmUser(cookieAuth, userId)) === false) {
			console.log('Unauthorized');
			return (set.status = 'Unauthorized');
		}

		// check if the user has already reviewed the store
		const review = await prisma.review.findFirst({ where: { userId: userId, storeId: parseInt(storeId) } });
		if (review) {
			console.log('User has already reviewed this store');
			throw new Error('This store has already been reviewed');
		}

		// insert review in the user
		const newReview = await prisma.review.create({
			data: {
				userId: userId,
				storeId: parseInt(storeId),
				rating: reviewData.rating,
				reviewText: reviewData.reviewText,
			},
		});

		set.status = 201;

		// console.log(newReview);

		return newReview;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
		console.error(`Error while creating review: `, error);
		throw new InternalServerError('Error while creating review');
	}
}

export async function deleteReview(id: string, cookieAuth: any, set: any) {
	try {
		const numberId = parseInt(id);

		// only the user can delete their own review,
		// so we need to get the user id of the review
		// NOT using the id of the review itself

		// 1. get the review and its user id
		const review = await prisma.review.findUnique({ where: { id: numberId } });
		if (!review) {
			console.log('Review not found');
			throw new NotFoundError('Review not found');
		}
		/*_____ console.log('user id of the review');
		console.log(review.userId); _____*/
		// 2. get the user id of the person making the request (with the cookie)
		/* const decodedJWTString = decodeToken(cookieAuth.value.accessToken.jwtToken);
		const decodedToken = decodedJWTString ? JSON.parse(decodedJWTString) : null; */
		/*____ console.log('user id of the person making the request');
		console.log(decodedToken.sub);____ */

		// 3. the values you should compare are the user id stored in the cookie and the user id of the review!
		if ((await confirmUser(cookieAuth, review.userId)) === false) {
			console.log('Unauthorized');
			return (set.status = 'Unauthorized');
		}

		const deletedReview = await prisma.review.delete({ where: { id: numberId } });

		set.status = 204;

		return deletedReview;
	} catch (error) {
		console.error(`Error while deleting review: `, error);
		throw new NotFoundError('Error while deleting review');
	}
}

export async function updateReview(id: string, cookieAuth: any, set: any, body: any) {
	try {
		const numberId = parseInt(id);
		// only the user can update their own review
		// same logic as delete, we NEED to get the user id of the review
		const review = await prisma.review.findUnique({ where: { id: numberId } });
		if (!review) {
			console.log('Review not found');
			throw new NotFoundError('Review not found');
		}

		const reviewData = {
			rating: body.rating ? body.rating : review.rating,
			reviewText: body.reviewText ? body.reviewText : review.reviewText,
		};

		// validation
		if (!typeCheckerReview.Check(reviewData)) {
			console.log('Please enter a valid rating and review text');
			throw new ValidationError('Please enter a valid rating and review text', typeCheckerReview, body);
		}

		if ((await confirmUser(cookieAuth, review.userId)) === false) {
			console.log('Unauthorized');
			return (set.status = 'Unauthorized');
		}
		/* ___ */

		const updatedReview = await prisma.review.update({
			where: { id: numberId },
			data: {
				...reviewData,
			},
		});

		return updatedReview;
	} catch (error) {
		if (error instanceof ValidationError) {
			throw error;
		}
		console.error(`Error while updating review: `, error);
		throw new InternalServerError('Error while updating review');
	}
}

//? admin only
