'use strict';

const validateCreateProduct = product => {
	const errors = [];

	// Validation rules
	if(!product.name || typeof product.name !== 'string')
		errors.push('Name is required and must be a string.');

	if(!product.type || !['burger', 'condiments', 'snacks', 'drinks'].includes(product.type))
		errors.push('Type is required and must be one of: burger, condiments, snacks, drinks.');

	if(typeof product.price !== 'number' || product.price < 0)
		errors.push('Price is required and must be a non-negative number.');

	if(product.image && typeof product.image !== 'string')
		errors.push('Image is required and must be a string.');

	if(product.isPromotion !== undefined && typeof product.isPromotion !== 'boolean')
		errors.push('isPromotion must be a boolean.');

	if(product.isPromotion === true && (typeof product.discount !== 'number' || product.discount < 0 || product.discount > 100))
		errors.push('Discount is required when it is a promotion, and must be a number between 0 and 100 when isPromotion is true.');

	if(!Array.isArray(product.ingredients) || product.ingredients.length === 0)
		errors.push('Ingredients is required and must be a non-empty array.');

	return errors;
};

module.exports = validateCreateProduct;
