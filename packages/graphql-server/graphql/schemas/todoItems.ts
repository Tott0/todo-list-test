import { PrismaClient, TodoItem } from '@prisma/client';
import { gql } from 'apollo-server-express';
import { GraphQLFieldResolver } from 'graphql';

const prisma = new PrismaClient();

export interface TodoItemData {
  id: number;
  title: string;
}

export const typeDefs = gql`
  type TodoItem {
    id: ID
    title: String
  }

  type Query {
    todoItems: [TodoItem!]
  }

  type Mutation {
    addTodoItem(title: String!): TodoItem!
  }
`;

const todoItemResolver: {
  [key: string]: GraphQLFieldResolver<TodoItem, null>;
} = {
  id: (parent) => parent.id,
  title: (parent) => parent.title,
};

const queryResolvers: {
  [key: string]: GraphQLFieldResolver<null, null>;
} = {
  todoItems: () => {
    return prisma.todoItem.findMany();
  },
};

type CreateTodoItemArgs = {
  title: string;
};

const mutationResolvers: {
  [key: string]: GraphQLFieldResolver<null, null>;
} = {
  addTodoItem: (parents, args: CreateTodoItemArgs) => {
    return prisma.todoItem.create({
      data: {
        ...args,
      },
    });
  },
};

export const resolvers = {
  TodoItem: todoItemResolver,
  Query: { ...queryResolvers },
  Mutation: { ...mutationResolvers },
};
