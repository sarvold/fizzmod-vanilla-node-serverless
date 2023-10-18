'use strict';

const Response = require('../http/response');
const validProductTypes = require('../models/validProductTypes');

const validateQueryStringParameters = queryStringParameters => {
	const numberRegex = /^\d+([.,]\d+)?$/;
	const validOrderByValues = ['name', 'price', 'type', 'discount'];
	const validOrderDirectionValues = ['asc', 'desc'];
	const validIsPromotionValues = ['true', 'false', '1', '0'];

	const {
		type, priceFrom, priceTo, isPromotion, orderBy, orderDirection
	} = queryStringParameters;

	const errors = [];

	// Validate type
	if(type && !validProductTypes.includes(type))
		errors.push('Invalid type parameter');

	// Validate priceFrom and priceTo
	if(priceFrom && !numberRegex.test(priceFrom))
		errors.push('priceFrom must be a valid number');

	if(priceTo && !numberRegex.test(priceTo))
		errors.push('priceTo must be a valid number');

	if(priceFrom && priceTo && Number(priceFrom) >= Number(priceTo))
		errors.push('priceFrom must be smaller than priceTo');

	// Validate isPromotion
	if(isPromotion && !validIsPromotionValues.includes(isPromotion))
		errors.push('Invalid isPromotion parameter');

	// Validate orderBy
	if(orderBy && !validOrderByValues.includes(orderBy))
		errors.push('Invalid orderBy parameter');

	// Validate orderDirection
	if(orderDirection && !validOrderDirectionValues.includes(orderDirection))
		errors.push('Invalid orderDirection parameter');

	if(errors.length > 0)
		return Response.badRequest(errors.join(', '));

	return null;
};

module.exports = validateQueryStringParameters;
