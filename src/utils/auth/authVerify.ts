// these are functions to verify user permissions
// i put them here to clean up the routes index file for more abstraction
// read more in the README Authentication section

import { verifyToken, decodeToken } from './authJWT';

// returns true if user is logged in
export async function confirmLogin(set: any, cookieAuth: any) {
	try {
		const token = cookieAuth.value.accessToken.jwtToken;
		const verifiedToken = await verifyToken(token);
		if (verifiedToken) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		console.log(error);
		return false;
	}
}

export async function confirmAdmin(set: any, cookieAuth: any) {
	try {
		const token = cookieAuth.value.accessToken.jwtToken;
		const verifiedToken = await verifyToken(token);
		if (!verifiedToken) {
			return false;
		}

		// the decoded token is a string...
		const decodedTokenString = decodeToken(token);
		const decodedToken = decodedTokenString ? JSON.parse(decodedTokenString) : null;

		// check if it has the admin property
		if (!decodedToken || typeof decodedToken.admin !== 'boolean' || !decodedToken.admin) {
			return false;
		} else {
			return true;
		}
	} catch (error) {
		console.log(error);
		return false;
	}
}
