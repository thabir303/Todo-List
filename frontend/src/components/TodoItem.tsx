import type Todo from '../types/todo';

interface TodoItemsProps {
    todo: Todo;
    onToggleComplete: (todo: Todo) => void;
    onEdit : (todo: Todo) => void;
    onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemsProps> = ({
    todo,
    onToggleComplete,
    onEdit,
    onDelete,
})=> {
    return (
        <div className='border p-4 rounded-2xl' data-testid="todo-item">
            <div>
                Id : {todo.id}
            </div>
            <div>
                <input type="checkbox"
                data-testid="todo-checkbox" 
                checked={todo.completed}
                onChange={() => onToggleComplete(todo)}
                className='mt-1 h-4 w-4 cursor-pointer rounded border-gray-300'
                />
                <div>
                    <h3 className={`font-semibold ${ todo.completed? 
                    'line-through text-gray-400' : 'text-slate-800'}`}
                    >
                        {todo.title}
                    </h3>
                    {todo.description &&
                    (
                        <p className='text-sm text-slate-500 mt-1'>
                            {todo.description}
                        </p>
                    )
                    }
                    <p className='text-sm text-slate-400 mt-1'>
                        created : {new Date(todo.created_at).toLocaleDateString()}
                    </p>
                </div>
            </div>
            <div className='flex gap-2'>
                <button onClick={()=> onEdit(todo)}
                    className='text-xs rounded-lg border cursor-pointer border-slate-300 px-2 py-1 hover:bg-slate-100'
                    data-testid="todo-edit-button"
                    >
                    Edit
                </button>
                <button onClick={()=> onDelete(todo.id)}
                    className='text-xs rounded-lg border border-red-300 cursor-pointer px-2 py-1 text-red-600 hover:bg-red-50'
                    data-testid="todo-delete-button">
                        Delete
                </button>
            </div>

        </div>
    ) 
}

export default TodoItem;