//? JWT AUTHENTICATION
import { env } from '../../env';
import jwt from 'jsonwebtoken';
import prisma from '../../../prisma/prisma';

// needs to receive the user object, returns a valid token with the user id and role (if it's an admin)
export async function generateToken(user: any) {
	const secret = env.JWT_SECRET;

	const getUser = await prisma.user.findUnique({ where: { email: user.email } });
	if (getUser) {
		const jwtToken = jwt.sign({ sub: getUser.id, admin: getUser.admin }, secret!, { expiresIn: '1d' });
		return {
			jwtToken,
		};
	} else {
		console.log('User not found, cannot generate token');
		throw new Error('User not found, cannot generate token');
	}
}

// verifies if the token is valid
export async function verifyToken(token: string) {
	const secret = env.JWT_SECRET;
	const decoded = jwt.verify(token, secret!);

	if (decoded) {
		return decoded;
	} else {
		console.log('Invalid token');
		return null;
	}
}

// decodes the token
export function decodeToken(token: string) {
	try {
		const decoded = jwt.decode(token);
		if (decoded) {
			const decodedString = JSON.stringify(decoded);
			return decodedString;
		} else {
			console.log('Invalid token');
			return null;
		}
	} catch (error) {
		console.error('Error decoding token:', error);
		return null;
	}
}
