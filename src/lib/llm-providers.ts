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
      { id: "sonnet", name: "Claude Sonnet 4.6", description: "코딩, 분석, 검색에 최적화. 빠른 속도와 높은 정확도의 균형. 대부분의 개발 작업에 권장" },
      { id: "opus", name: "Claude Opus 4.6", description: "가장 지능적인 모델. 복잡한 아키텍처 설계, 대규모 리팩토링, 멀티스텝 추론에 탁월. 응답 속도는 느림" },
      { id: "haiku", name: "Claude Haiku 4.5", description: "가장 빠르고 경제적인 모델. 간단한 질문, 코드 리뷰, 빠른 수정에 적합. 복잡한 작업에는 부적합" },
    ],
    description: "원격 CLI 제어",
  },
  anthropic: {
    name: "Anthropic API",
    icon: "A",
    models: [
      { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4", description: "Anthropic API 직접 호출. 코딩과 분석에 강하며 빠른 응답 속도. MCP 도구 없이 순수 대화" },
      { id: "claude-opus-4-20250514", name: "Claude Opus 4", description: "Anthropic API 직접 호출. 최고 수준의 추론과 코딩 능력. 긴 컨텍스트 처리에 탁월" },
      { id: "claude-haiku-4-5-20251001", name: "Claude Haiku 4.5", description: "Anthropic API 직접 호출. 초고속 응답. 간단한 대화와 빠른 작업에 최적" },
    ],
    description: "API 직접 호출",
  },
  openai: {
    name: "OpenAI",
    icon: "O",
    models: [
      { id: "gpt-4o", name: "GPT-4o", description: "OpenAI 최신 플래그십. 텍스트, 이미지, 코드 멀티모달 처리. 높은 정확도" },
      { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "GPT-4o의 경량 버전. 빠르고 저렴. 간단한 작업에 적합" },
    ],
    description: "OpenAI API",
  },
};

export const PROVIDER_IDS = Object.keys(LLM_PROVIDERS) as ProviderId[];

export function getDefaultModel(providerId: ProviderId): string {
  return LLM_PROVIDERS[providerId].models[0].id;
}
