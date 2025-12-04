import type Todo from '../types/todo';
import type { PaginatedResponse, User } from '../types/todo';
import { getAccessToken, refreshToken, clearAuth } from './authApi';

const BASE_URL = 'http://localhost:8000/api';

interface CreateTodoPayload {
    title: string;
    description?: string;
    completed: boolean;
}

async function getErrorMessage(response: Response, fallbackMessage: string): Promise<string> {
    try {
        const data = await response.json();
        
        if (data.detail) {
            return data.detail;
        }
        if (data.error) {
            return data.error;
        }
        if (data.message) {
            return data.message;
        }
        
        if (typeof data === 'object') {
            const errors = Object.entries(data)
                .map(([field, messages]) => {
                    if (Array.isArray(messages)) {
                        return `${field}: ${messages.join(', ')}`;
                    }
                    return `${field}: ${messages}`;
                })
                .join('; ');
            if (errors) return errors;
        }
        return fallbackMessage;
    } catch {
        return fallbackMessage;
    }
}

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
    let token = getAccessToken();
    
    const makeRequest = (accessToken: string | null) => {
        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
            },
        });
    };

    let response = await makeRequest(token);
    
    
    if (response.status === 401) {
        token = await refreshToken();
        if (token) {
            response = await makeRequest(token);
        } else {
            clearAuth();
            window.location.href = '/login';
        }
    }
    
    return response;
}

export async function fetchTodos(page: number = 1, pageSize: number = 10, userId?: number): Promise<PaginatedResponse<Todo>> {
    let url = `${BASE_URL}/todos/?page=${page}&page_size=${pageSize}`;
    if (userId) {
        url += `&user_id=${userId}`;
    }
    const response = await authFetch(url);
    if (!response.ok) {
        const errorMsg = await getErrorMessage(response, 'Failed to fetch todos items');
        throw new Error(errorMsg);
    }
    return response.json();
}

export async function fetchUserTodos(userId: number, page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Todo>> {
    const response = await authFetch(`${BASE_URL}/todos/by_user/?user_id=${userId}&page=${page}&page_size=${pageSize}`);
    if (!response.ok) {
        const errorMsg = await getErrorMessage(response, 'Failed to fetch user todos');
        throw new Error(errorMsg);
    }
    return response.json();
}

export async function fetchAllUsers(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<User>> {
    const response = await authFetch(`${BASE_URL}/auth/users/?page=${page}&page_size=${pageSize}`);
    if (!response.ok) {
        const errorMsg = await getErrorMessage(response, 'Failed to fetch users');
        throw new Error(errorMsg);
    }
    return response.json();
}

export async function createTodo(payload: CreateTodoPayload): Promise<Todo> {
    const response = await authFetch(`${BASE_URL}/todos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const errorMsg = await getErrorMessage(response, 'Failed to create a todo item');
        throw new Error(errorMsg);
    }
    return response.json();
}

export async function updateTodo(id: number, payload: Partial<Todo>): Promise<Todo> {
    const response = await authFetch(`${BASE_URL}/todos/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const errorMsg = await getErrorMessage(response, 'Failed to update a todo item');
        throw new Error(errorMsg);
    }
    return response.json();
}

export async function deleteTodo(id: number): Promise<void> {
    const response = await authFetch(`${BASE_URL}/todos/${id}/`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const errorMsg = await getErrorMessage(response, 'Failed to delete a todo item');
        throw new Error(errorMsg);
    }
}