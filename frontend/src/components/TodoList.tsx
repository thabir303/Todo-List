import { useEffect, useState } from "react";
import type Todo from "../types/todo";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../api/todoApi";

export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]> ([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null> (null);
  const [editingTodo, setEditingTodo] =useState<Todo | null> (null);

  const loadTodos = async () => {
    try{
      setLoading(true);
      setError(null);
      const data = await fetchTodos();
      setTodos(data);

    }
    catch(error){
      setError('Failed to load todos');
    }
    finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadTodos();
  }, []);

  const handleCreate = async (data : {title: string; description: string}) => {
    try{
      setError(null);
      const newTodo = await createTodo ({
        title: data.title,
        description: data.description,
        completed: false,
      });
      setTodos((prev) => [newTodo,...prev]);
    }
    catch(error){
      setError('Failed to create todo');
    }
  };

  const handleUpdate = async (data: {title: string; description: string}) =>{
    if(!editingTodo) return;
    try{
      setError(null);
      const updated = await updateTodo(editingTodo.id, {
        title: data.title,
        description: data.description,
        completed: editingTodo.completed,
      });
      setTodos((prev) =>
      prev.map((t) => t.id === updated.id? updated:t));
      setEditingTodo(null);
    }
    catch(error) {
      setError('failed to update todo');
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try{
      setError(null);
      const updated = await updateTodo(todo.id,{
        ...todo, completed: !todo.completed,
      });
      setTodos((prev) =>
        prev.map((t) => (t.id === updated.id? updated : t))
      );
    }
    catch(error){
      setError('failed to update status');
    }
  };
  const handleDelete = async (id: number) => {
    try {
      setError(null);
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete todo");
    }
  };

  const onSubmitForm = (data: { title: string; description: string }) => {
    if (editingTodo) {
      handleUpdate(data);
    } else {
      handleCreate(data);
    }
  };

  const onCancelEdit = () => {
    setEditingTodo(null);
  };
 
  return(
    <div className="mx-atuto max-w-2xl space-y-4" data-testid="todo-list">
      <div className="text-center">
        <h1>
          Todo App
        </h1>
      </div>
       <TodoForm onSubmit={onSubmitForm}
       editingTodo={editingTodo}
       onCancelEdit={onCancelEdit}/>

       {error && (
        <div className="rounded-xl border border-red-200 bg-red-40 px-3 py-2 text-sm text-red-700" data-testid="error-message">
          {error}
        </div>
       )}

       {loading ? (
        <div className="flex justify-center py-8 text-slate-500 text-sm">
          Loading todo items....
        </div>) :
        todos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">
            No todos yet. Add one.
          </div>
        ) : (
          <div className="space-y-2">
            {todos.map((todo) => (
              <TodoItem 
              key={todo.id}
              todo={todo}
              onToggleComplete={handleToggleComplete}
              onEdit={setEditingTodo}
              onDelete={handleDelete}
              />
            ))
            }
          </div>
        )
      }
    </div>
  )

}