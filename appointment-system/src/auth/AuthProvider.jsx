import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const LS_KEY = "auth";

export default function AuthProvider({ children }) {
    const [auth, setAuth] = useState(() => {
        try { return JSON.parse(localStorage.getItem(LS_KEY)) || null; }
        catch { return null; }
    });

    useEffect(() => {
        if (auth) localStorage.setItem(LS_KEY, JSON.stringify(auth));
        else localStorage.removeItem(LS_KEY);
    }, [auth]);

    const login = (token, user) => setAuth({ token, user });
    const logout = () => setAuth(null);
    const isLoggedIn = !!auth?.token;
    const roles = auth?.user?.roles || [];

    const value = useMemo(() => ({ auth, login, logout, isLoggedIn, roles }), [auth, isLoggedIn, roles]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}