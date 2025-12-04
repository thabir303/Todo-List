import { useEffect, useState } from "react";
import type Todo from "../types/todo";
import type { User } from "../types/todo";
import TodoItem from "./TodoItem";
import { fetchAllUsers, fetchUserTodos, updateTodo, deleteTodo } from "../api/todoApi";
import { 
  ChevronLeftIcon,
  ClipboardIcon,
  CalendarIcon,
  ChevronRightIcon,
  EditIcon
} from "../assets/icons";
import { toast } from 'react-toastify';
import { 
  LoadingSpinner, 
  ErrorAlert, 
  EmptyState, 
  Pagination
} from "./common";

interface UsersPageProps {
  onBack: () => void;
}

export const UsersPage: React.FC<UsersPageProps> = ({ onBack }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userTodos, setUserTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [todosLoading, setTodosLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const [usersCurrentPage, setUsersCurrentPage] = useState(1);
  const [usersTotalCount, setUsersTotalCount] = useState(0);
  const [usersHasNextPage, setUsersHasNextPage] = useState(false);
  const [usersHasPreviousPage, setUsersHasPreviousPage] = useState(false);
  const [usersPageSize, setUsersPageSize] = useState(10);

  useEffect(() => {
    loadUsers(1, usersPageSize);
  }, []);

  const loadUsers = async (page: number = 1, size: number = usersPageSize) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllUsers(page, size);
      setUsers(data.results);
      setUsersTotalCount(data.count);
      setUsersHasNextPage(data.next !== null);
      setUsersHasPreviousPage(data.previous !== null);
      setUsersCurrentPage(page);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const loadUserTodos = async (userId: number, page: number = 1, size: number = pageSize) => {
    try {
      setTodosLoading(true);
      setError(null);
      const data = await fetchUserTodos(userId, page, size);
      setUserTodos(data.results);
      setTotalCount(data.count);
      setHasNextPage(data.next !== null);
      setHasPreviousPage(data.previous !== null);
      setCurrentPage(page);
    } catch (err) {
      setError("Failed to load user todos");
    } finally {
      setTodosLoading(false);
    }
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setCurrentPage(1);
    loadUserTodos(user.id, 1, pageSize);
  };

  const handleBackToUsers = () => {
    setSelectedUser(null);
    setUserTodos([]);
    setEditingTodo(null);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    if (selectedUser) {
      loadUserTodos(selectedUser.id, 1, newSize);
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      setError(null);
      const updated = await updateTodo(todo.id, {
        ...todo,
        completed: !todo.completed,
      });
      setUserTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      toast.success('Todo updated successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update status";
      setError(message);
      toast.error(message);
      if ((message.toLowerCase().includes('not found') || message.toLowerCase().includes('no todo matches')) && selectedUser) {
        await loadUserTodos(selectedUser.id, currentPage, pageSize);
      }
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
      setUserTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setEditingTodo(null);
      toast.success('Todo updated successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update todo";
      setError(message);
      toast.error(message);
      if ((message.toLowerCase().includes('not found') || message.toLowerCase().includes('no todo matches')) && selectedUser) {
        setEditingTodo(null);
        await loadUserTodos(selectedUser.id, currentPage, pageSize);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!selectedUser) return;
    try {
      setError(null);
      await deleteTodo(id);
      const newTotalCount = totalCount - 1;
      const maxPage = Math.ceil(newTotalCount / pageSize);
      const pageToLoad = currentPage > maxPage ? Math.max(1, maxPage) : currentPage;
      await loadUserTodos(selectedUser.id, pageToLoad, pageSize);
      toast.success('Todo deleted successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete todo";
      setError(message);
      toast.error(message);
      if (message.toLowerCase().includes('not found') || message.toLowerCase().includes('no todo matches')) {
        await loadUserTodos(selectedUser.id, currentPage, pageSize);
      }
    }
  };

  const EditForm = () => {
    if (!editingTodo) return null;
    const [title, setTitle] = useState(editingTodo.title);
    const [description, setDescription] = useState(editingTodo.description || "");
    
    const hasChanges = title.trim() !== editingTodo.title || 
                       description.trim() !== (editingTodo.description ?? "");
    const isDisabled = !title.trim() || !hasChanges;

    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg mb-4">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <EditIcon className="w-5 h-5 text-amber-500" />
          Edit Todo
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block font-medium text-slate-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setEditingTodo(null)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleUpdate({ title, description })}
              disabled={isDisabled}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold hover:from-sky-600 hover:to-indigo-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading users..." />;
  }

  if (selectedUser) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-5">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToUsers}
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ChevronLeftIcon className="w-6 h-6 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{selectedUser.username}'s Todos</h1>
              <p className="text-slate-500">
                {selectedUser.email} • {totalCount} todo{totalCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="px-5 py-2.5 font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
          >
            Back to My Todos
          </button>
        </div>

        {error && (
          <ErrorAlert message={error} />
        )}

        {editingTodo && <EditForm />}

        {todosLoading ? (
          <LoadingSpinner message="Loading todos..." />
        ) : userTodos.length === 0 ? (
          <EmptyState 
            title="No todos found"
            message="This user hasn't created any todos yet."
          />
        ) : (
          <div className="space-y-4">
            {userTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggleComplete={handleToggleComplete}
                onEdit={setEditingTodo}
                onDelete={handleDelete}
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
            loading={todosLoading}
            onPageChange={(page) => selectedUser && loadUserTodos(selectedUser.id, page, pageSize)}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Registered Users</h1>
          <p className="text-slate-500">{usersTotalCount} user{usersTotalCount !== 1 ? 's' : ''} registered</p>
        </div>
        <button
          onClick={onBack}
          className="px-5 py-2.5 font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors flex items-center gap-2"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          Back to My Todos
        </button>
      </div>

      {error && (
        <ErrorAlert message={error} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => handleSelectUser(user)}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-5 hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-slate-800 truncate">{user.username}</h3>
                  {user.is_admin && (
                    <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-semibold rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-sm truncate">{user.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1.5 text-sm text-slate-400">
                    <ClipboardIcon className="w-4 h-4" />
                    {user.todo_count || 0} todos
                  </span>
                  {user.date_joined && (
                    <span className="flex items-center gap-1.5 text-sm text-slate-400">
                      <CalendarIcon className="w-4 h-4" />
                      Joined {new Date(user.date_joined).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        ))}
      </div>

      {usersTotalCount > 0 && (
        <Pagination
          currentPage={usersCurrentPage}
          totalCount={usersTotalCount}
          pageSize={usersPageSize}
          hasNextPage={usersHasNextPage}
          hasPreviousPage={usersHasPreviousPage}
          loading={loading}
          onPageChange={(page) => loadUsers(page, usersPageSize)}
          onPageSizeChange={(newSize: number) => {
            setUsersPageSize(newSize);
            loadUsers(1, newSize);
          }}
        />
      )}
    </div>
  );
};
