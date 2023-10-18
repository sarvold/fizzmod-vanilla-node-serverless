'use strict';

const Response = require('../../http/response');
const Database = require('../../db/database');
const buildFilter = require('../../utils/filterBuilder');
const buildSort = require('../../utils/sortBuilder');
const list = require('./list');

// Mock the Database class
jest.mock('../../db/database');

let event;
let collectionMock;
let connectMock;

describe('list.handler', () => {
	beforeEach(() => {
		jest.spyOn(Response, 'success');
		jest.spyOn(Response, 'error');

		collectionMock = {
			find: jest.fn().mockReturnThis(),
			sort: jest.fn().mockReturnThis(),
			toArray: jest.fn().mockResolvedValue([])
		};

		connectMock = jest.fn().mockResolvedValue({ collection: jest.fn().mockReturnValue(collectionMock) });

		Database.mockImplementation(() => ({
			connect: connectMock
		}));

		jest.clearAllMocks();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('when no query parameters are provided', () => {
		beforeEach(() => {
			event = { queryStringParameters: null };
		});
		it('should return all products if no query parameters are provided', async () => {
			const expectedResult = new Response(200, []);

			const result = await list.handler(event);

			expect(connectMock).toHaveBeenCalled();
			expect(collectionMock.find).toHaveBeenCalled();
			expect(collectionMock.sort).not.toHaveBeenCalled();
			expect(collectionMock.toArray).toHaveBeenCalled();
			expect(Response.success).toHaveBeenCalledWith([]);
			expect(result).toEqual(expectedResult);
		});
	});
	describe('when query parameters are provided', () => {
		beforeEach(() => {
			event = {
				queryStringParameters: {
					name: 'Burger',
					type: 'burger',
					priceFrom: '5',
					priceTo: '15',
					isPromotion: 'true',
					orderBy: 'name',
					orderDirection: 'asc'
				}
			};
		});

		it('should return filtered and sorted products if query parameters are provided', async () => {
			const expectedResult = new Response(200, []);

			const result = await list.handler(event);

			expect(connectMock).toHaveBeenCalled();
			expect(collectionMock.find).toHaveBeenCalledWith(
				buildFilter('Burger', 'burger', '5', '15', 'true')
			);
			expect(collectionMock.sort).toHaveBeenCalledWith(
				buildSort('name', 'asc')
			);
			expect(collectionMock.toArray).toHaveBeenCalled();
			expect(Response.success).toHaveBeenCalledWith([]);
			expect(result).toEqual(expectedResult);
		});

		it('should return an error response if an error occurs during the fetch process', async () => {
			const expectedResult = new Response(500, { message: 'An error occurred while fetching products' });

			connectMock = jest.fn().mockRejectedValue(new Error('An error occurred'));
			Database.mockImplementation(() => ({
				connect: connectMock
			}));

			const result = await list.handler(event);

			expect(connectMock).toHaveBeenCalled();
			expect(Response.error).toHaveBeenCalledWith('An error occurred while fetching products');
			expect(result).toEqual(expectedResult);
		});

	});
});
