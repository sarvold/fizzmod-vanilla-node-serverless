'use strict';

const validateUpdateProduct = product => {
	const errors = [];

	// Validation rules
	if(product.name && typeof product.name !== 'string')
		errors.push('Name must be a string.');

	if(product.type && !['burger', 'condiments', 'snacks', 'drinks'].includes(product.type))
		errors.push('Type must be one of: burger, condiments, snacks, drinks.');

	if(product.price && (typeof product.price !== 'number' || product.price < 0))
		errors.push('Price must be a non-negative number.');

	if(product.image && typeof product.image !== 'string')
		errors.push('Image must be a string.');

	if(product.isPromotion && typeof product.isPromotion !== 'boolean')
		errors.push('isPromotion must be a boolean.');

	if(product.isPromotion && (typeof product.discount !== 'number' || product.discount < 0 || product.discount > 100))
		errors.push('Discount must be a number between 0 and 100 and is required when isPromotion is true.');

	if(product.ingredients && (!Array.isArray(product.ingredients) || product.ingredients.length === 0))
		errors.push('Ingredients must be a non-empty array.');

	if(product.status && !['active', 'inactive'].includes(product.status))
		errors.push('Status must be either "active" or "inactive".');

	return errors;
};

module.exports = validateUpdateProduct;
