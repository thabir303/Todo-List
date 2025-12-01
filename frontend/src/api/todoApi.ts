import type Todo from '../types/todo';

const BASE_URL = 'http://localhost:8000/api';

interface CreateTodoPayload {
    title:string;
    description?:string;
    completed: boolean;
}

export async function fetchTodos(): Promise<Todo[]> {
    const response = await fetch(`${BASE_URL}/todos/`);
    if (!response.ok) {
        throw new Error('Failed to fetch todos items')
    }
    return response.json();
}

export async function createTodo(payload: CreateTodoPayload): Promise<Todo> {
    const response = await fetch(`${BASE_URL}/todos/`,{
        method : 'POST',
        headers: {
            'Content-Type':'application/json',
        },
        body: JSON.stringify(payload),
    })
    if (!response.ok) {
        throw new Error('Failed to create a todo item');
    }
    return response.json();
}

export async function updateTodo(id:number, payload: Partial<Todo>): Promise<Todo> {
    const response = await fetch (`${BASE_URL}/todos/${id}/`, {
        method: "PUT",
        headers: {
            "content-type":"application/json",
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error('Failed to update a todo item');
    }
    return response.json();
}

export async function deleteTodo(id:number): Promise<void> {
    const response = await fetch (`${BASE_URL}/todos/${id}/`, {
        method: "DELETE",
    });
    
    if(!response.ok) {
        throw new Error('Failed to delete a todo item');
    }
    return;
}