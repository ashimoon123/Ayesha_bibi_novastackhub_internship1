const { buildSchema } = require('graphql');
const products = require('../data/products');

// Define GraphQL schema
const schema = buildSchema(`
    type Product {
        id: Int!
        title: String!
        price: Float!
        category: String
        description: String
        stock: Int
    }

    type Query {
        product(id: Int!): Product
        products(category: String, limit: Int): [Product]
    }
`);

// Define root resolvers
const root = {
    product: ({ id }) => {
        return products.find(p => p.id === id);
    },
    products: ({ category, limit }) => {
        let result = products;
        if (category) {
            result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }
        if (limit) {
            result = result.slice(0, limit);
        }
        return result;
    }
};

module.exports = { schema, root };
