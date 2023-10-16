'use strict';

const { MongoClient } = require('mongodb');
const { MONGODB_URI } = require('../../config.json');

class Database {
	constructor() {
		this.db = null;
	}

	/**
	 * Connects to the database and returns the database object.
	 *
	 * @return {Promise<Db>} The database object.
	 */
	async connect() {
		if(this.db)
			return this.db;

		const uri = MONGODB_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/fizz-burger';
		const client = new MongoClient(uri);
		await client.connect();
		this.db = client.db('test');
		return this.db;
	}
}

module.exports = Database;
