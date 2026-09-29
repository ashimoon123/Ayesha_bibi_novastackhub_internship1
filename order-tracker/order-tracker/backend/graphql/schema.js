const { buildSchema } = require('graphql');
const store = require('../data/store');

// Schema definition
const schema = buildSchema(`
  type OrderHistory {
    status: String!
    at: Float!
  }

  type Order {
    id: String!
    customerName: String!
    item: String!
    status: String!
    createdAt: Float!
    updatedAt: Float!
    history: [OrderHistory!]!
  }

  type CatalogItem {
    sku: String!
    name: String!
    price: Float!
  }

  type Query {
    listOrders: [Order!]!
    getOrder(id: String!): Order
    catalog: [CatalogItem!]!
  }

  type Mutation {
    createOrder(customerName: String!, item: String!): Order
    updateStatus(id: String!, status: String!): Order
    cancelOrder(id: String!): Order
  }
`);

// Resolvers
const rootValue = {
  listOrders: () => store.listOrders(),
  getOrder: ({ id }) => store.getOrder(id),
  catalog: () => store.catalog,
  createOrder: ({ customerName, item }) => store.createOrder({ customerName, item }),
  updateStatus: ({ id, status }) => {
    const result = store.updateStatus(id, status);
    if (result.error) throw new Error(result.error);
    return result.order;
  },
  cancelOrder: ({ id }) => {
    const result = store.cancelOrder(id);
    if (result.error) throw new Error(result.error);
    return result.order;
  }
};

module.exports = { schema, rootValue };
