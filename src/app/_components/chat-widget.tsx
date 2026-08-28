"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { RiChatSmile3Line, RiCloseLine, RiSendPlane2Line } from "react-icons/ri";
import { ChatMessageContent } from "./chat-message-content";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Props = {
  lang: string;
};

async function requestChatReply(messages: Message[], lang: string): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, lang }),
  });

  if (!response.ok) throw new Error("Chat request failed");

  const data: unknown = await response.json();
  if (
    !data ||
    typeof data !== "object" ||
    !("reply" in data) ||
    typeof data.reply !== "string"
  ) {
    throw new Error("Invalid chat response");
  }

  return data.reply;
}

export function ChatWidget({ lang }: Props) {
  const isEn = lang === "en";
  const pathname = usePathname();
  // Only show on homepage (e.g. /en or /zh)
  const isHomePage = pathname === `/${lang}` || pathname === `/${lang}/`;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const messagesAreaRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [animState, setAnimState] = useState<"closed" | "opening" | "open" | "closing">("closed");
  const isVisible = animState !== "closed";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Lock body scroll on mobile when chat is open
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${window.scrollY}px`;
    }
    return () => {
      if (isMobile) {
        const scrollY = document.body.style.top;
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
        document.body.style.top = "";
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    };
  }, [isOpen]);

  // Prevent wheel events inside chat panel from scrolling the page
  useEffect(() => {
    const panel = chatPanelRef.current;
    if (!panel) return;
    const handler = (e: WheelEvent) => {
      // Always stop propagation so backdrop handler doesn't fire
      e.stopPropagation();

      const scrollEl = messagesAreaRef.current;
      if (!scrollEl) {
        e.preventDefault();
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = scrollEl;
      const atTop = scrollTop <= 0 && e.deltaY < 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0;

      // If scrollable area can scroll in this direction, let it scroll
      if (!atTop && !atBottom && scrollHeight > clientHeight) {
        // The scroll will happen naturally on messagesAreaRef
        return;
      }

      // At boundary or no scrollable content — prevent page scroll
      e.preventDefault();
    };
    panel.addEventListener('wheel', handler, { passive: false });
    return () => panel.removeEventListener('wheel', handler);
  }, [isVisible]);

  // Forward wheel events on backdrop to scroll the page behind
  const handleBackdropWheel = (e: React.WheelEvent) => {
    window.scrollBy(0, e.deltaY);
  };

  const submitMessages = async (nextMessages: Message[]) => {
    if (isLoading) return;

    setMessages(nextMessages);
    setIsLoading(true);

    try {
      const reply = await requestChatReply(nextMessages, lang);
      setMessages([...nextMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: isEn
            ? "Sorry, something went wrong. Please try again."
            : "抱歉，出了点问题，请重试。",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setInput("");
    void submitMessages(nextMessages);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickQuestion = (q: string) => {
    if (isLoading) return;
    void submitMessages([{ role: "user", content: q }]);
  };

  useEffect(() => {
    let firstFrame = 0;
    let secondFrame = 0;
    let closeTimer: ReturnType<typeof setTimeout> | undefined;

    if (isOpen) {
      setAnimState("opening");
      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          setAnimState("open");
        });
      });
    } else {
      setAnimState((current) => current === "closed" ? current : "closing");
      closeTimer = setTimeout(() => setAnimState("closed"), 300);
    }

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      if (closeTimer) clearTimeout(closeTimer);
    };
  }, [isOpen]);

  if (!mounted) return null;
  if (!isHomePage) return null;

  return (
    <>
      {/* Bottom-center trigger button */}
      {createPortal(
        <button
          data-language-transition-floating
          data-language={lang}
          onClick={() => setIsOpen(true)}
          className={`liquid-glass-control liquid-glass-control--strong fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 animate-chat-trigger-in items-center gap-2.5 whitespace-nowrap rounded-full px-6 py-3 text-neutral-900 transition-all dark:text-neutral-100 ${
            isVisible
              ? "opacity-0 pointer-events-none"
              : "opacity-100"
          }`}
          style={{ transitionDuration: "300ms" }}
          aria-label="Open chat"
        >
          <RiChatSmile3Line className="w-5 h-5" />
          <span className="text-base font-medium">
            {isEn ? "Chat with Jiazhao" : "和嘉昭聊聊"}
          </span>
        </button>,
        document.body
      )}

      {/* Chat panel — floating overlay */}
      {isVisible && createPortal(
        <div
          data-language-transition-floating
          data-language={lang}
          className="fixed inset-0 z-50 pointer-events-none"
        >
          {/* Backdrop overlay — scroll passes through to page (hidden on mobile) */}
          <div
            className="absolute inset-0 pointer-events-auto transition-colors duration-300 hidden md:block"
            style={{
              backgroundColor: animState === "open" ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)",
            }}
            onClick={() => setIsOpen(false)}
            onWheel={handleBackdropWheel}
          />

          {/* Chat container — full screen on mobile, floating on desktop */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pointer-events-none md:pb-6 md:px-5">
            <div
              ref={chatPanelRef}
              className="liquid-glass-panel pointer-events-auto flex h-full w-full flex-col overflow-hidden transition-all duration-300 ease-out md:h-auto md:max-h-[70vh] md:max-w-[1024px] md:rounded-[32px]"
              style={{
                transform: animState === "open" ? "translateY(0)" : "translateY(100%)",
              }}
            >
              {/* Header */}
              <div className="flex flex-shrink-0 items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <RiChatSmile3Line className="h-5 w-5 text-neutral-800 dark:text-neutral-100" />
                  <span className="text-base font-semibold text-neutral-800 dark:text-neutral-100">
                    {isEn ? "Chat with Jiazhao" : "和嘉昭聊聊"}
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-200/50 hover:text-neutral-600 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                >
                  <RiCloseLine className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div ref={messagesAreaRef} className="min-h-0 flex-1 overflow-y-auto p-4">
                <div className="flex flex-col min-h-full space-y-3">
                {messages.length === 0 && (
                  <div className="flex flex-col justify-end flex-1 pb-2">
                    <div className="flex flex-wrap justify-center gap-2">
                      {(isEn
                        ? ["What are your core competencies?", "What's your skill set like?", "What makes a good AI experience?"]
                        : ["你的核心竞争力是什么？", "你的技能图谱如何？", "你觉得什么是好的AI体验？"]
                      ).map((q) => (
                        <button
                          key={q}
                          onClick={() => handleQuickQuestion(q)}
                          className="liquid-glass-control rounded-2xl px-3.5 py-2.5 text-sm text-neutral-600 transition-[color,background-color,box-shadow] dark:text-neutral-300"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "rounded-br-md bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900"
                          : "rounded-bl-md bg-neutral-200/60 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                      }`}
                    >
                      <ChatMessageContent content={msg.content || ""} />
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-md bg-neutral-200/60 px-3.5 py-2.5 text-sm text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                      <span className="inline-flex items-center gap-0.5">
                        {isEn ? "Jiazhao is typing" : "嘉昭正在编辑"}
                        <span className="inline-flex w-4">
                          <span className="animate-typing-dots"></span>
                        </span>
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="flex-shrink-0 p-4">
                <div className="flex items-stretch gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isEn ? "Type a message..." : "输入消息..."}
                    rows={1}
                    className="max-h-24 flex-1 resize-none rounded-xl border border-neutral-300/60 bg-white/60 px-3.5 py-2.5 text-base placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950/60 dark:placeholder:text-neutral-600 dark:focus:border-neutral-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className="liquid-glass-control liquid-glass-control--strong flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-neutral-900 transition-[background-color,box-shadow] disabled:opacity-30 dark:text-neutral-100"
                  >
                    <RiSendPlane2Line className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
