import { gql, useQuery } from '@apollo/client';

import { TodoItemData } from '@todo-list/graphql-server/graphql/schemas';

const TODO_ITEMS_QUERY = gql`
  query todoItems {
    todoItems {
      id
      title
    }
  }
`;

interface TodoItemsData {
  todoItems: TodoItemData[];
}
export function useTodoItemsQuery() {
  const { data, ...other } = useQuery<TodoItemsData>(TODO_ITEMS_QUERY);

  return {
    todoItems: data?.todoItems,
    ...other,
  };
}
