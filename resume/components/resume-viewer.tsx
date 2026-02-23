"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";

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

  // Restore variant selection from localStorage
  const initialVariantIndex = useMemo(() => {
    if (typeof window === 'undefined') return 0;
    const saved = localStorage.getItem('resume-variant');
    if (saved) {
      const currentVars = lang === 'en' ? allVariants.en : allVariants.zh;
      const idx = currentVars.findIndex(v => v.variant === saved);
      if (idx >= 0) return idx;
    }
    return 0;
  }, []);

  const [activeVariant, setActiveVariant] = useState(initialVariantIndex);
  const [downloading, setDownloading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentVariants = currentLang === "en" ? allVariants.en : allVariants.zh;
  const current = currentVariants[activeVariant] || currentVariants[0];

  const isEn = currentLang === "en";
  const paperClass = isEn ? "resume-paper-letter" : "resume-paper-a4";

  // Calculate scale for mobile to fit paper in viewport
  const wrapperRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const updateScale = useCallback(() => {
    if (!wrapperRef.current || !paperRef.current) return;
    const paperWidthPx = isEn ? 8.5 * 96 : 210 * 96 / 25.4;
    const wrapperWidth = wrapperRef.current.clientWidth;
    const padding = wrapperWidth < 900 ? 40 : 48;
    const availableWidth = wrapperWidth - padding;
    if (availableWidth < paperWidthPx) {
      const scale = availableWidth / paperWidthPx;
      wrapperRef.current.style.setProperty('--resume-scale', String(scale));
      // Compensate: set explicit height on paper to its scaled height so scroll area is correct
      const paperHeight = paperRef.current.scrollHeight;
      paperRef.current.style.marginBottom = `${-(paperHeight * (1 - scale))}px`;
    } else {
      wrapperRef.current.style.setProperty('--resume-scale', '1');
      paperRef.current.style.removeProperty('margin-bottom');
    }
  }, [isEn]);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [updateScale]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

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
          {/* Variant Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-neutral-300 cursor-pointer select-none text-sm font-medium text-neutral-900 hover:bg-neutral-100 whitespace-nowrap"
              style={{ transition: "background 150ms ease" }}
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
            >
              {current.label}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-neutral-400"
                style={{ transition: "transform 200ms ease", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {dropdownOpen && (
              <ul
                role="listbox"
                className="absolute left-0 top-[calc(100%+4px)] min-w-[140px] py-1 rounded-xl bg-white border border-neutral-200 shadow-lg z-50 hover:border-neutral-300"
                style={{ transition: "border-color 150ms ease" }}
              >
                {currentVariants.map((v, i) => (
                  <li
                    key={v.variant}
                    role="option"
                    aria-selected={i === activeVariant}
                    onClick={() => {
                      setActiveVariant(i);
                      setDropdownOpen(false);
                      localStorage.setItem('resume-variant', v.variant);
                    }}
                    className={`flex items-center gap-2 mx-1 px-2 py-1.5 rounded-lg text-sm cursor-pointer select-none whitespace-nowrap ${
                      i === activeVariant
                        ? "text-neutral-900 font-medium bg-neutral-100"
                        : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                    }`}
                    style={{ transition: "background 120ms ease, color 120ms ease" }}
                  >
                    {i === activeVariant && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                    {i !== activeVariant && <span className="inline-block w-[14px]" />}
                    {v.label}
                  </li>
                ))}
              </ul>
            )}
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
