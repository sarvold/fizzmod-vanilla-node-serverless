'use strict';

const http = require('http');

let productId;

describe('Test products CRUD', () => {
  it('should create a product', (done) => { // Add the 'done' parameter
    const request = http.request({
      method: 'POST',
      hostname: 'localhost',
      port: 4000, // or 3000?
      path: '/test/products',
      headers: {
        'Content-Type': 'application/json'
      }
    }, (response) => {
      let responseBody = '';
      response.on('data', (chunk) => {
        responseBody += chunk;
      });
      response.on('end', () => {
        expect(response.statusCode).toBe(201);
        expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
        // verify response body contains the product id
        expect(JSON.parse(responseBody)._id).toBeDefined();
        // store id in variable to be used in the next tests
        productId = JSON.parse(responseBody)._id;

        done();
      });
    });

    const product = {
      name: 'Messi special vegan burger',
      type: 'burger',
      price: 10,
      ingredients: [
        'Bread',
        'Avocado',
        'Tofu milanesa'
      ]
    };

    request.write(JSON.stringify(product));
    request.end();
  });

  it('should fetch the list of all products', (done) => {
    const request = http.request({
      method: 'GET',
      hostname: 'localhost',
      port: 4000, // or 3000?
      path: '/test/products',
      headers: {
        'Content-Type': 'application/json'
      }
    }, (response) => {
      let responseBody = '';
      response.on('data', (chunk) => {
        responseBody += chunk;
      });
      response.on('end', () => {
        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
        // verify that the response body is an array of products
        expect(Array.isArray(JSON.parse(responseBody))).toBe(true);

        console.log('JSON.parse(responseBody): --> ', JSON.parse(responseBody))
        done();
      });
    });
  
    request.end();
  });
});