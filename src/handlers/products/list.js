'use strict';

const Response = require('../../http/response');
const Database = require('../../db/database');
const buildFilter = require('../../utils/filterBuilder');
const buildSort = require('../../utils/sortBuilder');

exports.handler = async event => {
	try {
		const database = new Database();
		const db = await database.connect();
		const collection = db.collection('products');
		if(!event.queryStringParameters) {
			const cursor = db.collection('products').find();
			const products = await cursor.toArray();
			return Response.success(products);
		}
		const {
			name, type, priceFrom, priceTo, isPromotion, orderBy, orderDirection
		} = event.queryStringParameters;

		const filter = buildFilter(name, type, priceFrom, priceTo, isPromotion);
		const sort = buildSort(orderBy, orderDirection);

		const filteredProducts = collection.find(filter);
		const cursor = filteredProducts.sort(sort);
		const products = await cursor.toArray();

		return Response.success(products);
	} catch(_err) {
		return Response.error('An error occurred while fetching products');
	}
};
