"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { PiXBold } from "react-icons/pi";
import { navigateWithPageLoader } from "./navigation-transition";

type Props = {
  lang: string;
};

const ANIM_DURATION = 200; // ms, keep in sync with CSS duration-200
const ROTATING_TITLES = [
  { en: "UI Designer", zh: "UI 设计师" },
  { en: "Marketing Expert", zh: "市场专家" },
  { en: "AI-native Coder", zh: "AI 原生开发者" },
  { en: "PPT Expert", zh: "PPT 专家" },
  { en: "Educator", zh: "教育者" },
  { en: "Cat Lover", zh: "猫奴" },
] as const;

const CONTACT_ACTION_CLASS =
  "liquid-glass-control inline-flex h-10 w-full appearance-none select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-5 text-sm font-normal text-neutral-900 transition-[color,background-color,border-color,box-shadow,transform] duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-neutral-100 dark:focus-visible:ring-offset-neutral-950 md:w-auto";

export function SelfIntro({ lang }: Props) {
  const isEn = lang === "en";
  const router = useRouter();
  const resumePath = `/${lang}/resume`;

  // Desktop QR modal
  const [qrMounted, setQrMounted] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);

  // Mobile WeChat modal
  const [mobileMounted, setMobileMounted] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);

  const [showToast, setShowToast] = useState(false);

  const openQR = useCallback(() => {
    setQrMounted(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setQrVisible(true)));
  }, []);

  const closeQR = useCallback(() => {
    setQrVisible(false);
    setTimeout(() => setQrMounted(false), ANIM_DURATION);
  }, []);

  const openMobile = useCallback(() => {
    setMobileMounted(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setMobileVisible(true)));
  }, []);

  const closeMobile = useCallback(() => {
    setMobileVisible(false);
    setTimeout(() => setMobileMounted(false), ANIM_DURATION);
  }, []);

  const [titleIndex, setTitleIndex] = useState(0);
  const [titleAnimationKey, setTitleAnimationKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.documentElement.classList.contains("theme-switching")) return;
      setTitleIndex((prev) => (prev + 1) % ROTATING_TITLES.length);
      setTitleAnimationKey((prev) => prev + 1);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  const currentTitle = isEn ? ROTATING_TITLES[titleIndex].en : ROTATING_TITLES[titleIndex].zh;
  const prefixText = isEn ? "Full-stack Designer & " : "全栈设计师 & ";

  const handleWeChat = () => {
    if (window.innerWidth < 768) {
      openMobile();
    } else {
      openQR();
    }
  };

  const handleCopyWeChat = () => {
    navigator.clipboard.writeText("xux-ai");
    closeMobile();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <section className="flex-col md:flex-row flex items-start md:justify-between mt-16 mb-16 md:mb-12">
      <div className="w-full">
        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8 mb-2">
          {isEn ? "Jiazhao Xu" : "许嘉昭"}
        </h1>
        <p className="mb-8 whitespace-nowrap text-[clamp(0.875rem,4.5vw,1.5rem)] tracking-tight md:text-3xl" style={{ color: '#EE9933' }}>
          {prefixText}
          <span className="inline-block" key={titleAnimationKey}>
            {currentTitle.split("").map((char, index) => (
              <span
                key={`${char}-${index}`}
                data-rotating-title-letter
                className="inline-block animate-letter-bounce"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        </p>
        <div className="text-lg leading-relaxed mb-4">
          {isEn ? (
            <>
              <p className="mb-4">
                I focus on integrating AI with software and hardware experiences to create intelligent and human-centered products. I’m driven by a results-oriented approach to design—turning creative insight into tangible business value and lasting impact.
              </p>
              <p className="mb-4">
                I graduated from <Link href="/en/experience/artcenter-college-of-design" className="animated-weight-link underline">ArtCenter College of Design</Link> and currently work at <Link href="/en/experience/netease-games" className="animated-weight-link underline">NetEase Games</Link>. I am also an entrepreneur, <Link href="/en/experience/insead-business-school" className="animated-weight-link underline">educator</Link>, and <Link href="/en/creation/ppt-expert" className="animated-weight-link underline">PPT expert</Link>.
              </p>
            </>
          ) : (
            <>
              <p className="mb-4">
                我专注于融合AI与软硬件体验，打造智能且有温度的产品。以商业成果为导向，我致力于让设计在企业中创造真实价值与可衡量的影响力。
              </p>
              <p className="mb-4">
                我本科毕业于<Link href="/zh/experience/artcenter-college-of-design" className="animated-weight-link underline">艺术中心设计学院</Link>，目前在<Link href="/zh/experience/netease-games" className="animated-weight-link underline">网易互娱</Link>工作。我同时也是一名创业者、<Link href="/zh/experience/insead-business-school" className="animated-weight-link underline">教育者</Link>和<Link href="/zh/creation/ppt-expert" className="animated-weight-link underline">PPT专家</Link>。
              </p>
            </>
          )}
        </div>
        <div className="grid grid-cols-4 md:inline-flex md:flex-nowrap gap-3 text-sm">
          <Link
            href={resumePath}
            className={CONTACT_ACTION_CLASS}
            onClick={(event) => {
              if (
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
              ) {
                return;
              }

              event.preventDefault();
              navigateWithPageLoader({
                targetPathname: resumePath,
                navigate: () => router.push(resumePath),
              });
            }}
          >
            {isEn ? "Resume" : "简历"}
          </Link>
          <a
            href="mailto:hello@xujiazhao.com"
            className={`${CONTACT_ACTION_CLASS} group relative`}
            aria-describedby="email-tooltip"
          >
            {isEn ? "Email" : "邮件"}
            <span
              id="email-tooltip"
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-normal text-white opacity-0 shadow-lg transition-[opacity,transform] duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 dark:bg-neutral-100 dark:text-neutral-900"
            >
              hello@xujiazhao.com
            </span>
          </a>
          <a href="https://www.linkedin.com/in/xujiazhao/" target="_blank" rel="noopener noreferrer" className={CONTACT_ACTION_CLASS}>
            {isEn ? "LinkedIn" : "领英"}
          </a>
          <button
            type="button"
            className={`${CONTACT_ACTION_CLASS} cursor-pointer`}
            onClick={handleWeChat}
          >
            {isEn ? "WeChat" : "微信"}
          </button>
        </div>
      </div>

      {/* WeChat QR Code Modal (Desktop/Tablet) */}
      {qrMounted && createPortal(
        <div
          className={`fixed inset-0 z-[60] flex items-center justify-center transition-colors duration-200 ${
            qrVisible ? 'bg-black/50' : 'bg-black/0'
          }`}
          onClick={closeQR}
        >
          <div
            className={`liquid-glass-panel mx-4 w-full max-w-xs rounded-[32px] p-6 transition-all duration-200 ${
              qrVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{isEn ? "Scan to add WeChat" : "扫码添加微信"}</h3>
              <button
                onClick={closeQR}
                className="text-xl leading-none text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <PiXBold />
              </button>
            </div>
            <img
              src="/assets/functional-images/wechat-qr.webp"
              alt="WeChat QR Code"
              className="w-full rounded-lg"
            />
            <p className="mt-3 text-center text-sm text-neutral-500 dark:text-neutral-400">WeChat ID: xux-ai</p>
          </div>
        </div>,
        document.body
      )}

      {/* WeChat ID Modal (Mobile) */}
      {mobileMounted && createPortal(
        <div
          className={`fixed inset-0 z-[60] flex items-center justify-center transition-colors duration-200 ${
            mobileVisible ? 'bg-black/50' : 'bg-black/0'
          }`}
          onClick={closeMobile}
        >
          <div
            className={`liquid-glass-panel mx-4 w-full max-w-xs rounded-[32px] p-6 transition-all duration-200 ${
              mobileVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{isEn ? "WeChat" : "微信"}</h3>
              <button
                onClick={closeMobile}
                className="text-xl leading-none text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <PiXBold />
              </button>
            </div>
            <p className="mb-4 text-center text-base text-neutral-700 dark:text-neutral-300">WeChat ID: <span className="font-semibold">xux-ai</span></p>
            <button
              onClick={handleCopyWeChat}
              className="liquid-glass-control liquid-glass-control--strong w-full rounded-xl py-2.5 text-sm font-medium text-neutral-900 transition-[background-color,box-shadow,transform] active:scale-[0.98] dark:text-neutral-100"
            >
              {isEn ? "Copy WeChat ID" : "复制 WeChat ID 到剪贴板"}
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Toast */}
      {showToast && createPortal(
        <div className="fixed bottom-20 left-0 right-0 z-[60] flex justify-center animate-fade-in">
          <div className="rounded-full bg-neutral-800 px-4 py-2 text-sm text-white shadow-lg dark:bg-neutral-100 dark:text-neutral-900">
            {isEn ? "Copied!" : "已复制!"}
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
