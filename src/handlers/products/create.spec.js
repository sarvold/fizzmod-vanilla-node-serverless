'use strict';

const create = require('./create');
const Response = require('../../http/response');
const Database = require('../../db/database');

// Mock the Database class
jest.mock('../../db/database');

let validProduct;
let insertOneMock;
let collectionMock;
let connectMock;

describe('create.handler', () => {
	beforeEach(() => {
		jest.spyOn(Response, 'badRequest');
		jest.spyOn(Response, 'error');
		jest.spyOn(Response, 'created');
		validProduct = {
			body: JSON.stringify({
				name: 'Burger',
				type: 'burger',
				price: 10,
				ingredients: ['bread', 'patty', 'cheese']
			})
		};

		// Mock the behavior of the connect method
		insertOneMock = jest.fn().mockResolvedValue({ insertedId: '123456' });
		collectionMock = jest.fn().mockReturnThis()
			.mockReturnValue({ insertOne: insertOneMock });
		connectMock = jest.fn().mockResolvedValue({ collection: collectionMock });

		Database.mockImplementation(() => {
			return { connect: connectMock };
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should create a product and return the created product ID', async () => {
		const event = validProduct;
		const expectedResult = new Response(201, { _id: '123456' });

		const result = await create.handler(event);

		expect(connectMock).toHaveBeenCalled();
		expect(collectionMock).toHaveBeenCalledWith('products');
		expect(insertOneMock).toHaveBeenCalledWith(expect.objectContaining(
			{ name: 'Burger', ingredients: ['bread', 'patty', 'cheese'] }
		));
		expect(Response.created).toHaveBeenCalledWith({ _id: '123456' });
		expect(result).toEqual(expectedResult);
	});

	it('should return a bad request response if validation errors occur', async () => {
		const event = { body: JSON.stringify({ name: 'Burger', ingredients: ['bread', 'patty', 'cheese'] }) };
		const expectedErrors = [
			'Type is required and must be one of: burger, condiments, snacks, drinks.',
			'Price is required and must be a non-negative number.'
		];
		const message = `Bad request. Invalid data. Errors: ${expectedErrors.join(', ')}`;
		const expectedResult = new Response(400, { message });

		const result = await create.handler(event);

		expect(connectMock).not.toHaveBeenCalled(); // Shouldn't even try to connect to the DB because validation happens before
		expect(Response.badRequest).toHaveBeenCalledWith(message);
		expect(result).toEqual(expectedResult);
	});

	it('should return an error response if an error occurs during the creation process', async () => {
		const event = validProduct;
		const message = 'An error occurred during product creation';
		const expectedResult = new Response(500, { message });
		// Mock the behavior of the connect method
		// jest.spyOn(database, 'connect').mockRejectedValue(new Error(message));

		// Mock the behavior of the connect method
		connectMock = jest.fn().mockRejectedValue(new Error(message));
		Database.mockImplementation(() => {
			return { connect: connectMock };
		});

		const result = await create.handler(event);

		expect(connectMock).toHaveBeenCalled();
		expect(Response.error).toHaveBeenCalledWith(message, 500);
		expect(result).toEqual(expectedResult);
	});
});
