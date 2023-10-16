'use strict';

const buildSort = (orderBy, orderDirection) => {
	const sort = {};
	if(orderBy && ['name', 'price', 'type', 'discount'].includes(orderBy))
		sort[orderBy] = orderDirection === 'desc' ? -1 : 1;

	return sort;
};

module.exports = buildSort;
