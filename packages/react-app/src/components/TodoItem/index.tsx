import { Flex, HStack, Link, VStack } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

import { AddTodoItem } from './AddTodoItem';
import { TodoItemList } from './TodoItemList';

export const TodoItemPage = () => {
  return (
    <VStack className="App" w="100%" h="100vh" bg="gray.50">
      <HStack
        as="header"
        w="100%"
        borderBottom="1px"
        borderColor="gray.300"
        p={4}
      >
        <Flex align="center" as="nav">
          <Link
            fontSize="xl"
            fontWeight="semibold"
            href="/todo-list"
            _hover={{ textDecoration: 'none' }}
          >
            <CheckIcon mr={2} color="green.700" w={6} h={6} />
            Todo List
          </Link>
        </Flex>
      </HStack>

      <VStack h="100%" spacing={4}>
        <TodoItemList />

        <AddTodoItem />
      </VStack>
    </VStack>
  );
};
