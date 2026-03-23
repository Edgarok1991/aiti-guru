import { create } from 'zustand';

const TOKEN_KEY = 'aiti_access_token';

function readToken(): string | null {
  const session = sessionStorage.getItem(TOKEN_KEY);
  if (session) return session;
  return localStorage.getItem(TOKEN_KEY);
}

interface AuthState {
  accessToken: string | null;
  initialized: boolean;
  init: () => void;
  setSession: (token: string, remember: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  initialized: false,

  init: () => {
    set({
      accessToken: readToken(),
      initialized: true,
    });
  },

  setSession: (token, remember) => {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
    }
    set({ accessToken: token });
  },

  logout: () => {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    set({ accessToken: null });
  },
}));

export function getStoredToken(): string | null {
  return readToken();
}
