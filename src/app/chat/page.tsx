"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

export default function ChatPage() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: userMsg }),
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 p-4">
      <Card className="w-full max-w-3xl bg-gray-900 text-white border-gray-700">
        <CardContent className="p-4 flex flex-col h-[90vh]">
          {/* Messages */}
          <ScrollArea className="flex-1 pr-3 w-full" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg min-w-[100%] ${
                    msg.role === "user"
                      ? "ml-auto bg-blue-600"
                      : "mr-auto bg-gray-800"
                  }`}
                >
                  <ReactMarkdown>
                    {loading ? msg.content + "..." : msg.content}
                  </ReactMarkdown>
                </div>
              ))}

              {loading && (
                <div className="mr-auto bg-gray-800 p-3 rounded-lg animate-pulse">
                  ...
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="mt-4 flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask something astrology related..."
              className="bg-gray-800 border-gray-700 text-white min-h-24"
            />
            <Button onClick={sendMessage} disabled={loading}>
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
