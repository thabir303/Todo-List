import { useEffect, useState } from 'react';
import type Todo from '../types/todo';

interface TodoFormProps {
    onSubmit : (data : {title: string; description: string}) => void;
    editingTodo?: Todo | null;
    onCancelEdit? : () => void;

}

const TodoForm: React.FC<TodoFormProps> =({
    onSubmit, editingTodo,
    onCancelEdit,
}) => 
{
    const [title,setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if(editingTodo){
            setTitle(editingTodo.title);
            setDescription(editingTodo.description ?? "");
        }
        else {
            setTitle("");
            setDescription("");
        }
    }, [editingTodo]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!title.trim()) return;
        onSubmit({title: title.trim(), 
            description: description.trim()});
    }

    const isEditing = Boolean(editingTodo);

    return (
        <form
        onSubmit={handleSubmit} 
        className='space-y-3 rounded-2xl border bg-white p-4 shadow-lg'
        >
        <h2 className='text-lg font-semibold text-slate-800'>
            {isEditing? "Edit todo": "Add new Todo"}
        </h2>

        <div>
            <label className='block text-sm font-medium text-slate-700'>
             Title
            </label>
            <input 
            className='w-full rounded-xl border border-slate-400 px-3 py-2 text-sm outline'
            placeholder='What do you need to do?'
            value={title}
            onChange={(e)=> setTitle(e.target.value)}
            data-testid="todo-title-input"
            required
            />
        </div>
       <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          placeholder="Optional details..."
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          data-testid="todo-description-input"
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        {isEditing && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-xl cursor-pointer border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="rounded-xl cursor-pointer bg-sky-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
          disabled={!title.trim()}
          data-testid="todo-submit-button"
        >
          {isEditing ? "Update" : "Add"}
        </button>
      </div>
        </form>
    )
}

export default TodoForm;