import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types/todo';
import { getStoredUser, getStoredTokens, login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/authApi';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string, password2: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = getStoredUser();
        const storedTokens = getStoredTokens();
        if (storedUser && storedTokens?.access) {
            setUser(storedUser);
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const response = await apiLogin(email, password);
        setUser(response.user);
    };

    const register = async (username: string, email: string, password: string, password2: string) => {
        const response = await apiRegister(username, email, password, password2);
        setUser(response.user);
    };

    const logout = async () => {
        await apiLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            register,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
