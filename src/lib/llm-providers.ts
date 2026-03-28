// LLM 프로바이더 설정

export type ProviderId = "claude_code" | "anthropic" | "openai";

export interface LLMModel {
  id: string;
  name: string;
  description: string;
}

export interface LLMProvider {
  name: string;
  icon: string;
  models: LLMModel[];
  description: string;
}

export const LLM_PROVIDERS: Record<ProviderId, LLMProvider> = {
  claude_code: {
    name: "Claude Code CLI",
    icon: ">_",
    models: [
      { id: "sonnet", name: "Sonnet", description: "빠르고 균형 잡힌 모델. 대부분의 작업에 적합" },
      { id: "opus", name: "Opus", description: "가장 강력한 모델. 복잡한 추론과 코딩에 최적" },
      { id: "haiku", name: "Haiku", description: "가장 빠른 모델. 간단한 질문과 빠른 응답에 적합" },
    ],
    description: "원격 CLI 제어",
  },
  anthropic: {
    name: "Anthropic API",
    icon: "A",
    models: [
      { id: "claude-sonnet-4-20250514", name: "Sonnet 4", description: "최신 Sonnet 모델" },
      { id: "claude-opus-4-20250514", name: "Opus 4", description: "최신 Opus 모델" },
      { id: "claude-haiku-4-5-20251001", name: "Haiku 4.5", description: "최신 Haiku 모델" },
    ],
    description: "API 직접 호출",
  },
  openai: {
    name: "OpenAI",
    icon: "O",
    models: [
      { id: "gpt-4o", name: "GPT-4o", description: "OpenAI 최신 멀티모달 모델" },
      { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "경량화된 GPT-4o" },
    ],
    description: "OpenAI API",
  },
};

export const PROVIDER_IDS = Object.keys(LLM_PROVIDERS) as ProviderId[];

export function getDefaultModel(providerId: ProviderId): string {
  return LLM_PROVIDERS[providerId].models[0].id;
}
