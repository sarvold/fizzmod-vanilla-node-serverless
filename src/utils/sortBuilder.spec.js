'use strict';

const buildSort = require('./sortBuilder');

describe('buildSort', () => {
    it('should return an empty object when no sort key is provided', () => {
        const sort = buildSort();
        expect(sort).toEqual({});
    });

    it('should build the sort object correctly when a valid sort key is provided', () => {
        const sort = buildSort('name');
        expect(sort).toEqual({ name: 1 });
    });

    it('should build the sort object correctly when a valid sort key and direction are provided', () => {
        const sort = buildSort('price', 'desc');
        expect(sort).toEqual({ price: -1 });
    });

    it('should ignore invalid sort keys and return an empty object', () => {
        const sort = buildSort('invalid');
        expect(sort).toEqual({});
    });

    it('should ignore invalid sort directions and default to ascending order', () => {
        const sort = buildSort('name', 'invalid');
        expect(sort).toEqual({ name: 1 });
    });
});