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
			{
				id: 5,
				name: 'Bubble Time Baixa Chiado',
				description: 'Bubble Time was established in September 2022 from the merger of Bubble Lab and Time Tea and Coffee.',
				address: 'Rua da Prata n160, 1100-416 Lisboa',
				latitude: 38.71142,
				longitude: -9.13701,
			},
			{
				id: 6,
				name: 'Mr. Box Tea',
				description: 'Mr.Box Tea Lisboa: Bubble Tea, Fruit Tea, Milk Tea e muitos Mochis!',
				address: 'Av. António Augusto de Aguiar 140B, 1050-021 Lisboa',
				latitude: 38.73483,
				longitude: -9.15407,
			},
			{
				id: 7,
				name: 'Bubble Time Saldanha',
				description: 'Bubble Time was established in September 2022 from the merger of Bubble Lab and Time Tea and Coffee.',
				address: 'Av. Praia da Vitória 50A, 1050-184 Lisboa',
				latitude: 38.73366,
				longitude: -9.14628,
			},
			{
				id: 8,
				name: 'Lili Boba',
				description:
					'Bubble tea shop with authentic bobas from Taiwan. Homemade syrup, fresh fruit based with matcha, coffee and choices of plant based milk. Handmade cupcakes and croffles on offer. With made to order floral artisan cupcakes, and Korean style croffles or croiffles with strawberry and cream.',
				address: 'R. de São Bento 68, 1200-815 Lisboa',
				latitude: 38.71099,
				longitude: -9.15256,
			},
			{
				id: 9,
				name: 'TwoToo Cais do Sodré',
				description: '...',
				address: 'PT, Cais do Sodré 12, 1249-289 Lisboa',
				latitude: 38.70669,
				longitude: -9.14237,
			},
			{
				id: 10,
				name: 'Bubble Time Roma',
				description: 'Bubble Time was established in September 2022 from the merger of Bubble Lab and Time Tea and Coffee.',
				address: 'Av. de Roma 22B, 1000-266 Lisboa',
				latitude: 38.74424,
				longitude: -9.13894,
			},
			{
				id: 11,
				name: 'Mon Tea Portugal 萌',
				description: '...',
				address: 'Av. Aquilino Ribeiro Machado F2, 1990-084 Lisboa',
				latitude: 38.76844,
				longitude: -9.09914,
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
