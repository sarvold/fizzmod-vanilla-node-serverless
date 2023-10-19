'use strict';

const { MongoClient } = require('mongodb');
const { MONGODB_URI } = require('../../config.json');
const { MongoMemoryServer } = require('mongodb-memory-server');

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
		try {
			if (this.db) {
				return this.db;
			}

			const useInMemoryDB = process.env.NODE_ENV === 'test';
			const uri = useInMemoryDB
				? await this.createInMemoryMongoUri()
				: MONGODB_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/fizz-burger';

			const client = new MongoClient(uri);
			await client.connect();
			this.db = client.db('fizz-burger-db');
			return this.db;
		} catch (error) {
			// Here we could perform some sort of logging
			throw error;
		}
	}

	async createInMemoryMongoUri() {
		const mongoServer = await MongoMemoryServer.create();
		return mongoServer.getUri();
	}
}

module.exports = Database;