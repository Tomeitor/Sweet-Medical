import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../auth/constants.js";
import { fetchCurrentSession, login as loginRequest } from "../services/api.js";

const AuthContext = createContext(null);
const selectedDoctorIdKey = "selectedDoctorId";
const selectedDoctorUserKey = "selectedDoctorUsuarioId";

function readStoredUser() {
  const rawUser = window.localStorage.getItem(AUTH_USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = window.localStorage.getItem(AUTH_TOKEN_KEY);

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);

    const storedUser = readStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }

    fetchCurrentSession()
      .then((sessionUser) => {
        setUser(sessionUser);
        window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(sessionUser));
      })
      .catch(() => {
        window.localStorage.removeItem(AUTH_TOKEN_KEY);
        window.localStorage.removeItem(AUTH_USER_KEY);
        setToken("");
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  async function login(credentials) {
    const session = await loginRequest(credentials);

    window.localStorage.setItem(AUTH_TOKEN_KEY, session.token);
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(session.user));
    setToken(session.token);
    setUser(session.user);

    return session.user;
  }

  function logout() {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    window.localStorage.removeItem(AUTH_USER_KEY);
    window.localStorage.removeItem(selectedDoctorIdKey);
    window.localStorage.removeItem(selectedDoctorUserKey);
    setToken("");
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [isLoading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
