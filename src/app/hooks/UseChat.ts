// "use client";
import React, { useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function UseChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  async function sendMessage(userMsg: string) {
    if (!userMsg.trim()) return;

    // If a previous controller exists, abort it (prevent concurrent runs)
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }

    // create controller before calling fetch
    const controller = new AbortController();
    controllerRef.current = controller;

    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMsg }),
        signal: controller.signal,
      });

      if (!res.ok) {
        // handle non-2xx early
        const text = await res.text().catch(() => "Server error");
        setMessages((m) => [...m, { role: "assistant", content: `Error: ${text}` }]);
        return;
      }

      // Ensure we have a readable stream
      if (!res.body) {
        const text = await res.text().catch(() => "Empty response");
        setMessages((m) => [...m, { role: "assistant", content: text }]);
        return;
      }

      // Add an assistant placeholder so UI can render the streaming text
      setMessages((msgs) => [...msgs, { role: "assistant", content: "" }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let assistantMessage = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        // decode chunk (stream: true allows partial decoding)
        assistantMessage += decoder.decode(value, { stream: true });

        // update the last assistant message in place
        setMessages((msgs) => {
          const updated = [...msgs];
          // update last assistant message (should be the placeholder)
          for (let i = updated.length - 1; i >= 0; --i) {
            if (updated[i].role === "assistant") {
              updated[i] = { ...updated[i], content: assistantMessage };
              break;
            }
          }
          return updated;
        });
      }

      // stream complete
    } catch (err: any) {
      // handle abort separately so user doesn't see a 'network error' message on cancel
      if (err.name === "AbortError") {
        // optional: mark last assistant message as cancelled or leave partial result
        // we'll leave it as-is (partial content) but stop loading
      } else {
        console.error("sendMessage error:", err);
        setMessages((m) => [...m, { role: "assistant", content: "An error occurred while fetching response." }]);
      }
    } finally {
      setLoading(false);
      // cleanup controller
      controllerRef.current = null;
    }
  }

  function stop() {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    setLoading(false);
  }

  return {
    messages,
    sendMessage,
    stop,
    loading,
    setMessages,
  };
}
