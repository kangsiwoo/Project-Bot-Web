"use client";

import { useState, useRef, useEffect } from "react";
import { LLM_PROVIDERS, PROVIDER_IDS } from "@/lib/llm-providers";
import type { ProviderId, LLMModel } from "@/lib/llm-providers";

interface ModelSelectorProps {
  selectedProvider: ProviderId;
  selectedModel: string;
  onProviderChange: (provider: ProviderId) => void;
  onModelChange: (model: string) => void;
}

export function ModelSelector({
  selectedProvider,
  selectedModel,
  onProviderChange,
  onModelChange,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredModel, setHoveredModel] = useState<{
    model: LLMModel;
    providerId: ProviderId;
    top: number;
  } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const currentProvider = LLM_PROVIDERS[selectedProvider];
  const currentModel = currentProvider.models.find(
    (m) => m.id === selectedModel
  );

  return (
    <div ref={ref} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-mono hover:bg-accent transition-colors cursor-pointer"
      >
        <span className="flex h-4 w-4 items-center justify-center rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-[9px] font-bold leading-none">
          {currentProvider.icon}
        </span>
        <span className="font-medium">
          {currentModel?.name ?? selectedModel}
        </span>
        <svg
          className={`h-3 w-3 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 flex items-start">
          {/* Menu Panel */}
          <div ref={menuRef} className="relative w-56 rounded-lg border border-border bg-popover p-1 shadow-lg">
            {PROVIDER_IDS.map((pid) => {
              const provider = LLM_PROVIDERS[pid];
              return (
                <div key={pid} className="mb-0.5">
                  {/* Provider Header */}
                  <div className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider select-none">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-muted text-[9px] font-bold leading-none">
                      {provider.icon}
                    </span>
                    {provider.name}
                  </div>
                  {/* Model List */}
                  {provider.models.map((model) => {
                    const isSelected =
                      selectedProvider === pid &&
                      selectedModel === model.id;
                    return (
                      <button
                        key={model.id}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const menuRect = menuRef.current?.getBoundingClientRect();
                          const top = rect.top - (menuRect?.top ?? 0);
                          setHoveredModel({ model, providerId: pid, top });
                        }}
                        onMouseLeave={() => setHoveredModel(null)}
                        onClick={() => {
                          onProviderChange(pid);
                          onModelChange(model.id);
                          setIsOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-accent text-accent-foreground font-medium"
                            : "hover:bg-accent/50"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isSelected && (
                            <svg
                              className="h-3 w-3 text-indigo-600 dark:text-indigo-400 shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                          {!isSelected && <span className="w-3 shrink-0" />}
                          {model.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Description Tooltip (appears next to hovered item) */}
          {hoveredModel && (
            <div
              className="absolute left-full ml-2 w-52 rounded-lg border border-border bg-popover p-3 shadow-lg animate-in fade-in-0 duration-75"
              style={{ top: hoveredModel.top }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-[9px] font-bold leading-none">
                  {LLM_PROVIDERS[hoveredModel.providerId].icon}
                </span>
                <p className="text-xs font-semibold">
                  {hoveredModel.model.name}
                </p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {hoveredModel.model.description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
