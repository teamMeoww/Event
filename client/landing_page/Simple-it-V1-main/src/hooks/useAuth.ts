import { useState, useEffect } from 'react';

export function useAuth() {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // In a real application, retrieve this from localStorage, Context, or Next-Auth session
        // For demonstration purposes, we are simulating a stored token.
        const storedToken = localStorage.getItem('jwt_token') || 'dummy-token';
        setToken(storedToken);
    }, []);

    return { token };
}
