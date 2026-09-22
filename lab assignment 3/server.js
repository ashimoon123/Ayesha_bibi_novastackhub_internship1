const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middleware/errorHandler');
const { schema, root } = require('./graphql/schema');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// --- REST API Endpoints ---
// Mounting the product routes under the standardized /api/v1 prefix
app.use('/api/v1/products', productRoutes);

// --- GraphQL Endpoint ---
// Solution to Over-fetching
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Enables the GraphiQL IDE to test queries easily
}));

// --- 404 Route Not Found Handler ---
app.use((req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found`);
    error.statusCode = 404;
    error.errorCode = "ROUTE_NOT_FOUND";
    next(error);
});

// --- Global Error Handler ---
// Centralized error handling providing standardized JSON schema
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`- REST API available at: http://localhost:${PORT}/api/v1/products`);
    console.log(`- GraphQL available at: http://localhost:${PORT}/graphql`);
});
