// Zustand 인증 상태 관리 스토어

import { create } from "zustand";
import type { User, TokenResponse, UserLogin, UserCreate } from "@/types";
import { api } from "@/lib/api";
import { setTokens, clearTokens, getAccessToken } from "@/lib/auth";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // 액션
  login: (credentials: UserLogin) => Promise<void>;
  register: (data: UserCreate) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (credentials) => {
    const data = await api<TokenResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      skipAuth: true,
    });

    setTokens(data.access_token, data.refresh_token);
    set({ accessToken: data.access_token, isAuthenticated: true });

    // 로그인 후 사용자 정보 조회
    const user = await api<User>("/api/auth/me");
    set({ user });
  },

  register: async (data) => {
    const tokenData = await api<TokenResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      skipAuth: true,
    });

    setTokens(tokenData.access_token, tokenData.refresh_token);
    set({ accessToken: tokenData.access_token, isAuthenticated: true });

    const user = await api<User>("/api/auth/me");
    set({ user });
  },

  logout: () => {
    clearTokens();
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    try {
      const user = await api<User>("/api/auth/me");
      set({ user, isAuthenticated: true });
    } catch {
      set({ user: null, isAuthenticated: false });
    }
  },

  // 앱 초기화 시 토큰 확인
  initialize: async () => {
    const token = getAccessToken();
    if (!token) {
      set({ isLoading: false });
      return;
    }

    try {
      const user = await api<User>("/api/auth/me");
      set({
        user,
        accessToken: token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      clearTokens();
      set({ isLoading: false });
    }
  },
}));
