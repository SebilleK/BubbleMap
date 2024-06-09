import prisma from '../../../prisma/prisma';
import { hashValue } from '../../utils/hashUtil';
console.log('Seeding data...');

try {
	// Users
	await prisma.user.createMany({
		data: [
			{
				id: 1,
				username: 'admin',
				email: 'admin@test.com',
				password: await hashValue('unsafe_password_admin'),
				admin: true,
			},
			{
				id: 2,
				username: 'user1',
				email: 'user1@test.com',
				password: await hashValue('unsafe_user_password1'),
				admin: false,
			},
			{
				id: 3,
				username: 'user2',
				email: 'user2@test.com',
				password: await hashValue('unsafe_user_password2'),
				admin: false,
			},
			{
				id: 4,
				username: 'user3',
				email: 'user3@test.com',
				password: await hashValue('unsafe_user_password3'),
				admin: false,
			},
			{
				id: 5,
				username: 'user4',
				email: 'user4@test.com',
				password: await hashValue('unsafe_user_password4'),
				admin: false,
			},
		],
		skipDuplicates: true,
	});

	console.log('Users created successfully');

	// Stores
	await prisma.store.createMany({
		data: [
			{
				id: 1,
				name: 'Bubble Time',
				description: 'Bubble Time was established in September 2022 from the merger of Bubble Lab and Time Tea and Coffee',
				address: 'Rua da Pimenta 3, Lisbon 1990-254 Portugal',
				latitude: 38.76993,
				longitude: -9.09246,
			},
			{
				id: 2,
				name: 'Mommy Cake Bubbletea',
				description: '...',
				address: 'R. do Crucifixo 112 114, 1100-185 Lisboa',
				latitude: 38.71135,
				longitude: -9.13917,
			},
			{
				id: 3,
				name: 'Bubble Tea Factory Lisbon',
				description:
					'The Bubble Tea Factory creates bubbles, flavours, fun experiences, unforgettable moments for you that are visiting Portugal or/and who wants to drink something unique. The Bubble Tea Factory is a Portuguese brand, and its uniqueness is to promote the Portuguese flavours. We are mixing the traditional Taiwanese concept with Portuguese flavours to create an unique experience.',
				address: 'Tv. Marta Pinto 14, 1300-315 Lisboa',
				latitude: 38.69765,
				longitude: -9.20251,
			},
			{
				id: 4,
				name: 'CONBINI',
				description: 'A Conbini é uma loja especializada em Merchandise, Figuras e Model Kits. Conta com uma loja física em Lisboa desde Outubro de 2022 e com uma loja online desde 2024.',
				address: 'Avenida Ressano Garcia 39A, 1070-234 Lisboa',
				latitude: 38.73489,
				longitude: -9.15705,
			},
		],
		skipDuplicates: true,
	});

	console.log('Stores created successfully');

	// Reviews
	await prisma.review.createMany({
		data: [
			{
				userId: 2,
				storeId: 1,
				rating: 4,
				reviewText: 'Great bubble tea!',
			},
			{
				userId: 2,
				storeId: 2,
				rating: 3,
				reviewText: 'Decent place, good cakes.',
			},
			{
				userId: 3,
				storeId: 1,
				rating: 5,
				reviewText: 'Best bubble tea in town!',
			},
			{
				userId: 4,
				storeId: 3,
				rating: 4,
				reviewText: 'Unique flavors, loved it!',
			},
			{
				userId: 5,
				storeId: 4,
				rating: 2,
				reviewText: 'Not impressed, limited selection.',
			},
		],
		skipDuplicates: true,
	});

	console.log('Reviews created successfully');

	console.log('Seeding finished');
	await prisma.$disconnect();
	console.log('Disconnected from database');
} catch (error) {
	console.error('Error while seeding database: ', error);
	await prisma.$disconnect();
	throw error;
}
