"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import UseChat from "@/app/hooks/UseChat";

export default function ChatPage() {
  const [input, setInput] = useState("");

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { messages, sendMessage, stop, setMessages, loading } = UseChat();

  // initial assistant greeting (only once)
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: "Hello! I'm AstroTalk, your astrology assistant. How can I help you today?",
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 p-4">
      <Card className="w-full max-w-3xl bg-gray-900 text-white border-gray-700">
        <CardContent className="p-4 flex flex-col h-[90vh]">
          {/* Messages */}
          <ScrollArea className="flex-1 pr-3 w-full" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg, idx) => {
                // Determine if this is the assistant message currently streaming
                const isLast = idx === messages.length - 1;
                const isStreamingAssistant = loading && isLast && msg.role === "assistant";

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      msg.role === "user" ? "ml-auto bg-blue-600" : "mr-auto bg-gray-800"
                    }`}
                  >
                    <ReactMarkdown>
                      {isStreamingAssistant ? msg.content + "..." : msg.content}
                    </ReactMarkdown>
                  </div>
                );
              })}

              {/* Optional skeleton while loading (keeps structure stable) */}
              {!messages.length && loading && (
                <div className="mr-auto bg-gray-800 p-3 rounded-lg animate-pulse">...</div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="mt-4 flex gap-2 items-center justify-center">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask something astrology related..."
              className="bg-gray-800 border-gray-700 text-white min-h-24 scroll-disable"
            />
            <Button
              onClick={handleSend}
              className="h-[60px] px-6 rounded-md bg-gray-700 p-5 cursor-pointer hover:bg-gray-800"
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  Send <Send className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
