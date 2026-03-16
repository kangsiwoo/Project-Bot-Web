// API fetch wrapper - 인증 토큰 자동 첨부 및 401 자동 갱신

import { getAccessToken, refreshAccessToken, clearTokens } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function api<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { skipAuth = false, headers: customHeaders, ...rest } = options;

  const headers = new Headers(customHeaders);

  if (!headers.has("Content-Type") && !(rest.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // 인증 토큰 자동 첨부
  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  let res = await fetch(`${BASE_URL}${endpoint}`, { headers, ...rest });

  // 401 발생 시 토큰 갱신 후 재시도
  if (res.status === 401 && !skipAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`);
      res = await fetch(`${BASE_URL}${endpoint}`, { headers, ...rest });
    } else {
      clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Unauthorized");
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `API Error: ${res.status}`);
  }

  // 204 No Content 등의 경우
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}
