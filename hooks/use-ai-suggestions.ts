import { useCallback, useState } from "react";

interface SuggestionsParams {
  id: string;
}

interface StreamChunk {
  chunk: string;
  isComplete: boolean;
  timestamp: number;
}

export const useAISuggestions = () => {
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestions = useCallback(async (params: SuggestionsParams) => {
    setIsStreaming(true);
    setStreamingText("");
    setError(null);

    try {
      const response = await fetch("/api/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("Failed to get response reader");
      }

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data: StreamChunk = JSON.parse(line.slice(6));
              setStreamingText((prev) => prev + data.chunk);

              if (data.isComplete) {
                setIsStreaming(false);
              }
            } catch (parseError) {
              console.error("Error parsing SSE data:", parseError);
            }
          }
        }
      }
    } catch (err) {
      console.error("Error generating suggestions:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate suggestions",
      );
      setIsStreaming(false);
    }
  }, []);

  const resetSuggestions = useCallback(() => {
    setStreamingText("");
    setIsStreaming(false);
    setError(null);
  }, []);

  return {
    streamingText,
    isStreaming,
    error,
    generateSuggestions,
    resetSuggestions,
  };
};
