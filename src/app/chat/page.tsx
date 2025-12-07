"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import { Send, Sparkles, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import UseChat from "@/app/hooks/UseChat";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const router = useRouter();
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
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        el.scrollTo({
          top: el.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-slate-800/50 backdrop-blur-sm flex-shrink-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-400" />
            <span className="text-xl font-bold text-white">Astro Talk AI</span>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-slate-300 hover:text-white hover:bg-purple-900/50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Chat Container - Full Width */}
      <div className="flex-1 flex flex-col container mx-auto w-full px-4 py-6 min-h-0 overflow-hidden">
        {/* Messages Area - Scrollable */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto pr-4 mb-4 space-y-4 min-h-0"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#a855f7 #1e293b" }}
        >
          {messages.map((msg, idx) => {
            const isLast = idx === messages.length - 1;
            const isStreamingAssistant = loading && isLast && msg.role === "assistant";

            return (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-3xl rounded-lg p-4 ${
                    msg.role === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-slate-800/50 border border-purple-500/20 text-slate-200"
                  }`}
                >
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                        code: ({ children }) => (
                          <code className="bg-slate-900/50 px-1.5 py-0.5 rounded text-sm">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="bg-slate-900/50 p-3 rounded-lg overflow-x-auto mb-2">
                            {children}
                          </pre>
                        ),
                      }}
                    >
                      {isStreamingAssistant ? msg.content + "..." : msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading indicator */}
          {!messages.length && loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-4 animate-pulse">
                <Loader2 className="h-5 w-5 text-purple-400 animate-spin" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="border-t border-purple-500/20 pt-4 flex-shrink-0">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
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
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 min-h-[80px] resize-none"
                disabled={loading}
              />
            </div>
            <Button
              onClick={handleSend}
              className="h-[80px] px-8 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
