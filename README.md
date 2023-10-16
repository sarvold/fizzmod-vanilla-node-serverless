<h1 align="center"> <img height="48" src="https://avatars0.githubusercontent.com/u/56369819?s=200&v=4"> Fizzmod Challenge <img height="48" src="https://avatars3.githubusercontent.com/u/49998302?s=200&v=4"> </h1>

## Serverless burgers

This is a Node serverless app that has CRUD operations on menu products.

## How to start it locally

Should be as easy as running `docker-compose up`, which starts a container for the node serverless app, and another one for the mongoDb

## Observations

- It was intentional the use of CommonJs modules for compatibility and performance reasons, since CommonJs modules run synchronously whereas ES6 modules do not.
- Just a limited amount of libraries is being used, also intentionally, in order not to grow the node_modules folder too much, which may affect when used in serverless environment.
- No Typescript has been used (which I love), in relation to the above.
- It is open for extension by adding new functions to the serverless.yml and adding the respective files. In this case, they can be grouped by concern (as done with `products` could be done with, say `waiters`, or `usual-customers`) inside the `src/handlers` folder.
- It is also not necessary to modify any of the existing .js files in order scale it up, as they have single responsibiity.
- Features such as validation for request bodies can be added in the `src/dto` folder, following a standard pattern as when using NestJs with some validation libraries.
- By default, latest versions of serverless-offline add a `/local/` prefix to the endpoints, which I chose to keep here. This can be modified in by adding the `--prefix` option to the start script. Also latest versions use port 3000 as default, opposed to older versions which use 4000. Here I chose to use good old port 4000 with the option `--httpPort`.

## Endpoints

When starting the app, these endpoints should be exposed:

```
   ┌───────────────────────────────────────────────────────────────────────────────────┐
   │                                                                                   │
   │   POST   | http://localhost:4000/local/products      // Creates a product         │
   │   GET    | http://localhost:4000/local/products/{id} // Search product by id      │
   │   PUT    | http://localhost:4000/local/products/{id} // Update product            │
   │   DELETE | http://localhost:4000/local/products/{id} // Delete product            │
   │   GET    | http://localhost:4000/local/products      // Get list of products      │
   │                                                                                   │
   └───────────────────────────────────────────────────────────────────────────────────┘

```

## Scripts

### serverless-offline

It can be run standalone locally as long as you keep the mongo Container up and running (will be running if `docker-compose up` was run). In this case remember to stop the node serverless container that was started together. Simply run `npm start` and the app should be up and running, and since the mongo image exposes the port, the mongo container should be accessible this way too.

### Lint

`npm run lint`

### Unit tests

`npm run test`

### E2E test

`npm run test:e2e`

