'use strict';

const buildFilter = (name, type, priceFrom, priceTo, isPromotion) => {
	const filter = {};

	if(name)
		filter.name = { $options: 'i', $regex: name };

	if(type)
		filter.type = type.toLowerCase();

	if(priceFrom || priceTo) {
		filter.price = {};
		if(priceFrom)
			filter.price.$gt = Number(priceFrom);

		if(priceTo)
			filter.price.$lt = Number(priceTo);

	}
	if(isPromotion === '1' || isPromotion === '0' || isPromotion === 'true' || isPromotion === 'false')
		filter.isPromotion = isPromotion === '1' || isPromotion === 'true';

	return filter;
};

module.exports = buildFilter;
