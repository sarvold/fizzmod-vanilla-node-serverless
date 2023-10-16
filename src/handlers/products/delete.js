'use strict';

const { ObjectId } = require('mongodb');
const Database = require('../../db/database');
const Response = require('../../http/response');

exports.handler = async event => {
	try {
		const database = new Database();
		const db = await database.connect();
		const result = await db.collection('products').findOneAndDelete({ _id: new ObjectId(event.pathParameters.id) });
		if(!result)
			return Response.notFound(`Unable to delete: product ${event.pathParameters.id} not found`);

		return Response.success({ message: `Product ${event.pathParameters.id} deleted successfully`, deletedProduct: result });
	} catch(_err) {
		return Response.error(`An error occurred while deleting product ${event.pathParameters.id}`);
	}
};
