const { importSchema } = require('graphql-import');
const resolvers = require('../controllers');
const typeDefs = importSchema('graphql/schema.graphql');

module.exports = {
    resolvers,
    typeDefs
}