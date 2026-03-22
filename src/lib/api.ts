// API fetch wrapper - 인증 토큰 자동 첨부 및 401 자동 갱신

import { getAccessToken, refreshAccessToken, clearTokens } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

function generateRid(): string {
  return Math.random().toString(36).substring(2, 10);
}

export async function api<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { skipAuth = false, headers: customHeaders, ...rest } = options;
  const rid = generateRid();
  const method = rest.method?.toUpperCase() || "GET";
  const url = `${BASE_URL}${endpoint}`;
  const start = performance.now();

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

  let res = await fetch(url, { headers, ...rest });

  // 401 발생 시 토큰 갱신 후 재시도
  if (res.status === 401 && !skipAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`);
      res = await fetch(url, { headers, ...rest });
    } else {
      clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Unauthorized");
    }
  }

  const duration = Math.round(performance.now() - start);
  console.log(`[${rid}] ${new Date().toISOString()} ${method} ${endpoint} ${res.status} ${duration}ms`);

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
