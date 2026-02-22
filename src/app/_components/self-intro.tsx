"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { PiXBold } from "react-icons/pi";

type Props = {
  lang: string;
};

const ANIM_DURATION = 200; // ms, keep in sync with CSS duration-200

export function SelfIntro({ lang }: Props) {
  const isEn = lang === "en";

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

  // ✏️ Maintain your rotating titles here
  const rotatingTitles: { en: string; zh: string }[] = [
    { en: "UI Designer", zh: "UI 设计师" },
    { en: "Vibe Coder", zh: "Vibe Coder" },
    { en: "PPT Expert", zh: "PPT 专家" },
    { en: "Educator", zh: "教育者" },
    { en: "Cat Lover", zh: "猫奴" },
  ];

  const [titleIndex, setTitleIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % rotatingTitles.length);
      setAnimKey((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, [rotatingTitles.length]);

  const currentTitle = isEn ? rotatingTitles[titleIndex].en : rotatingTitles[titleIndex].zh;
  const prefixText = isEn ? "Product Designer & " : "产品设计师 & ";

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
        <p className="text-2xl md:text-3xl tracking-tight mb-8" style={{ color: '#EE9933' }}>
          {prefixText}
          <span className="inline-block" key={animKey}>
            {currentTitle.split("").map((char, i) => (
              <span
                key={i}
                className="inline-block animate-letter-bounce"
                style={{ animationDelay: `${i * 40}ms` }}
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
                I graduated from <Link href="/en/experience/artcenter-college-of-design" className="underline hover:opacity-70 transition-opacity">ArtCenter College of Design</Link>, currently working at <Link href="/en/experience/microsoft" className="underline hover:opacity-70 transition-opacity">Microsoft</Link>. I am also an entrepreneur, <Link href="/en/experience/insead-business-school" className="underline hover:opacity-70 transition-opacity">educator</Link>, and <Link href="/en/creation/ppt-expert" className="underline hover:opacity-70 transition-opacity">PPT expert</Link>.
              </p>
            </>
          ) : (
            <>
              <p className="mb-4">
                我专注于融合AI与软硬件体验，打造智能且有温度的产品。以商业成果为导向，我致力于让设计在企业中创造真实价值与可衡量的影响力。
              </p>
              <p className="mb-4">
                我本科毕业于<Link href="/zh/experience/artcenter-college-of-design" className="underline hover:opacity-70 transition-opacity">艺术中心设计学院</Link>，目前在<Link href="/zh/experience/microsoft" className="underline hover:opacity-70 transition-opacity">微软</Link>工作。我同时也是一名创业者、<Link href="/zh/experience/insead-business-school" className="underline hover:opacity-70 transition-opacity">教育者</Link>和<Link href="/zh/creation/ppt-expert" className="underline hover:opacity-70 transition-opacity">PPT专家</Link>。
              </p>
            </>
          )}
        </div>
        <div className="inline-grid grid-cols-3 gap-3 text-sm" style={{ minWidth: 0 }}>
          <a href="mailto:hello@xujiazhao.com" className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-900 transition-colors duration-300">
            {isEn ? "Email" : "发邮件"}
          </a>
          <a href="https://www.linkedin.com/in/xujiazhao/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-900 transition-colors duration-300">
            LinkedIn
          </a>
          <button
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-900 cursor-pointer transition-colors duration-300"
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
            className={`bg-white rounded-2xl p-6 max-w-xs w-full mx-4 shadow-xl transition-all duration-200 ${
              qrVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{isEn ? "Scan to add WeChat" : "扫码添加微信"}</h3>
              <button
                onClick={closeQR}
                className="text-neutral-400 hover:text-neutral-600 transition-colors text-xl leading-none"
              >
                <PiXBold />
              </button>
            </div>
            <img
              src="/assets/functional-images/wechat-qr.webp"
              alt="WeChat QR Code"
              className="w-full rounded-lg"
            />
            <p className="text-center text-sm text-neutral-500 mt-3">WeChat ID: xux-ai</p>
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
            className={`bg-white rounded-2xl p-6 max-w-xs w-full mx-4 shadow-xl transition-all duration-200 ${
              mobileVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{isEn ? "WeChat" : "微信"}</h3>
              <button
                onClick={closeMobile}
                className="text-neutral-400 hover:text-neutral-600 transition-colors text-xl leading-none"
              >
                <PiXBold />
              </button>
            </div>
            <p className="text-center text-base text-neutral-700 mb-4">WeChat ID: <span className="font-semibold">xux-ai</span></p>
            <button
              onClick={handleCopyWeChat}
              className="w-full py-2.5 rounded-xl bg-neutral-800 text-white text-sm font-medium hover:bg-neutral-700 transition-colors"
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
          <div className="bg-neutral-800 text-white text-sm px-4 py-2 rounded-full shadow-lg">
            {isEn ? "Copied!" : "已复制!"}
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
