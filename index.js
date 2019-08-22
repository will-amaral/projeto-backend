// Declare all the middleware variables
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const { typeDefs, resolvers } = require('./graphql');
const server = new ApolloServer({ typeDefs, resolvers });
// Mongo Database Configuration
const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, { useNewUrlParser: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));
db.once('open', () => console.log('📂 Conectado ao banco!'));
// Initiate server
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});