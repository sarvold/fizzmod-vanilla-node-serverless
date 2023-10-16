'use strict';

const { ObjectId } = require('mongodb');
const Database = require('../../db/database');
const Response = require('../../http/response');
const validateUpdateProduct = require('../../dto/updateProduct.dto');

exports.handler = async event => {
	try {
		const product = JSON.parse(event.body);
		// For cases where validation was more complex and we needed to check if the product will be valid after updated, we would need to find it first.
		// But here it we don't strictly need it "thus far".
		const validationErrors = validateUpdateProduct(product);
		if(validationErrors.length > 0)
			return Response.badRequest(`Bad request. Invalid data. Errors: ${validationErrors.join(', ')}`);

		const database = new Database();
		const db = await database.connect();
		// Ensure unique ingredients and add dateModified
		const updatedProduct = {
			...product,
			ingredients: [...new Set(product.ingredients)],
			dateModified: new Date()
		};
		const result = await db.collection('products').updateOne({ _id: new ObjectId(event.pathParameters.id) }, { $set: updatedProduct });
		if(result.matchedCount === 0)
			return Response.notFound('Unable to update: product not found.');

		return Response.success({ _id: event.pathParameters.id });
	} catch(err) {
		return Response.error(err.message || 'An error occurred while updating the product', err.status || 500);
	}
};
