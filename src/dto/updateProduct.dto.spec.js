'use strict';

const validateUpdateProduct = require('./updateProduct.dto');

describe('validateUpdateProduct', () => {
	it('should return an empty array for a valid product update', () => {
		const product = {
			name: 'Burger',
			type: 'burger',
			price: 12,
			image: 'burger.jpg',
			isPromotion: true,
			discount: 10,
			ingredients: ['bread', 'patty', 'cheese'],
			status: 'active'
		};

		const errors = validateUpdateProduct(product);

		expect(errors).toEqual([]);
	});

	it('should return an array of errors for an invalid product update', () => {
		const product = {
			name: 123,
			type: 'pizza',
			price: -5,
			image: 123,
			isPromotion: 'yes',
			discount: 101,
			ingredients: [],
			status: 'invalid'
		};

		const errors = validateUpdateProduct(product);

		expect(errors).toEqual([
			'Name must be a string.',
			'Type must be one of: burger, condiments, snacks, drinks.',
			'Price must be a non-negative number.',
			'Image must be a string.',
			'isPromotion must be a boolean.',
			'Discount must be a number between 0 and 100 and is required when isPromotion is true.',
			'Ingredients must be a non-empty array.',
			'Status must be either "active" or "inactive".'
		]);
	});
});
