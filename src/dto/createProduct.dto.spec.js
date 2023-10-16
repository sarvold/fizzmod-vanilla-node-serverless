'use strict';

const validateCreateProduct = require('./createProduct.dto');

describe('validateCreateProduct', () => {
	it('should return an empty array for a valid product', () => {
		const product = {
			name: 'Burger',
			type: 'burger',
			price: 10,
			image: 'burger.jpg',
			isPromotion: false,
			ingredients: ['bread', 'patty', 'cheese']
		};

		const errors = validateCreateProduct(product);

		expect(errors).toEqual([]);
	});

	it('should return an array of errors for an invalid product', () => {
		const product = {
			name: 123,
			type: 'pizza',
			price: -5,
			image: 123,
			isPromotion: 'yes',
			ingredients: []
		};

		const errors = validateCreateProduct(product);

		expect(errors).toEqual([
			'Name is required and must be a string.',
			'Type is required and must be one of: burger, condiments, snacks, drinks.',
			'Price is required and must be a non-negative number.',
			'Image is required and must be a string.',
			'isPromotion must be a boolean.',
			'Ingredients is required and must be a non-empty array.'
		]);
	});
});
