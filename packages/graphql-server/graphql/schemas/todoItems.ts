import { PrismaClient, TodoItem } from '@prisma/client';
import { gql, ApolloError } from 'apollo-server-express';
import { GraphQLFieldResolver } from 'graphql';

const prisma = new PrismaClient();

export interface TodoItemData {
  id: number;
  title: string;
  isComplete: boolean;
}

export interface ConnectionPageInfoData {
  nextSkip: number;
  hasNextPage: boolean;
  totalCount: number;
}

export const typeDefs = gql`
  type TodoItem {
    id: ID
    title: String
    isComplete: Boolean
  }

  type PageInfo {
    nextSkip: Int
    totalCount: Int
    hasNextPage: Boolean
  }

  type TodoItemConnection {
    nodes: [TodoItem!]
    pageInfo: PageInfo!
  }

  type Query {
    todoItems(skip: Int, take: Int): TodoItemConnection!
  }

  type Mutation {
    addTodoItem(title: String!): TodoItem!
    removeTodoItem(id: ID!): TodoItem!
    toggleTodoItemCompleteStatus(id: ID!): TodoItem!
  }
`;

const queryResolvers: {
  [key: string]: GraphQLFieldResolver<null, null>;
} = {
  todoItems: async (parents, args: { skip: number; take: number }) => {
    const totalCount = await prisma.todoItem.count();
    return {
      nodes: await prisma.todoItem.findMany({
        skip: args.skip,
        take: args.take,
        orderBy: [{ createdAt: 'desc' }],
      }),
      pageInfo: {
        nextSkip: args.skip + args.take,
        hasNextPage: args.skip + args.take < totalCount,
        totalCount,
      },
    };
  },
};

export interface CreateTodoItemArgs {
  title: string;
}

const mutationResolvers: {
  [key: string]: GraphQLFieldResolver<null, null>;
} = {
  addTodoItem: async (parents, args: CreateTodoItemArgs) => {
    return await prisma.todoItem.create({
      data: {
        ...args,
      },
    });
  },
  removeTodoItem: async (parents, args: { id: number }) => {
    return await prisma.todoItem.delete({
      where: {
        id: +args.id,
      },
    });
  },
  toggleTodoItemCompleteStatus: async (parents, args: { id: number }) => {
    const todoItem = await prisma.todoItem.findFirst({
      where: { id: +args.id },
    });
    if (!todoItem) {
      throw new ApolloError('Todo Item does not exist');
    }
    return await prisma.todoItem.update({
      where: {
        id: todoItem.id,
      },
      data: {
        isComplete: !todoItem.isComplete,
      },
    });
  },
};

export const resolvers = {
  Query: { ...queryResolvers },
  Mutation: { ...mutationResolvers },
};
