// LLM 프로바이더 설정

export type ProviderId = string; // dynamic now

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

// Fallback when API is not available
export const FALLBACK_PROVIDERS: Record<string, LLMProvider> = {
  claude_code: {
    name: "Claude Code",
    icon: ">_",
    models: [
      { id: "sonnet", name: "Claude Sonnet 4.6", description: "코딩, 분석, 검색에 최적화. 빠른 속도와 높은 정확도의 균형. 대부분의 개발 작업에 권장" },
      { id: "opus", name: "Claude Opus 4.6", description: "가장 지능적인 모델. 복잡한 아키텍처 설계, 대규모 리팩토링, 멀티스텝 추론에 탁월. 응답 속도는 느림" },
      { id: "haiku", name: "Claude Haiku 4.5", description: "가장 빠르고 경제적인 모델. 간단한 질문, 코드 리뷰, 빠른 수정에 적합. 복잡한 작업에는 부적합" },
    ],
    description: "원격 Claude Code CLI 제어 (Max 플랜)",
  },
};

export function getDefaultModel(providers: Record<string, LLMProvider>, providerId: string): string {
  const provider = providers[providerId];
  return provider?.models[0]?.id ?? "sonnet";
}
