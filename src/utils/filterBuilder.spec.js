'use strict';

const buildFilter = require('./filterBuilder');

describe('buildFilter', () => {
	it('should return an empty object when no parameters are provided', () => {
		const filter = buildFilter();
		expect(filter).toEqual({});
	});

	it('should build the filter correctly when all parameters are provided', () => {
		const filter = buildFilter('burger', 'food', '5', '10', '1');
		expect(filter).toEqual({
			name: { $regex: 'burger', $options: 'i' },
			type: 'food',
			price: { $gt: 5, $lt: 10 },
			isPromotion: true
		});
	});

	it('should build the filter correctly when only some parameters are provided', () => {
		const filter = buildFilter('pizza', null, '0', null, '0');
		expect(filter).toEqual({
			name: { $regex: 'pizza', $options: 'i' },
			price: { $gt: 0 },
			isPromotion: false
		});
	});

	it('should build the filter correctly when only the name parameter is provided', () => {
		const filter = buildFilter('pasta');
		expect(filter).toEqual({
			name: { $regex: 'pasta', $options: 'i' }
		});
	});

	it('should build the filter correctly when only the type parameter is provided', () => {
		const filter = buildFilter(null, 'drink');
		expect(filter).toEqual({
			type: 'drink'
		});
	});

	it('should build the filter correctly when only the priceFrom parameter is provided', () => {
		const filter = buildFilter(null, null, '2');
		expect(filter).toEqual({
			price: { $gt: 2 }
		});
	});

	it('should build the filter correctly when only the priceTo parameter is provided', () => {
		const filter = buildFilter(null, null, null, '15');
		expect(filter).toEqual({
			price: { $lt: 15 }
		});
	});

	it('should build the filter correctly when the isPromotion parameter is "1"', () => {
		const filter = buildFilter(null, null, null, null, '1');
		expect(filter).toEqual({
			isPromotion: true
		});
	});

	it('should build the filter correctly when the isPromotion parameter is "0"', () => {
		const filter = buildFilter(null, null, null, null, '0');
		expect(filter).toEqual({
			isPromotion: false
		});
	});

	it('should ignore invalid isPromotion values and not include it in the filter', () => {
		const filter = buildFilter(null, null, null, null, 'invalid');
		expect(filter).toEqual({});
	});
});
