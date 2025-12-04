import { useEffect, useState } from 'react';
import type Todo from '../types/todo';
import { 
    EditIcon, 
    PlusIcon, 
    ClipboardIcon, 
    TextLinesIcon, 
    CheckIcon, 
    PlusAltIcon 
} from '../assets/icons';

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
        if (!editingTodo) {
            setTitle("");
            setDescription("");
        }
    }

    const isEditing = Boolean(editingTodo);
    
    const hasChanges = isEditing && editingTodo ? (
        title.trim() !== editingTodo.title || 
        description.trim() !== (editingTodo.description ?? "")
    ) : true;
    
    const isSubmitDisabled = !title.trim() || (isEditing && !hasChanges);

    return (
        <form
        onSubmit={handleSubmit} 
        className='space-y-5 rounded-2xl bg-white/80 backdrop-blur-xl p-6 shadow-lg border border-white/20'
        >
        <h2 className='text-xl font-semibold text-slate-800 flex items-center gap-2'>
            {isEditing ? (
                <EditIcon className="w-5 h-5 text-amber-500" />
            ) : (
                <PlusIcon className="w-5 h-5 text-sky-500" />
            )}
            {isEditing? "Edit Todo": "Add New Todo"}
        </h2>

        <div>
            <label className='block font-medium text-slate-700 mb-2'>
             Title
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <ClipboardIcon className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                    className='w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 py-4 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus:bg-white transition-all'
                    placeholder='What do you need to do?'
                    value={title}
                    onChange={(e)=> setTitle(e.target.value)}
                    data-testid="todo-title-input"
                    required
                />
            </div>
        </div>
       <div>
        <label className="block font-medium text-slate-700 mb-2">
          Description
        </label>
        <div className="relative">
            <div className="absolute top-4 left-4 pointer-events-none">
                <TextLinesIcon className="w-5 h-5 text-slate-400" />
            </div>
            <textarea
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 py-4 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus:bg-white transition-all"
              placeholder="Optional details..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-testid="todo-description-input"
            />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        {isEditing && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-xl cursor-pointer border border-slate-300 px-6 py-3 font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="rounded-xl cursor-pointer bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-3 font-semibold text-white hover:from-sky-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-sky-500/25 flex items-center gap-2"
          disabled={isSubmitDisabled}
          data-testid="todo-submit-button"
        >
          {isEditing ? (
            <>
              Update
            </>
          ) : (
            <>
              Add Todo
            </>
          )}
        </button>
      </div>
        </form>
    )
}

export default TodoForm;