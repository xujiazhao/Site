"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface ResumeVariant {
  variant: string;
  label: string;
  title: string;
  htmlContent: string;
}

interface ResumeViewerProps {
  variants: ResumeVariant[];
  lang: string;
  allVariants: {
    en: ResumeVariant[];
    zh: ResumeVariant[];
  };
}

export function ResumeViewer({ variants, lang, allVariants }: ResumeViewerProps) {
  const [currentLang, setCurrentLang] = useState(lang);
  const [activeVariant, setActiveVariant] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const currentVariants = currentLang === "en" ? allVariants.en : allVariants.zh;
  const current = currentVariants[activeVariant] || currentVariants[0];

  const isEn = currentLang === "en";
  const paperClass = isEn ? "resume-paper-letter" : "resume-paper-a4";

  // Calculate scale for mobile to fit paper in viewport
  const wrapperRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const updateScale = useCallback(() => {
    if (!wrapperRef.current) return;
    const paperWidthPx = isEn ? 8.5 * 96 : 210 * 96 / 25.4;
    const wrapperWidth = wrapperRef.current.clientWidth;
    // Account for wrapper padding (20px each side on mobile, 24px on desktop)
    const padding = wrapperWidth < 900 ? 40 : 48;
    const availableWidth = wrapperWidth - padding;
    if (availableWidth < paperWidthPx) {
      const scale = availableWidth / paperWidthPx;
      wrapperRef.current.style.setProperty('--resume-scale', String(scale));
      // Set paper height for margin-bottom compensation
      if (paperRef.current) {
        const paperHeight = paperRef.current.scrollHeight;
        paperRef.current.style.setProperty('--resume-paper-height', `${paperHeight}px`);
        // Also set width to match scaled width for centering
        paperRef.current.style.marginLeft = `${(availableWidth - paperWidthPx * scale) / 2}px`;
      }
    } else {
      wrapperRef.current.style.setProperty('--resume-scale', '1');
      if (paperRef.current) {
        paperRef.current.style.removeProperty('--resume-paper-height');
        paperRef.current.style.removeProperty('margin-left');
      }
    }
  }, [isEn]);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [updateScale]);

  const handleDownloadPDF = async () => {
    if (downloading) return;
    setDownloading(true);
    const variant = current.variant;
    const url = `/api/resume-pdf?lang=${currentLang}&variant=${variant}`;
    
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      
      if (!res.ok) throw new Error("PDF generation failed");
      
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      const now = new Date();
      const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}`;
      const name = isEn ? "JiazhaoXu" : "许嘉昭";
      const roleMap: Record<string, string> = {
        'product-designer': isEn ? 'ProductDesigner' : '产品设计师',
        'product-manager': isEn ? 'ProductManager' : '产品经理',
      };
      const role = roleMap[current.variant] || current.label;
      a.download = `${name}_${role}_${dateStr}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("PDF download failed:", err);
      alert(isEn ? "PDF generation failed. Please try again." : "PDF 生成失败，请重试。");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="resume-viewer">
      {/* Toolbar */}
      <div className="resume-toolbar">
        <div className="resume-toolbar-inner">
          {/* Variant Tabs — slider pill toggle */}
          <div
            className="relative flex items-center h-9 w-[88px] p-[3px] rounded-xl bg-neutral-100 border border-neutral-200 cursor-pointer select-none"
            role="radiogroup"
          >
            <span
              className="absolute left-[3px] h-[28px] w-[40px] rounded-[8px] bg-white shadow-sm"
              style={{ top: 'calc(50% - 14px)', transition: 'transform 200ms ease-in-out', transform: activeVariant === 0 ? 'translateX(0)' : 'translateX(40px)' }}
            />
            {currentVariants.map((v, i) => (
              <button
                key={v.variant}
                onClick={() => setActiveVariant(i)}
                className={`relative z-10 flex-1 text-center text-sm font-medium bg-transparent border-none cursor-pointer ${i === activeVariant ? "text-neutral-900" : "text-neutral-400"}`}
                style={{ transition: 'color 200ms ease-in-out' }}
              >
                {v.label}
              </button>
            ))}
          </div>

          <div className="resume-toolbar-actions">
            <span className="resume-download-hint">
              {isEn ? "PDF generation may take ~10s" : "PDF生成约需10秒"}
            </span>
            {/* Download Button */}
            <button onClick={handleDownloadPDF} className="resume-download-btn" disabled={downloading}>
              {downloading ? (
                <svg className="resume-spinner" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Paper */}
      <div ref={wrapperRef} className="resume-paper-wrapper">
        <div ref={paperRef} className={`resume-paper ${paperClass}`}>
          <div
            ref={resumeRef}
            className="resume-content"
            dangerouslySetInnerHTML={{ __html: current.htmlContent }}
          />
        </div>
      </div>
    </div>
  );
}
