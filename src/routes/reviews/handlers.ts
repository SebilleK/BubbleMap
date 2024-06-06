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

//? protected

export async function createReview(rating: number, reviewText: string, id: string, storeId: string) {
	try {
		// rating and reviewText validation

		const reviewData = { rating, reviewText };

		if (!typeCheckerReview.Check(reviewData)) {
			console.log('Please enter a valid rating and review text');
			throw new ValidationError('Please enter a valid rating and review text', typeCheckerReview, reviewData);
		}

		// insert review in the user

		await prisma.review.create({
			data: {
				userId: parseInt(id),
				storeId: parseInt(storeId),
				rating: rating,
				reviewText: reviewText,
			},
		});

		return true;
	} catch (error) {
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

		return await prisma.review.delete({ where: { id: numberId } });
	} catch (error) {
		console.error(`Error while deleting review: `, error);
		throw new NotFoundError('Error while deleting review');
	}
}

export async function updateReview(id: string, cookieAuth: any, set: any, rating?: number, reviewText?: string) {
	try {
		const numberId = parseInt(id);
		// only the user can update their own review
		// same logic as delete, we NEED to get the user id of the review
		const review = await prisma.review.findUnique({ where: { id: numberId } });
		if (!review) {
			console.log('Review not found');
			throw new NotFoundError('Review not found');
		}

		if ((await confirmUser(cookieAuth, review.userId)) === false) {
			console.log('Unauthorized');
			return (set.status = 'Unauthorized');
		}
		/* ___ */
		return await prisma.review.update({
			where: { id: numberId },
			data: {
				...(rating ? { rating: rating } : {}),
				...(reviewText ? { reviewText: reviewText } : {}),
			},
		});
	} catch (error) {
		console.error(`Error while updating review: `, error);
		throw new InternalServerError('Error while updating review');
	}
}

//? admin only
