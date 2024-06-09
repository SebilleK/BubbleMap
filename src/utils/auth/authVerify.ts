// these are functions to verify user permissions
// i put them here to clean up the routes index file for more abstraction
// read more in the README Authentication section

import { verifyToken, decodeToken } from './authJWT';

// returns true if user is logged in
export async function confirmLogin(set: any, cookieAuth: any) {
	try {
		//! fix for type error undefined?
		if (cookieAuth === undefined || cookieAuth.value === undefined || cookieAuth.value.accessToken === undefined) {
			return false;
		}
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

// returns true if user is admin
export async function confirmAdmin(set: any, cookieAuth: any) {
	try {
		//! fix for type error undefined?
		if (cookieAuth === undefined || cookieAuth.value === undefined || cookieAuth.value.accessToken === undefined) {
			return false;
		}
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

// returns true if the user making the request is the same as the user in the token
export async function confirmUser(cookieAuth: any, userId: number) {
	try {
		const decodedTokenString = decodeToken(cookieAuth.value.accessToken.jwtToken);
		const decodedToken = decodedTokenString ? JSON.parse(decodedTokenString) : null;

		if (!decodedToken || decodedToken.sub !== userId) {
			return false;
		} else {
			return true;
		}
	} catch (error) {
		console.log(error);
		return false;
	}
}
