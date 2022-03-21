import React from 'react';
import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  IconButton,
  Spacer,
  Text,
  useStyleConfig,
  VStack,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

import {
  useRemoveTodoItemMutation,
  useTodoItemsQuery,
  useToggleTodoItemCompleteStatusMutation,
} from './client.utils';

export const TodoItemList = () => {
  const { todoItems, pageInfo, fetchMore } = useTodoItemsQuery();
  const styles = useStyleConfig('MainCard');

  console.log(todoItems, pageInfo);

  const [removeTodoItem] = useRemoveTodoItemMutation();
  const onDeleteClick = (todoItemId: number) => {
    removeTodoItem({
      variables: {
        id: todoItemId,
      },
    });
  };

  const [toggleTodoItemCompleteStatus] =
    useToggleTodoItemCompleteStatusMutation();
  const onCompleteChange = (todoItemId: number) => {
    toggleTodoItemCompleteStatus({
      variables: {
        id: todoItemId,
      },
    });
  };

  const onLoadMoreClick = () => {
    fetchMore({
      variables: {
        skip: pageInfo?.nextSkip,
      },
    });
  };

  return (
    <Box __css={styles} mt={8}>
      <VStack align="start" spacing={1}>
        {todoItems?.map(item => {
          return (
            <Flex
              p={1}
              key={item.id}
              w="100%"
              _hover={{ bg: 'gray.50' }}
              role="group"
            >
              <Checkbox
                mr={2}
                isChecked={item.isComplete}
                onChange={ev => onCompleteChange(item.id)}
              />
              <Text
                fontSize="md"
                as={item.isComplete ? 'del' : 'p'}
                color={item.isComplete ? 'gray.500' : 'black'}
              >
                {item.title}
              </Text>

              <Spacer />

              <IconButton
                aria-label="Remove Todo Item"
                icon={<DeleteIcon />}
                colorScheme="red"
                size="xs"
                variant="ghost"
                display="none"
                _groupHover={{
                  display: 'inline-flex',
                }}
                onClick={ev => onDeleteClick(item.id)}
              />
            </Flex>
          );
        })}
        {pageInfo?.hasNextPage && (
          <Center w="100%">
            <Button mt={2} onClick={onLoadMoreClick} variant="link">
              Load More...
            </Button>
          </Center>
        )}
      </VStack>
    </Box>
  );
};
