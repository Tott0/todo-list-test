import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_HOST_URL}/graphql`,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          todoItems: {
            keyArgs: false,
            merge: (existing = { nodes: [] }, incoming, { args }) => {
              const merged = existing?.nodes?.slice(0) || [];
              for (let i = 0; i < incoming?.nodes.length; ++i) {
                merged[args?.skip + i] = incoming?.nodes[i];
              }

              return {
                nodes: merged,
                pageInfo: incoming.pageInfo,
              };
            },
          },
        },
      },
    },
  }),
});

export default client;
