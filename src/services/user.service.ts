import prisma from '../../prisma/prisma';
import { signUserToken } from './auth.service';
import bcrypt from 'bcrypt';


export const getAllUsers = async () => {
	try {
		const users = await prisma.user.findMany();
		return users;
	} catch (error) {
		console.log(`Error getting users: ${error}`);
		throw error;
	}
};
export const createUser = async (data: { username: string; email: string; password: string }) => {
	try {
		const { username, email, password } = data;

		// const hashedPassword = await Bun.password.hash(password, { algorithm: 'bcrypt' });

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
			},
		});

		return user;
	} catch (error) {
		console.log(`Error creating user: ${error}`);
		throw error;
	}
};

export const loginUser = async (data: { email: string; password: string }) => {
	try {
		const { email, password } = data;

		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			throw new Error('User not found');
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		// const isPasswordValid = await Bun.password.verify(user.password, password);

		if (!isPasswordValid) {
			throw new Error('Invalid password');
		}

		const token = signUserToken({ id: user.id, email: user.email });

		return {
			message: 'Login successful',
			token,
		};
	} catch (error) {
		console.log(`Error logging in user: ${error}`);
		throw error;
	}
};
