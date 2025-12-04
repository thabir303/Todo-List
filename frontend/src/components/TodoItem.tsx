import { useState } from 'react';
import type Todo from '../types/todo';
import ConfirmationModal from './ConfirmationModal';
import { 
    CheckIcon, 
    ClockIcon, 
    UserIcon, 
    EditIcon, 
    DeleteIcon 
} from '../assets/icons';

interface TodoItemsProps {
    todo: Todo;
    onToggleComplete: (todo: Todo) => void;
    onEdit?: (todo: Todo) => void;
    onDelete?: (id: number) => void;
    showOwner?: boolean;
}

const TodoItem: React.FC<TodoItemsProps> = ({
    todo,
    onToggleComplete,
    onEdit,
    onDelete,
    showOwner,
}) => {
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleCheckboxClick = () => {
        setShowCompleteModal(true);
    };

    const handleConfirmComplete = () => {
        onToggleComplete(todo);
        setShowCompleteModal(false);
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (onDelete) {
            onDelete(todo.id);
        }
        setShowDeleteModal(false);
    };

    return (
        <>
        <div className={`border p-5 rounded-2xl bg-white/80 backdrop-blur-sm border-white/20 shadow-sm hover:shadow-lg transition-all ${todo.completed ? 'opacity-70' : ''}`} data-testid="todo-item">
            <div className="flex items-start gap-4">
                <div className="pt-1">
                    <div 
                        onClick={handleCheckboxClick}
                        className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
                            todo.completed 
                                ? 'bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600' 
                                : 'border-sky-400 hover:border-sky-500 hover:bg-sky-50'
                        }`}
                        data-testid="todo-checkbox"
                    >
                        {todo.completed && (
                            <CheckIcon className="w-4 h-4 text-white" strokeWidth={3} />
                        )}
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-semibold ${todo.completed ? 'line-through text-gray-400' : 'text-slate-800'}`}>
                        {todo.title}
                    </h3>
                    {todo.description && (
                        <p className={`mt-2 ${todo.completed ? 'text-gray-400' : 'text-slate-600'}`}>
                            {todo.description}
                        </p>
                    )}
                    <div className="flex items-center flex-wrap gap-3 mt-3">
                        <span className="flex items-center gap-1.5 text-sm text-slate-400">
                            <ClockIcon className="w-4 h-4" />
                            {new Date(todo.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                        </span>
                        {showOwner && (
                            <span className="flex items-center gap-1.5 text-sm px-3 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 rounded-full font-medium">
                                <UserIcon className="w-4 h-4" />
                                {todo.username}
                            </span>
                        )}
                        {todo.completed && (
                            <span className="flex items-center gap-1.5 text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                                <CheckIcon className="w-4 h-4" strokeWidth={2} />
                                Completed
                            </span>
                        )}
                    </div>
                </div>
            </div>
            {(onEdit || onDelete) && (
                <div className='flex gap-3 mt-4 pt-4 border-t border-slate-200/50'>
                    {onEdit && (
                        <button 
                            onClick={() => onEdit(todo)}
                            className='flex items-center gap-2 text-sm rounded-xl border cursor-pointer bg-gray-50 border-slate-300 px-4 py-2 text-slate-600 hover:bg-slate-100 hover:border-slate-400 transition-all'
                            data-testid="todo-edit-button"
                        >
                            <EditIcon className="w-4 h-4" />
                            Edit
                        </button>
                    )}
                    {onDelete && (
                        <button 
                            onClick={handleDeleteClick}
                            className='flex items-center gap-2 text-sm rounded-xl border border-red-300 cursor-pointer px-4 py-2 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all'
                            data-testid="todo-delete-button"
                        >
                            <DeleteIcon className="w-4 h-4" />
                            Delete
                        </button>
                    )}
                </div>
            )}
        </div>

        <ConfirmationModal
            isOpen={showCompleteModal}
            title={todo.completed ? "Mark as Incomplete?" : "Mark as Complete?"}
            message={todo.completed 
                ? `Are you sure you want to mark "${todo.title}" as incomplete?` 
                : `Are you sure you want to mark "${todo.title}" as completed?`}
            confirmText={todo.completed ? "Yes, Uncomplete" : "Yes, Complete"}
            cancelText="Cancel"
            icon="complete"
            onConfirm={handleConfirmComplete}
            onCancel={() => setShowCompleteModal(false)}
        />

        <ConfirmationModal
            isOpen={showDeleteModal}
            title="Delete Todo?"
            message={`Are you sure you want to delete "${todo.title}"? This action cannot be undone.`}
            confirmText="Yes, Delete"
            cancelText="Cancel"
            icon="delete"
            onConfirm={handleConfirmDelete}
            onCancel={() => setShowDeleteModal(false)}
        />
        </>
    );
};

export default TodoItem;