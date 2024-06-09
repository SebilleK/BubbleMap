import { InternalServerError, NotFoundError, ValidationError } from 'elysia';
import prisma from '../../../prisma/prisma';
import { hashValue, compareValue } from '../../utils/hashUtil';
import { typeCheckerGeo } from '../../utils/errors/validationSchemas';

//? all

export async function getStores() {
	try {
		return await prisma.store.findMany({ orderBy: { id: 'asc' } });
	} catch (error) {
		// console.error(`Error while fetching stores: `, error);
		throw new InternalServerError('Error while fetching stores');
	}
}

export async function getStorebyId(id: string) {
	try {
		const numberId = parseInt(id);

		const store = await prisma.store.findUnique({ where: { id: numberId } });

		if (!store) {
			console.log('Store not found');
			throw new NotFoundError('Store not found');
		}

		return store;
	} catch (error) {
		throw new InternalServerError('Error while fetching store');
	}
}

//? protected

//? admin only

export async function createStore(body: any) {
	const { name, description, address, latitude, longitude } = body;
	console.log(body);

	const existingStore = await prisma.store.findFirst({ where: { OR: [{ name }, { address }] } });
	if (existingStore) {
		throw new Error('A store already exists with this name or address in the database');
	}

	const geoData = { latitude, longitude };

	if (!typeCheckerGeo.Check(geoData)) {
		throw new ValidationError('Invalid latitude or longitude', typeCheckerGeo, geoData);
	}

	try {
		return await prisma.store.create({ data: { name, description, address, latitude, longitude } });
	} catch (error) {
		throw new InternalServerError('Error while trying to create a new store. ' + error);
	}
}

export async function deleteStore(id: string) {
	try {
		const numberId = parseInt(id);

		return await prisma.store.delete({ where: { id: numberId } });
	} catch (error) {
		console.error(`Error while trying to delete store: `, error);
		throw new NotFoundError('Error while trying to delete store. ' + error);
	}
}

export async function updateStore(id: string, options: { name?: string; description?: string; address?: string; latitude?: number; longitude?: number; photo?: string }) {
	const { name, description, address, latitude, longitude, photo } = options;

	const numberId = parseInt(id);

	try {
		return await prisma.store.update({
			where: { id: numberId },
			data: {
				...(name ? { name } : {}),
				...(description ? { description } : {}),
				...(address ? { address } : {}),
				...(latitude ? { latitude } : {}),
				...(longitude ? { longitude } : {}),
				...(photo ? { photo } : {}),
			},
		});
	} catch (error) {
		console.error(`Error while trying to update store: `, error);
		throw new NotFoundError('Error while trying to update store. ' + error);
	}
}
