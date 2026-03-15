"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, Loader2, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AiOutreachResponse } from "@/lib/ai/types";

function splitSuggestionLabel(text: string) {
  const firstColon = text.indexOf(":");
  if (firstColon > 0) {
    return {
      label: text.slice(0, firstColon).trim(),
      body: text.slice(firstColon + 1).trim(),
    };
  }
  return { label: "Outreach message", body: text };
}

export function AiSuggestionList({
  requestId,
  suggestions: initialSuggestions,
  bloodType,
  urgency,
  centreName,
  requiredBy,
  messageContext,
}: {
  requestId: number;
  suggestions: string[];
  bloodType: string;
  urgency: "low" | "medium" | "high" | "critical";
  centreName: string;
  requiredBy: string;
  messageContext?: string | null;
}) {
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [providerLabel, setProviderLabel] = useState<string | null>(null);

  async function copySuggestion(text: string, index: number) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      window.setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      setCopiedIndex(null);
    }
  }

  async function regenerateSuggestions() {
    setIsGenerating(true);
    setStatusMessage(null);

    try {
      const response = await fetch("/api/ai/outreach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bloodType,
          urgency,
          centreName,
          requiredBy,
          messageContext: messageContext ?? "",
        }),
      });

      const result = (await response.json()) as AiOutreachResponse & { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Could not generate AI outreach");
      }

      setSuggestions(result.suggestions);
      setProviderLabel(result.provider === "openrouter" ? "OpenRouter AI" : "Fallback templates");
      setStatusMessage(
        result.error
          ? result.error
          : result.provider === "openrouter"
            ? "AI suggestions refreshed successfully."
            : "Using fallback templates.",
      );
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Could not regenerate suggestions.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={isGenerating}
          onClick={regenerateSuggestions}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              Regenerate with AI
            </>
          )}
        </Button>
        {providerLabel ? (
          <p className="text-xs text-muted-foreground">Source: {providerLabel}</p>
        ) : null}
      </div>
      {statusMessage ? <p className="text-xs text-muted-foreground">{statusMessage}</p> : null}

      {suggestions.map((suggestion, index) => {
        const parsed = splitSuggestionLabel(suggestion);
        const isCopied = copiedIndex === index;
        return (
          <div key={`${requestId}-suggestion-${index}`} className="rounded-md border bg-background p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
              {parsed.label}
            </p>
            <p className="text-sm text-foreground/90">{parsed.body}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => copySuggestion(parsed.body, index)}
              >
                {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {isCopied ? "Copied" : "Copy message"}
              </Button>
              <Button asChild size="sm" variant="ghost">
                <Link href={`/staff/alerts?request=${requestId}`}>
                  <Send className="h-3.5 w-3.5" />
                  Use in alerts
                </Link>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
