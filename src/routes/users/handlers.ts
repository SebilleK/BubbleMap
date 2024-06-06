import { InternalServerError, NotFoundError, ValidationError } from 'elysia';
import prisma from '../../../prisma/prisma';
import { hashValue, compareValue } from '../../utils/hashUtil';

//? Validation error schema helpers
import { typeCheckerPassword, typeCheckerEmail } from '../../utils/errors/validationSchemas';

//? JWT helpers
import { generateToken, decodeToken } from '../../utils/auth/authJWT';

//? Auth helpers
import { confirmUser } from '../../utils/auth/authVerify';

//? all
export async function createUser(options: { username: string; email: string; password: string }) {
	const { username, email, password } = options;
	// if username or email already exist
	const existingUser = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
	if (existingUser) {
		throw new Error('This username or email have already been used by a registered user.');
	}

	if (!typeCheckerEmail.Check(email)) {
		throw new ValidationError('Please enter a valid email address', typeCheckerEmail, email);
	}

	if (!typeCheckerPassword.Check(password)) {
		throw new ValidationError('Your password should have 8 or more characters', typeCheckerPassword, password);
	}

	const hashedPassword = await hashValue(password);

	try {
		return await prisma.user.create({ data: { username, email, password: hashedPassword } });
	} catch (error) {
		throw new InternalServerError('Error while trying to register user. ');
	}
}

export async function loginUser(options: { email: string; password: string }, cookieAuth: any) {
	const { email, password } = options;
	try {
		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			throw new NotFoundError('This email is not registered');
		}

		const passwordMatch = await compareValue(password, user.password);
		if (!passwordMatch) {
			throw new NotFoundError('Wrong password');
		}

		//! GENERATING JWT TOKEN
		const accessToken = await generateToken(user);

		if (!accessToken) {
			throw new InternalServerError('An access token could not be generated.');
		}

		//! SETTING AUTH COOKIES
		cookieAuth.value = {
			accessToken: accessToken,
		};

		return {
			user,
			accessToken: accessToken,
		};
	} catch (error) {
		if (error instanceof NotFoundError) {
			throw error;
		}

		console.error(`Error while trying to login user: `, error);
	}
}

//? protected
export async function getUsers() {
	try {
		return await prisma.user.findMany({ orderBy: { id: 'asc' } });
	} catch (error) {
		// console.error(`Error while fetching users: `, error);
		throw new InternalServerError('Error while fetching users');
	}
}

export async function getUserbyId(id: string) {
	try {
		const numberId = parseInt(id);

		const user = await prisma.user.findUnique({ where: { id: numberId } });

		if (!user) {
			console.log('User not found');
			throw new NotFoundError('User not found');
		}

		return user;
	} catch (error) {
		if (error instanceof NotFoundError) {
			throw error;
		} else {
			throw new InternalServerError('Error while fetching user');
		}
	}
}

export async function updateUser(id: string, options: { username?: string; email?: string; password?: string }, cookieAuth: any, set: any) {
	try {
		const { username, email, password } = options;

		const numberId = parseInt(id);

		//____ only the user can update themselves
		/* const decodedTokenString = decodeToken(cookieAuth.value.accessToken.jwtToken);
		const decodedToken = decodedTokenString ? JSON.parse(decodedTokenString) : null;

		if (!decodedToken || decodedToken.sub !== numberId) {
			console.log('Unauthorized');
			console.log(decodedToken, numberId);
			return (set.status = 'Unauthorized');
		} */

		if ((await confirmUser(cookieAuth, numberId)) === false) {
			console.log('Unauthorized');
			return (set.status = 'Unauthorized');
		}
		// __________

		return await prisma.user.update({
			where: { id: numberId },
			data: {
				...(username ? { username } : {}),
				...(email ? { email } : {}),
				...(password ? { password: await hashValue(password) } : {}),
			},
		});
	} catch (error) {
		throw new Error('Error while trying to update user' + error);
	}
}

//? admin only
export async function deleteUser(id: string, cookieAuth: any) {
	try {
		const numberId = parseInt(id);

		return await prisma.user.delete({ where: { id: numberId } });
	} catch (error) {
		console.error(`Error while trying to delete user: `, error);
		throw new NotFoundError('User not found');
	}
}
 