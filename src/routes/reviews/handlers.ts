import { InternalServerError } from 'elysia';
import prisma from '../../../prisma/prisma';

//? all



//? protected

export async function getReviews() {
	try {
		return await prisma.review.findMany({ orderBy: { id: 'asc' } });
	} catch (error) {
		// console.error(`Error while fetching reviews: `, error);
		throw new InternalServerError('Error while fetching reviews');
	}
}

//? admin only
