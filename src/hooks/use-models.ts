import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface LLMModel {
  id: string;
  name: string;
  description: string;
}

export interface LLMProviderData {
  key: string;
  name: string;
  icon: string;
  description: string;
  models: LLMModel[];
}

export function useModels() {
  return useQuery({
    queryKey: ["models"],
    queryFn: () => api<LLMProviderData[]>("/api/models", { skipAuth: true }),
    staleTime: 1000 * 60 * 5, // 5분 캐시
  });
}
