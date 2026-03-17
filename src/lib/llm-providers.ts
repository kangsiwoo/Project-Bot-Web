// LLM 프로바이더 설정

export type ProviderId = "claude_code" | "anthropic" | "openai";

export interface LLMProvider {
  name: string;
  icon: string;
  models: string[];
  description: string;
}

export const LLM_PROVIDERS: Record<ProviderId, LLMProvider> = {
  claude_code: {
    name: "Claude Code CLI",
    icon: ">_",
    models: ["sonnet", "opus"],
    description: "원격 CLI 제어",
  },
  anthropic: {
    name: "Anthropic API",
    icon: "A",
    models: ["claude-sonnet-4-20250514", "claude-opus-4-20250514"],
    description: "API 직접 호출",
  },
  openai: {
    name: "OpenAI",
    icon: "O",
    models: ["gpt-4o", "gpt-4o-mini"],
    description: "OpenAI API",
  },
};

export const PROVIDER_IDS = Object.keys(LLM_PROVIDERS) as ProviderId[];

export function getDefaultModel(providerId: ProviderId): string {
  return LLM_PROVIDERS[providerId].models[0];
}
