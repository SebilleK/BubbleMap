//! All the users routes
//? Elysia + users services
import { Elysia } from 'elysia';
import { getAllUsers, createUser, loginUser } from '../services/user.service';

export const userController = (app: Elysia) => {
	
	//? get all users
	app.get('/users', async context => {
		try {
			const users = await getAllUsers();
			return users;
		} catch (error: any) {
			console.log(`Error getting users: ${error}`);
			throw error;
		}
	});
	//? register a user
	app.post('/signup', async context => {
		try {
			const userData: any = context.body;

			const newUser = await createUser({
				username: userData.username,
				email: userData.email,
				password: userData.password,
			});

			return {
				message: 'User created successfully',
				user: newUser,
			};
		} catch (error: any) {
			console.log(`Error creating new user: ${error}`);
			throw error;
		}
	});
	//? login a user
	app.post('/login', async context => {
		try {
			const userData: any = context.body;

			const loggedInUser = await loginUser({
				email: userData.email,
				password: userData.password,
			});

			return loggedInUser;
		} catch (error: any) {
			console.log(`Error logging in user: ${error}`);
			throw error;
		}
	});
};
