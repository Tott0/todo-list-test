import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import dotenv from 'dotenv';

import { typeDefs, resolvers } from './graphql/schemas/todoItems';

dotenv.config();

async function startApolloServer() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () => {
    console.log(`🚀  Server ready at ${server.graphqlPath}`);
  });
}
startApolloServer();
