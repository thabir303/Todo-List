import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  UserIcon, 
  EmailIcon, 
  LockIcon, 
  LockCheckIcon, 
  ClipboardCheckIcon, 
  UserAddIcon,
  ErrorIcon,
  SpinnerIcon,
  EyeIcon,
  EyeOffIcon
} from '../assets/icons';

interface AuthFormProps {
    onToggleMode: () => void;
}

export function LoginForm({ onToggleMode }: AuthFormProps) {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-[850px] px-4 items-center">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-12 border border-white/20">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                        <ClipboardCheckIcon className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
                    <p className="text-slate-500 mt-2">Sign in to continue</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-xl flex items-center gap-3">
                            <ErrorIcon className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block font-medium text-slate-700 mb-2">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <EmailIcon />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 py-4 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus:bg-white transition-all"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block font-medium text-slate-700 mb-2">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <LockIcon />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-12 pr-12 py-4 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus:bg-white transition-all"
                                required
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-slate-400 hover:text-slate-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-sky-600 hover:to-indigo-700 disabled:opacity-50 cursor-pointer transition-all shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <SpinnerIcon className="w-5 h-5" />
                                Signing in...
                            </span>
                        ) : 'Sign In'}
                    </button>
                </form>
                <p className="text-center text-sm text-slate-600 mt-8">
                    Don't have an account?{' '}
                    <button onClick={onToggleMode} className="text-sky-600 hover:text-sky-700 font-semibold cursor-pointer">
                        Create account
                    </button>
                </p>
            </div>
        </div>
    );
}

export function SignupForm({ onToggleMode }: AuthFormProps) {
    const { register } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== password2) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await register(username, email, password, password2);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full px-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-12 border border-white/20">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                        <UserAddIcon className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-xl flex items-center gap-3">
                            <ErrorIcon className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block font-medium text-slate-700 mb-2">Username</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <UserIcon />
                            </div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Choose a username"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 py-4 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white transition-all"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block font-medium text-slate-700 mb-2">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <EmailIcon />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 py-4 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white transition-all"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block font-medium text-slate-700 mb-2">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <LockIcon />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a password"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-12 pr-12 py-4 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white transition-all"
                                required
                                minLength={8}
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-slate-400 hover:text-slate-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block font-medium text-slate-700 mb-2">Confirm Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <LockCheckIcon />
                            </div>
                            <input
                                type={showPassword2 ? "text" : "password"}
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}
                                placeholder="Confirm your password"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-12 pr-12 py-4 text-base outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:bg-white transition-all"
                                required
                                minLength={8}
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                <button
                                    type="button"
                                    onClick={() => setShowPassword2(!showPassword2)}
                                    className="text-slate-400 hover:text-slate-600 focus:outline-none"
                                >
                                    {showPassword2 ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 cursor-pointer transition-all shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 mt-2"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <SpinnerIcon className="w-5 h-5" />
                                Creating account...
                            </span>
                        ) : 'Create Account'}
                    </button>
                </form>
                <p className="text-center text-sm text-slate-600 mt-6">
                    Already have an account?{' '}
                    <button onClick={onToggleMode} className="text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer">
                        Sign in
                    </button>
                </p>
            </div>
        </div>
    );
}

export function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-slate-800 to-slate-900">
            <div className="w-full max-w-4xl">
                {isLogin ? (
                    <LoginForm onToggleMode={() => setIsLogin(false)} />
                ) : (
                    <SignupForm onToggleMode={() => setIsLogin(true)} />
                )}
            </div>
        </div>
    );
}
