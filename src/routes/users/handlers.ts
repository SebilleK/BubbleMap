import { NotFoundError, ValidationError } from 'elysia';
import prisma from '../../../prisma/prisma';
import { hashValue, compareValue } from '../../utils/hashUtil';

export async function getUsers() {
	try {
		return await prisma.user.findMany({ orderBy: { id: 'asc' } });
	} catch (error) {
		console.error(`Error while fetching users: `, error);
	}
}

export async function getUserbyId(id: string) {
	try {
		const numberId = parseInt(id);

		const user = await prisma.user.findUnique({ where: { id: numberId } });

		if (!user) {
			throw new NotFoundError('User not found');
		}

		return user;
	} catch (error) {
		console.error(`Error while fetching user: `, error);
		throw new Error('User not found');
	}
}

export async function createUser(options: { username: string; email: string; password: string }) {
	const { username, email, password } = options;

	// if username or email already exist
	const existingUser = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
	if (existingUser) {
		throw new Error('This username or email have already been used by a registered user.');
	}

	const hashedPassword = await hashValue(password);

	try {
		return await prisma.user.create({ data: { username, email, password: hashedPassword } });
	} catch (error) {
		console.error(`Error while trying to register user: `, error);
	}
}

export async function loginUser(options: { email: string; password: string }) {
	const { email, password } = options;
	try {
		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			throw new Error('This email is not registered');
		}

		const passwordMatch = await compareValue(password, user.password);
		if (!passwordMatch) {
			throw new Error('Wrong password');
		}

		return user;
	} catch (error) {
		console.error(`Error while trying to login user: `, error);
		throw new Error('Error while trying to login user. Check your credentials and try again.');
	}
}

export async function updateUser(id: string, options: { username?: string; email?: string; password?: string }) {
	try {
		const { username, email, password } = options;

		const numberId = parseInt(id);

		return await prisma.user.update({
			where: { id: numberId },
			data: {
				...(username ? { username } : {}),
				...(email ? { email } : {}),
				...(password ? { password: await hashValue(password) } : {}),
			},
		});
	} catch (error) {
		throw new Error('User not found');
	}
}

export async function deleteUser(id: string) {
	try {
		const numberId = parseInt(id);

		return await prisma.user.delete({ where: { id: numberId } });
	} catch (error) {
		console.error(`Error while trying to delete user: `, error);
		throw new Error('User not found');
	}
}
