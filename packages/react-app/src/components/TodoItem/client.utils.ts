import { gql, useMutation, useQuery } from '@apollo/client';

import {
  TodoItemData,
  CreateTodoItemArgs,
  ConnectionPageInfoData,
} from '@todo-list/graphql-server/graphql/schemas';

const TODO_ITEM_FRAGMENT = gql`
  fragment TodoItemProps on TodoItem {
    id
    title
    isComplete
  }
`;

const TODO_ITEMS_QUERY = gql`
  ${TODO_ITEM_FRAGMENT}
  query todoItems($skip: Int, $take: Int) {
    todoItems(skip: $skip, take: $take) {
      nodes {
        ...TodoItemProps
      }
      pageInfo {
        nextSkip
        hasNextPage
        totalCount
      }
    }
  }
`;

interface TodoItemsData {
  todoItems: {
    nodes: TodoItemData[];
    pageInfo: ConnectionPageInfoData;
  };
}
const PAGE_SIZE = 5;
export function useTodoItemsQuery() {
  const { data, ...other } = useQuery<TodoItemsData>(TODO_ITEMS_QUERY, {
    variables: {
      skip: 0,
      take: PAGE_SIZE,
    },
  });

  return {
    todoItems: data?.todoItems.nodes,
    pageInfo: data?.todoItems.pageInfo,
    ...other,
  };
}

// ---------

const ADD_TODO_ITEM_MUTATION = gql`
  ${TODO_ITEM_FRAGMENT}
  mutation addTodoItem($title: String!) {
    addTodoItem(title: $title) {
      ...TodoItemProps
    }
  }
`;

export function useAddTodoItemMutation() {
  const [addTodoItem, mutationStatus] = useMutation<
    { addTodoItem: TodoItemData },
    CreateTodoItemArgs
  >(ADD_TODO_ITEM_MUTATION, {
    update(cache, { data }) {
      let todoItemData = data?.addTodoItem;
      if (!todoItemData) {
        return;
      }
      cache.modify({
        fields: {
          todoItems(existingItems = {}) {
            const newTodoRef = cache.writeFragment({
              data: todoItemData,
              fragment: TODO_ITEM_FRAGMENT,
            });
            return {
              nodes: [newTodoRef, ...existingItems?.nodes],
              pageInfo: {
                totalCount: existingItems?.pageInfo.totalCount + 1,
                nextSkip: existingItems?.pageInfo.nextSkip + 1,
                hasNextPage: existingItems?.pageInfo.hasNextPage,
              },
            };
          },
        },
      });
    },
  });

  return [addTodoItem, mutationStatus] as const;
}

const REMOVE_TODO_ITEM_MUTATION = gql`
  ${TODO_ITEM_FRAGMENT}
  mutation removeTodoItem($id: ID!) {
    removeTodoItem(id: $id) {
      ...TodoItemProps
    }
  }
`;

export function useRemoveTodoItemMutation() {
  const [removeTodoItem, mutationStatus] = useMutation<
    { removeTodoItem: TodoItemData },
    { id: number }
  >(REMOVE_TODO_ITEM_MUTATION, { refetchQueries: [TODO_ITEMS_QUERY] });

  return [removeTodoItem, mutationStatus] as const;
}

const TOGGLE_TODO_ITEM_COMPLETE_STATUS = gql`
  ${TODO_ITEM_FRAGMENT}
  mutation toggleTodoItemCompleteStatus($id: ID!) {
    toggleTodoItemCompleteStatus(id: $id) {
      ...TodoItemProps
    }
  }
`;

export function useToggleTodoItemCompleteStatusMutation() {
  const [toggleTodoItemCompleteStatus, mutationStatus] = useMutation<
    { toggleTodoItemCompleteStatus: TodoItemData },
    { id: number }
  >(TOGGLE_TODO_ITEM_COMPLETE_STATUS, {
    update(cache, { data }) {
      let todoItemData = data?.toggleTodoItemCompleteStatus;
      if (!todoItemData) {
        return;
      }
      cache.modify({
        fields: {
          todoItems(existingItems = {}) {
            const newTodoRef = cache.writeFragment({
              data: todoItemData,
              fragment: TODO_ITEM_FRAGMENT,
            });
            let i = 0;
            while (i < existingItems?.nodes.length) {
              const node = existingItems?.nodes[i];
              if (node?.id === todoItemData?.id) {
                existingItems.nodes[i] = newTodoRef;
                break;
              }
              i++;
            }
            return existingItems;
          },
        },
      });
    },
  });

  return [toggleTodoItemCompleteStatus, mutationStatus] as const;
}
