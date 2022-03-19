import React from 'react';
import { useTodoItemsQuery } from './client.utils';

export const TodoItemPage = () => {
  const { todoItems } = useTodoItemsQuery();
  console.log(todoItems);
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};
