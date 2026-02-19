"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { PiXBold, PiPaperPlaneRightFill, PiChatCircleDots, PiArrowDownBold } from "react-icons/pi";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Props = {
  lang: string;
};

export function ChatWidget({ lang }: Props) {
  const isEn = lang === "en";
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const messagesAreaRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [buttonReady, setButtonReady] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Delay button appearance to trigger fade-in on first load
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setButtonReady(true);
      });
    });
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
  });

  // Forward wheel events on backdrop to scroll the page behind
  const handleBackdropWheel = (e: React.WheelEvent) => {
    window.scrollBy(0, e.deltaY);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, lang }),
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([
        ...newMessages,
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickQuestion = (q: string) => {
    const userMsg: Message = { role: "user", content: q };
    setMessages([userMsg]);
    setIsLoading(true);
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [userMsg], lang }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages([userMsg, { role: "assistant", content: data.reply }]);
      })
      .catch(() => {
        setMessages([
          userMsg,
          {
            role: "assistant",
            content: isEn ? "Sorry, something went wrong." : "抱歉，出了点问题。",
          },
        ]);
      })
      .finally(() => setIsLoading(false));
  };

  // Animation state: "closed" | "opening" | "open" | "closing"
  const [animState, setAnimState] = useState<"closed" | "opening" | "open" | "closing">("closed");

  useEffect(() => {
    if (isOpen) {
      setAnimState("opening");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimState("open");
        });
      });
    } else if (animState === "open" || animState === "opening") {
      setAnimState("closing");
      const timer = setTimeout(() => setAnimState("closed"), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const isVisible = animState !== "closed";

  if (!mounted) return null;

  return (
    <>
      {/* Bottom-center trigger button */}
      {createPortal(
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-6 py-3 rounded-full bg-neutral-800 text-white shadow-lg hover:bg-neutral-700 hover:shadow-xl transition-all duration-300 whitespace-nowrap ${
            isVisible || !buttonReady
              ? "opacity-0 pointer-events-none"
              : "opacity-100"
          }`}
          aria-label="Open chat"
        >
          <PiChatCircleDots className="w-5 h-5" />
          <span className="text-base font-medium">
            {isEn ? "Chat with Jiazhao" : "和嘉昭聊聊"}
          </span>
        </button>,
        document.body
      )}

      {/* Chat panel — floating overlay */}
      {isVisible && createPortal(
        <div className="fixed inset-0 z-50 pointer-events-none">
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
              className="w-full h-full md:h-auto md:max-h-[70vh] md:max-w-[1024px] flex flex-col md:rounded-2xl overflow-hidden md:border md:border-neutral-200/50 md:shadow-2xl pointer-events-auto transition-all duration-300 ease-out"
              style={{
                background: "rgba(255, 255, 255, 1)",
                transform: animState === "open" ? "translateY(0)" : "translateY(100%)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-3 py-3 flex-shrink-0">
                <div className="flex items-center gap-2 pl-1">
                  <PiChatCircleDots className="w-5 h-5 text-neutral-800" />
                  <span className="font-semibold text-base text-neutral-800">
                    {isEn ? "Chat with Jiazhao" : "和嘉昭聊聊"}
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200/50 transition-colors"
                >
                  <PiXBold className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div ref={messagesAreaRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
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
                          className="text-sm px-3.5 py-2.5 rounded-2xl border border-neutral-300/60 hover:bg-neutral-200/40 transition-colors text-neutral-600"
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
                          ? "bg-neutral-800 text-white rounded-br-md"
                          : "bg-neutral-200/60 text-neutral-800 rounded-bl-md"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: (msg.content || '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                      }}
                    />
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-neutral-200/60 text-neutral-500 px-3.5 py-2.5 rounded-2xl rounded-bl-md text-sm">
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
              <div className="px-3 py-3 flex-shrink-0">
                <div className="flex items-stretch gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isEn ? "Type a message..." : "输入消息..."}
                    rows={1}
                    className="flex-1 resize-none rounded-xl border border-neutral-300/60 bg-white/60 px-3.5 py-2.5 text-base focus:outline-none focus:border-neutral-400 max-h-24"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-neutral-800 text-white disabled:opacity-30 hover:bg-neutral-700 transition-colors flex-shrink-0"
                  >
                    <PiPaperPlaneRightFill className="w-4 h-4" />
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
