import { useEffect, useState } from "react";
import type Todo from "../types/todo";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";
import { useAuth } from "../context/AuthContext";
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../api/todoApi";
import { 
  LogoutIcon, 
  ClipboardIcon, 
  UsersIcon
} from "../assets/icons";
import { toast } from 'react-toastify';
import { 
  LoadingSpinner, 
  ErrorAlert, 
  EmptyState, 
  Pagination
} from "./common";

interface TodoListProps {
  onShowUsers?: () => void;
}

export const TodoList: React.FC<TodoListProps> = ({ onShowUsers }) => {
  const { user, logout } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const loadTodos = async (page: number = 1, size: number = pageSize) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTodos(page, size);
      setTodos(data.results);
      setTotalCount(data.count);
      setHasNextPage(data.next !== null);
      setHasPreviousPage(data.previous !== null);
      setCurrentPage(page);
    } catch (error) {
      setError('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos(1, pageSize);
  }, [pageSize]);

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleCreate = async (data: { title: string; description: string }) => {
    try {
      setError(null);
      await createTodo({
        title: data.title,
        description: data.description,
        completed: false,
      });
      await loadTodos(1);
      toast.success('Todo created successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create todo';
      setError(message);
      toast.error(message);
    }
  };

  const handleUpdate = async (data: { title: string; description: string }) => {
    if (!editingTodo) return;
    try {
      setError(null);
      const updated = await updateTodo(editingTodo.id, {
        title: data.title,
        description: data.description,
        completed: editingTodo.completed,
      });
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setEditingTodo(null);
      toast.success('Todo updated successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update todo';
      setError(message);
      toast.error(message);
      if (message.toLowerCase().includes('not found') || message.toLowerCase().includes('no todo matches')) {
        setEditingTodo(null);
        await loadTodos(currentPage);
      }
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      setError(null);
      const updated = await updateTodo(todo.id, {
        ...todo,
        completed: !todo.completed,
      });
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      toast.success('Todo status updated successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      setError(message);
      toast.error(message);
      if (message.toLowerCase().includes('not found') || message.toLowerCase().includes('no todo matches')) {
        await loadTodos(currentPage);
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setError(null);
      await deleteTodo(id);
      const newTotalCount = totalCount - 1;
      const maxPage = Math.ceil(newTotalCount / pageSize);
      const pageToLoad = currentPage > maxPage ? Math.max(1, maxPage) : currentPage;
      await loadTodos(pageToLoad);
      toast.success('Todo deleted successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete todo';
      setError(message);
      toast.error(message);
      if (message.toLowerCase().includes('not found') || message.toLowerCase().includes('no todo matches')) {
        await loadTodos(currentPage);
      }
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

  const canEditTodo = (todo: Todo) => {
    return user?.is_admin || todo.user === user?.id;
  };

  return (
    <div className="max-w-4xl w-full space-y-5 px-4" data-testid="todo-list">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Todo App</h1>
            <p className="text-slate-500">
              Welcome, <span className="font-semibold text-slate-700">{user?.username}</span>
              {user?.is_admin && <span className="ml-2 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-semibold rounded-full shadow-sm">Admin</span>}
            </p>
          </div>
          <button
            onClick={logout}
            className="px-5 py-2.5 font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl cursor-pointer transition-colors flex items-center gap-2"
          >
            <LogoutIcon className="w-5 h-5" />
            Logout
          </button>
        </div>
        
        {user?.is_admin && onShowUsers && (
          <div className="flex gap-2 pt-3 border-t border-slate-200">
            <button
              className="px-5 py-2.5 rounded-xl font-medium bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg cursor-pointer flex items-center gap-2"
            >
              <ClipboardIcon className="w-5 h-5" />
              My Todos
            </button>
            <button
              onClick={onShowUsers}
              className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors flex items-center gap-2"
            >
              <UsersIcon className="w-5 h-5" />
              Users
            </button>
          </div>
        )}
      </div>

      <TodoForm
        onSubmit={onSubmitForm}
        editingTodo={editingTodo}
        onCancelEdit={onCancelEdit}
      />

      {error && (
        <ErrorAlert message={error} />
      )}

      {loading ? (
        <LoadingSpinner message="Loading todos..." />
      ) : todos.length === 0 ? (
        <EmptyState 
          title="No todos yet"
          message="Create your first todo using the form above!"
        />
      ) : (
        <div className="space-y-4">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={handleToggleComplete}
              onEdit={canEditTodo(todo) ? setEditingTodo : undefined}
              onDelete={canEditTodo(todo) ? handleDelete : undefined}
              showOwner={false}
            />
          ))}
        </div>
      )}

      {totalCount > 0 && (
        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={pageSize}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          loading={loading}
          onPageChange={loadTodos}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
};
