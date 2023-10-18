'use strict';

const Response = require('../http/response');
const validateQueryStringParameters = require('./queryStringParametersValidator');

describe('validateQueryStringParameters', () => {
	it('should return null if all query parameters are valid', () => {
		const queryStringParameters = {
			type: 'burger',
			priceFrom: '5',
			priceTo: '15',
			isPromotion: 'true',
			orderBy: 'name',
			orderDirection: 'asc'
		};

		const result = validateQueryStringParameters(queryStringParameters);

		expect(result).toBeNull();
	});

	describe('type', () => {
		it('should return Response.badRequest with error message if type parameter is invalid', () => {
			const queryStringParameters = {
				type: 'pizza',
				priceFrom: '5',
				priceTo: '15',
				isPromotion: 'true',
				orderBy: 'name',
				orderDirection: 'asc'
			};

			const result = validateQueryStringParameters(queryStringParameters);

			expect(result).toEqual(Response.badRequest('Invalid type parameter'));
		});
	});

	describe('priceFrom and priceTo', () => {
		it('should return Response.badRequest with error message if priceFrom parameter is not a valid number', () => {
			const queryStringParameters = {
				type: 'burger',
				priceFrom: 'abc',
				priceTo: '15',
				isPromotion: 'true',
				orderBy: 'name',
				orderDirection: 'asc'
			};

			const result = validateQueryStringParameters(queryStringParameters);

			expect(result).toEqual(Response.badRequest('priceFrom must be a valid number'));
		});

		it('should return Response.badRequest with error message if priceTo parameter is not a valid number', () => {
			const queryStringParameters = {
				type: 'burger',
				priceFrom: '5',
				priceTo: 'xyz',
				isPromotion: 'true',
				orderBy: 'name',
				orderDirection: 'asc'
			};

			const result = validateQueryStringParameters(queryStringParameters);

			expect(result).toEqual(Response.badRequest('priceTo must be a valid number'));
		});

		it('should return Response.badRequest with error message if priceFrom is greater than or equal to priceTo', () => {
			const queryStringParameters = {
				type: 'burger',
				priceFrom: '15',
				priceTo: '5',
				isPromotion: 'true',
				orderBy: 'name',
				orderDirection: 'asc'
			};

			const result = validateQueryStringParameters(queryStringParameters);

			expect(result).toEqual(Response.badRequest('priceFrom must be smaller than priceTo'));
		});

		it('should allow valid numbers with one comma or one dot', () => {
			const validParams = {
				priceFrom: '1,000',
				priceTo: '1.5',
			};
			const result = validateQueryStringParameters(validParams);
			expect(result).toBeNull();
		});

		it('should reject numbers in scientific notation', () => {
			const invalidParams = {
				priceFrom: '1e10',
				priceTo: '2e5',
			};
			const result = validateQueryStringParameters(invalidParams);
			expect(result.statusCode).toBe(400);
			expect(result.body).toContain('priceFrom must be a valid number');
		});

		it('should reject numbers with mathematical operators', () => {
			const invalidParams = {
				priceFrom: '123+4',
				priceTo: '5-6',
			};
			const result = validateQueryStringParameters(invalidParams);
			expect(result.statusCode).toBe(400);
			expect(result.body).toContain('priceFrom must be a valid number');
		});

		it('should reject numbers with trailing dot or comma', () => {
			const invalidParams = {
				priceFrom: '1.',
				priceTo: ',2',
			};
			const result = validateQueryStringParameters(invalidParams);
			expect(result.statusCode).toBe(400);
			expect(result.body).toContain('priceFrom must be a valid number');
		});
	});

	describe('isPromotion', () => {
		it('should return Response.badRequest with error message if isPromotion parameter is invalid', () => {
			const queryStringParameters = {
				type: 'burger',
				priceFrom: '5',
				priceTo: '15',
				isPromotion: 'invalid',
				orderBy: 'name',
				orderDirection: 'asc'
			};

			const result = validateQueryStringParameters(queryStringParameters);

			expect(result).toEqual(Response.badRequest('Invalid isPromotion parameter'));
		});
	});

	describe('orderBy', () => {
		it('should return Response.badRequest with error message if orderBy parameter is invalid', () => {
			const queryStringParameters = {
				type: 'burger',
				priceFrom: '5',
				priceTo: '15',
				isPromotion: 'true',
				orderBy: 'invalid',
				orderDirection: 'asc'
			};

			const result = validateQueryStringParameters(queryStringParameters);

			expect(result).toEqual(Response.badRequest('Invalid orderBy parameter'));
		});
	});

	describe('orderDirection', () => {
		it('should return Response.badRequest with error message if orderDirection parameter is invalid', () => {
			const queryStringParameters = {
				type: 'burger',
				priceFrom: '5',
				priceTo: '15',
				isPromotion: 'true',
				orderBy: 'name',
				orderDirection: 'invalid'
			};
			const result = validateQueryStringParameters(queryStringParameters);

			expect(result).toEqual(Response.badRequest('Invalid orderDirection parameter'));
		});
	});
});
