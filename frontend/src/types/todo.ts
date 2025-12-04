export default interface Todo {
    id: number;
    user: number;
    username: string;
    title: string;
    description: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface User {
    id: number;
    username: string;
    email: string;
    is_admin: boolean;
    date_joined?: string;
    todo_count?: number;
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface AuthResponse {
    user: User;
    tokens: AuthTokens;
}