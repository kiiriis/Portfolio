"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What's the Raft / Mako thesis about?",
  "What did Krish build at ISRO?",
  "Which project is the most technically impressive?",
  "What's Krish's strongest tech stack?",
];

const GREETING =
  "Hi! I'm Krish's portfolio assistant. Ask me anything about his experience, projects, research, or skills.";

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [streaming, setStreaming] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  React.useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open]);

  // Don't show the public chat assistant on admin/login screens.
  if (pathname?.startsWith("/admin") || pathname === "/login") return null;

  async function send(text: string) {
    const question = text.trim();
    if (!question || streaming) return;

    const next: ChatMessage[] = [
      ...messages,
      { role: "user", content: question },
    ];
    setMessages(next);
    setInput("");
    setStreaming(true);
    // Placeholder assistant message we stream into.
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok || !res.body) {
        const detail = await res.text().catch(() => "");
        throw new Error(detail || `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong.";
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content:
            msg.includes("OPENAI") || msg.toLowerCase().includes("api key")
              ? "The chatbot isn't configured yet (missing OpenAI key). Try again later, or reach out to Krish directly."
              : "Sorry — I hit an error answering that. Please try again.",
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  return (
    <>
      {/* Launcher */}
      <motion.button
        aria-label="Open chat"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center border border-ink bg-ink text-background shadow-hard-sm transition-colors hover:bg-primary hover:text-primary-foreground md:bottom-6 md:right-6"
        whileTap={{ scale: 0.92 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="fixed bottom-24 right-4 z-50 flex h-[min(560px,75vh)] w-[calc(100vw-2rem)] max-w-[400px] flex-col overflow-hidden border border-ink bg-card shadow-hard md:right-6"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-ink bg-secondary/50 px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center border border-ink bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-sm font-semibold leading-tight">
                  Ask about Krish
                </p>
                <p className="annotation mt-0.5 truncate text-[9px] text-muted-foreground">
                  AI assistant · answers from his real background
                </p>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="scrollbar-thin flex-1 space-y-4 overflow-y-auto px-4 py-4"
            >
              <div className="flex gap-2.5">
                <Avatar role="assistant" />
                <Bubble role="assistant">{GREETING}</Bubble>
              </div>

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-2.5",
                    m.role === "user" && "flex-row-reverse"
                  )}
                >
                  <Avatar role={m.role} />
                  <Bubble role={m.role}>
                    {m.role === "assistant" ? (
                      m.content ? (
                        <div className="prose-portfolio text-sm [&_p]:mb-2 [&_p:last-child]:mb-0">
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )
                    ) : (
                      m.content
                    )}
                  </Bubble>
                </div>
              ))}

              {messages.length === 0 && (
                <div className="space-y-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="block w-full border border-ink/30 bg-background px-3 py-2 text-left font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-ink p-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                className="h-10 flex-1 border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <button
                type="submit"
                disabled={streaming || !input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center border border-ink bg-ink text-background transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-40"
                aria-label="Send"
              >
                {streaming ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Avatar({ role }: { role: "user" | "assistant" }) {
  return (
    <span
      className={cn(
        "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border text-[10px] font-semibold",
        role === "assistant"
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-ink/30 bg-secondary text-secondary-foreground"
      )}
    >
      {role === "assistant" ? <Sparkles className="h-3.5 w-3.5" /> : "You"}
    </span>
  );
}

function Bubble({
  role,
  children,
}: {
  role: "user" | "assistant";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "max-w-[80%] border px-3.5 py-2 text-sm",
        role === "assistant"
          ? "border-ink/15 bg-secondary/60 text-foreground"
          : "border-ink bg-ink text-background"
      )}
    >
      {children}
    </div>
  );
}
