'use strict';

const Response = require('../../http/response');
const Database = require('../../db/database');
const validateCreateProduct = require('../../dto/createProduct.dto');

exports.handler = async event => {
	try {
		const product = JSON.parse(event.body);
		const validationErrors = validateCreateProduct(product);
		if(validationErrors.length > 0) {
			const result = Response.badRequest(`Bad request. Invalid data. Errors: ${validationErrors.join(', ')}`);
			return result;
		}

		// Proceed with the validated data
		const database = new Database();
		const db = await database.connect();

		// Add dateCreated and status fields
		const productWithUniqueIngredients = {
			...product,
			ingredients: [...new Set(product.ingredients)],
			dateCreated: new Date(),
			status: 'active'
		};
		const result = await db.collection('products').insertOne(productWithUniqueIngredients);
		return Response.created({ _id: result.insertedId });
	} catch(err) {
		return Response.error(err.message || 'An error occurred while creating the product', err.status || 500);
	}
};
