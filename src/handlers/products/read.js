'use strict';

const { ObjectId } = require('mongodb');
const Database = require('../../db/database');
const Response = require('../../http/response');

exports.handler = async event => {
	try {
		const database = new Database();
		const db = await database.connect();
		const product = await db.collection('products').findOne({ _id: new ObjectId(event.pathParameters.id) });
		if(!product)
			return Response.notFound(`Unable to find product with id ${event.pathParameters.id}`);

		return Response.success(product);
	} catch(_err) {
		return Response.error('An error occurred while fetching the product');
	}
};
