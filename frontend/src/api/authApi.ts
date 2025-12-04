import type { AuthResponse, User } from '../types/todo';

const BASE_URL = 'http://localhost:8000/api/auth';

const TOKEN_KEY = 'auth_tokens';
const USER_KEY = 'auth_user';

export const getStoredTokens = () => {
    const tokens = localStorage.getItem(TOKEN_KEY);
    return tokens ? JSON.parse(tokens) : null;
};

export const getStoredUser = (): User | null => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

export const storeAuth = (user: User, tokens: { access: string; refresh: string }) => {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

export const getAccessToken = () => {
    const tokens = getStoredTokens();
    return tokens?.access || null;
};

export async function login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
    }
    const data = await response.json();
    storeAuth(data.user, data.tokens);
    return data;
}

export async function register(username: string, email: string, password: string, password2: string): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, password2 }),
    });
    if (!response.ok) {
        const error = await response.json();
        const message = Object.values(error).flat().join(', ');
        throw new Error(message || 'Registration failed');
    }
    const data = await response.json();
    storeAuth(data.user, data.tokens);
    return data;
}

export async function logout(): Promise<void> {
    const tokens = getStoredTokens();
    if (tokens?.refresh) {
        try {
            await fetch(`${BASE_URL}/logout/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokens.access}`,
                },
                body: JSON.stringify({ refresh: tokens.refresh }),
            });
        } catch {
            void 0;
        }
    }
    clearAuth();
}

export async function refreshToken(): Promise<string | null> {
    const tokens = getStoredTokens();
    if (!tokens?.refresh) return null;

    try {
        const response = await fetch(`${BASE_URL}/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: tokens.refresh }),
        });
        if (!response.ok) {
            clearAuth();
            return null;
        }
        const data = await response.json();
        storeAuth(getStoredUser()!, { access: data.access, refresh: data.refresh || tokens.refresh });
        return data.access;
    } catch {
        clearAuth();
        return null;
    }
}

export async function fetchMe(): Promise<User> {
    const tokens = getStoredTokens();
    const response = await fetch(`${BASE_URL}/me/`, {
        headers: { 'Authorization': `Bearer ${tokens?.access}` },
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
}
