"use client";

import React, { useRef, useState } from "react";

export default function UseChat() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);
  async function sendMessage(userMsg: string) {
    if (!userMsg.trim()) return;

    setMessages((m) => [...m, { role: "user", content: userMsg }]);

    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: userMsg }),
      signal: controllerRef.current?.signal,
    });

    // Streaming
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();

    let assistantMessage = "";

    setMessages((msgs) => [...msgs, { role: "assistant", content: "" }]);

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      // Add { stream: true } here
      assistantMessage += decoder.decode(value, { stream: true });

      setMessages((msgs) => {
        const updated = [...msgs];
        updated[updated.length - 1].content = assistantMessage;
        return updated;
      });
    }

    setLoading(false);
  }
  function stop() {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
  }

  return {
    messages,
    sendMessage,
    stop,
    loading,
    setMessages,
  };
}
