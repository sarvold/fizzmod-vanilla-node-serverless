'use strict';

/**
 * Remove this file when you don't need it any more
 */

module.exports.handler = async event => {

	return {
		statusCode: 200,
		body: JSON.stringify({
			...event,
			apiName: 'POST-Example'
		})
	};

};
