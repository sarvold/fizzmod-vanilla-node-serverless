'use strict';

const { ObjectId } = require('mongodb');
const Database = require('../../db/database');
const Response = require('../../http/response');
const read = require('./read');

// Mock the Database class
jest.mock('../../db/database');

let event;
let objectId;
let product;
let findOneMock;
let collectionMock;
let connectMock;

describe('read.handler', () => {
	beforeEach(() => {
		jest.spyOn(Response, 'notFound');
		jest.spyOn(Response, 'success');
		jest.spyOn(Response, 'error');

		event = { pathParameters: { id: '652eee405e79938ca3012d21' } };
		objectId = new ObjectId('652eee405e79938ca3012d21');
		product = {
			_id: objectId,
			name: 'Burger',
			type: 'burger',
			price: 10,
			ingredients: ['bread', 'patty', 'cheese']
		};

		// Mock the behavior of the connect method
		findOneMock = jest.fn().mockResolvedValue(product);
		collectionMock = jest.fn().mockReturnThis()
			.mockReturnValue({ findOne: findOneMock });
		connectMock = jest.fn().mockResolvedValue({ collection: collectionMock });

		Database.mockImplementation(() => ({
			connect: connectMock
		}));
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should return the product if it exists', async () => {
		const expectedResult = new Response(200, product);

		const result = await read.handler(event);

		expect(connectMock).toHaveBeenCalled();
		expect(collectionMock).toHaveBeenCalledWith('products');
		expect(findOneMock).toHaveBeenCalled();
		expect(findOneMock).toHaveBeenCalledWith({ _id: objectId });
		expect(Response.success).toHaveBeenCalledWith(expect.objectContaining({
			_id: expect.any(ObjectId),
			ingredients: ['bread', 'patty', 'cheese'],
			name: 'Burger',
			price: 10,
			type: 'burger'
		}));
		expect(result).toEqual(expectedResult);
	});

	it('should return a not found response if the product does not exist', async () => {
		const expectedResult = new Response(404, { message: `Unable to find product with id ${event.pathParameters.id}` });

		findOneMock = jest.fn().mockResolvedValue(null);
		collectionMock = jest.fn().mockReturnThis()
			.mockReturnValue({ findOne: findOneMock });
		connectMock = jest.fn().mockResolvedValue({ collection: collectionMock });

		Database.mockImplementation(() => ({
			connect: connectMock
		}));

		const result = await read.handler(event);

		expect(connectMock).toHaveBeenCalled();
		expect(collectionMock).toHaveBeenCalledWith('products');
		expect(findOneMock).toHaveBeenCalledWith({ _id: objectId });
		expect(Response.notFound).toHaveBeenCalledWith(`Unable to find product with id ${event.pathParameters.id}`);
		expect(result).toEqual(expectedResult);
	});

	it('should return an error response if an error occurs during the fetch process', async () => {
		const message = 'An error occurred while fetching the product';
		const expectedResult = new Response(500, { message });

		connectMock = jest.fn().mockRejectedValue(new Error(message));

		Database.mockImplementation(() => ({
			connect: connectMock
		}));

		const result = await read.handler(event);

		expect(connectMock).toHaveBeenCalled();
		expect(Response.error).toHaveBeenCalledWith(message);
		expect(result).toEqual(expectedResult);
	});
});
