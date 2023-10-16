'use strict';

class Response {
	constructor(statusCode, body) {
		this.statusCode = statusCode;
		this.body = JSON.stringify(body);
	}

	static success(body) {
		return new Response(200, body);
	}

	static created(body) {
		return new Response(201, body);
	}

	static badRequest(message = 'Bad Request', statusCode = 400) {
		return new Response(statusCode, { message });
	}

	static notFound(message = 'Not Found', statusCode = 404) {
		return new Response(statusCode, { message });
	}

	static error(message = 'Internal Server Error', statusCode = 500) {
		return new Response(statusCode, { message });
	}
}

module.exports = Response;
