'use strict';

const { ObjectId } = require('mongodb');
const Database = require('../../db/database');
const Response = require('../../http/response');
const deleteProduct = require('./delete');

// Mock the Database class
jest.mock('../../db/database');

let product;
let event;
let collectionMock;
let connectMock;

describe('delete.handler', () => {
	beforeEach(() => {
		jest.spyOn(Response, 'success');
		jest.spyOn(Response, 'notFound');
		jest.spyOn(Response, 'error');

		event = { pathParameters: { id: '652eee405e79938ca3012d21' } };
		product = {
			_id: new ObjectId('652eee405e79938ca3012d21'),
			name: 'Burger',
			type: 'burger',
			price: 10,
			ingredients: ['bread', 'patty', 'cheese']
		};
		collectionMock = {
			findOneAndDelete: jest.fn().mockResolvedValue(product)
		};

		connectMock = jest.fn().mockResolvedValue({ collection: jest.fn().mockReturnValue(collectionMock) });

		Database.mockImplementation(() => ({
			connect: connectMock
		}));
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should return a not found response if the product does not exist', async () => {
		collectionMock.findOneAndDelete.mockResolvedValueOnce(null);

		const expectedResult = new Response(404, { message: `Unable to delete: product ${event.pathParameters.id} not found` });

		const result = await deleteProduct.handler(event);

		expect(connectMock).toHaveBeenCalled();
		expect(collectionMock.findOneAndDelete).toHaveBeenCalledWith({ _id: new ObjectId(event.pathParameters.id) });
		expect(Response.notFound).toHaveBeenCalledWith(`Unable to delete: product ${event.pathParameters.id} not found`);
		expect(result).toEqual(expectedResult);
	});

	it('should return a success response when the product is deleted successfully', async () => {
		const expectedResult = new Response(200, {
			message: `Product ${event.pathParameters.id} deleted successfully`,
			deletedProduct: product
		});

		const result = await deleteProduct.handler(event);

		expect(connectMock).toHaveBeenCalled();
		expect(collectionMock.findOneAndDelete).toHaveBeenCalledWith({ _id: new ObjectId(event.pathParameters.id) });
		expect(Response.success).toHaveBeenCalledWith({
			message: `Product ${event.pathParameters.id} deleted successfully`,
			deletedProduct: product
		});
		expect(result).toEqual(expectedResult);
	});

	it('should return an error response if an error occurs during the delete process', async () => {
		const expectedResult = new Response(500, { message: `An error occurred while deleting product ${event.pathParameters.id}` });

		connectMock = jest.fn().mockRejectedValue(new Error('An error occurred'));
		Database.mockImplementation(() => ({
			connect: connectMock
		}));

		const result = await deleteProduct.handler(event);

		expect(connectMock).toHaveBeenCalled();
		expect(Response.error).toHaveBeenCalledWith(`An error occurred while deleting product ${event.pathParameters.id}`);
		expect(result).toEqual(expectedResult);
	});
});
