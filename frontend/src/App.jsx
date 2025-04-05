import { useState } from 'react';
import FadeLoader from 'react-spinners/FadeLoader';
import toast, { Toaster } from 'react-hot-toast';
import useFetch from './hooks/useFetch';
import TodoItem from './components/TodoItem';

import './App.css';

function App() {
  const [todoName, setTodoName] = useState('');
  const { data, loading, error, refetch } = useFetch(
    'http://localhost:3000/todos'
  );

  const handleTodoName = ({ target: { value } }) => setTodoName(value);

  const handleSaveTodo = async () => {
    if (todoName) {
      try {
        const response = await fetch('http://localhost:3000/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: todoName }),
        });

        if (!response.ok) {
          throw new Error(`Failed to create todo: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Todo created:', result);
        refetch();
        toast.success('Todo added!');
      } catch (error) {
        console.error('❌ Error creating todo:', error.message);
        toast.error('Failed to add todo');
      }
    }
  };

  const handleDoneItem = async (id, name, isDone) => {
    console.log({ id, name });
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, isDone: !isDone }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create todo: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Todo updated:', result);
      refetch();
      toast.success('Todo updated!');
    } catch (error) {
      console.error('❌ Error creating todo:', error.message);
      toast.error('Failed to update todo');
    }
  };

  const handleRemoveTodo = async (id) => {
    console.log('delete this one!!');
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to create todo: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Todo deleted:', result);
      refetch();
      toast.success('Todo deleted!');
    } catch (error) {
      console.error('❌ Error creating todo:', error.message);
      toast.error('Failed to delete todo');
    }
  };

  return (
    <>
      <div className="h-100 w-full flex items-center justify-center bg-teal-lightest min-h-[80%] font-sans">
        <div className="bg-white rounded shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg">
          <div className="mb-4">
            <h1 className="text-lime-500 text-lg uppercase">Todo List 📝</h1>
            <div className="flex mt-4">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
                placeholder="Add Todo"
                onChange={handleTodoName}
                value={todoName}
              />
              <button
                className="bg-teal-500 flex-no-shrink p-2 border-2 rounded text-white border-teal hover:text-white hover:bg-teal"
                onClick={handleSaveTodo}
              >
                Add
              </button>
            </div>
          </div>

          {loading && <FadeLoader speedMultiplier={2} />}
          {error && <p className="text-red-500">Error loading users</p>}

          <div>
            {data &&
              data.todos.map(({ _id, name, isDone }) => (
                <TodoItem
                  key={_id}
                  id={_id}
                  onDoneClick={handleDoneItem}
                  onDeleteItem={handleRemoveTodo}
                  {...{
                    name,
                    isDone,
                  }}
                />
              ))}
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default App;
