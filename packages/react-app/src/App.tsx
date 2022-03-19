import { ChakraProvider } from '@chakra-ui/react';
import theme from './chakra.theme';
import { ApolloProvider } from '@apollo/client';
import client from './utils/ApolloClient';
import { TodoItemPage } from './components/TodoItem';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ApolloProvider client={client}>
        <TodoItemPage />
      </ApolloProvider>
    </ChakraProvider>
  );
}

export default App;
