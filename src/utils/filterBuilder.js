'use strict';

const buildFilter = (name, type, priceFrom, priceTo, isPromotion) => {
	const filter = {};
	if(name)
		filter.name = { $regex: name, $options: 'i' };

	if(type)
		filter.type = type;

	if(priceFrom)
		filter.price = { $gt: parseFloat(priceFrom) };

	if(priceTo)
		filter.price = { ...filter.price, $lt: parseFloat(priceTo) };

	if(isPromotion === '1' || isPromotion === '0')
		filter.isPromotion = isPromotion === '1';

	return filter;
};

module.exports = buildFilter;
