import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const signUserToken = (data: { id: number; email: string }): string => {
	const token = jwt.sign(
		{
			id: data.id,
			email: data.email,
		},
		JWT_SECRET,
		{ expiresIn: '1d' },
	);
	return token;
};

export const verifyToken = (token: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, JWT_SECRET, (error, decoded) => {
			if (error) {
				return reject(new Error('Invalid token'));
			}
			resolve(decoded);
		});
	});
};
