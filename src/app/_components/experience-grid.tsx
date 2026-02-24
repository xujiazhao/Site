"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

type Experience = {
  slug: string;
  title: string;
  favicon?: string;
  dateRange?: string;
  date?: string;
  location?: string;
  type?: string;
  area?: string[];
};

type Props = {
  experiences: Experience[];
  lang: string;
  isEn: boolean;
  icon: React.ReactNode;
};

const ROW_H = "h-10"; // fixed row height to sync pinned & scrollable columns
const HEADER_H = "h-8";

export function ExperienceGrid({ experiences, lang, isEn, icon }: Props) {
  const router = useRouter();

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>("[data-href]");
    if (cell) router.push(cell.dataset.href!);
  }, [router]);

  const handleMouseOver = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>("[data-row]");
    if (cell) {
      document.querySelectorAll(`[data-row="${cell.dataset.row}"]`).forEach(el => {
        el.classList.add("!bg-neutral-100");
      });
    }
  }, []);

  const handleMouseOut = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>("[data-row]");
    if (cell) {
      document.querySelectorAll(`[data-row="${cell.dataset.row}"]`).forEach(el => {
        el.classList.remove("!bg-neutral-100");
      });
    }
  }, []);

  return (
    <div
      className="flex text-base whitespace-nowrap"
      onClick={handleClick}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {/* ===== Pinned left column (outside scroll container) ===== */}
      <div className="flex-shrink-0 bg-white z-10">
        {/* Header */}
        <div className={`${HEADER_H} flex items-center pr-2 font-semibold text-neutral-500 border-b`}>
          {icon}
          <span className="hidden md:inline ml-1.5">{isEn ? "Name" : "名称"}</span>
        </div>
        {/* Rows */}
        {experiences.map((exp) => (
          <div
            key={exp.slug}
            data-href={`/${lang}/experience/${exp.slug}`}
            data-row={exp.slug}
            className={`${ROW_H} flex items-center pr-2 font-semibold border-b border-neutral-100 bg-white cursor-pointer transition-colors duration-300`}
          >
            {exp.favicon && (
              <img src={exp.favicon} alt="" className="w-4 h-4 flex-shrink-0" />
            )}
            <span className="hidden md:inline ml-1.5">{exp.title}</span>
          </div>
        ))}
      </div>

      {/* ===== Scrollable right area ===== */}
      <div className="overflow-x-auto flex-1 min-w-0">
        <div className="exp-scroll-grid">
          {/* Header */}
          <div className={`${HEADER_H} flex items-center pr-5 font-semibold text-neutral-500 border-b md:hidden`}>
            {isEn ? "Name" : "名称"}
          </div>
          <div className={`${HEADER_H} flex items-center pr-5 font-semibold text-neutral-500 border-b`}>
            {isEn ? "Time Range" : "时间"}
          </div>
          <div className={`${HEADER_H} flex items-center pr-5 font-semibold text-neutral-500 border-b`}>
            {isEn ? "Location" : "地点"}
          </div>
          <div className={`${HEADER_H} flex items-center pr-5 font-semibold text-neutral-500 border-b`}>
            {isEn ? "Type" : "类型"}
          </div>
          <div className={`${HEADER_H} flex items-center pr-2 font-semibold text-neutral-500 border-b`}>
            {isEn ? "Area" : "领域"}
          </div>

          {/* Rows */}
          {experiences.map((exp) => {
            const href = `/${lang}/experience/${exp.slug}`;
            return [
              <div
                key={`${exp.slug}-name`}
                data-href={href}
                data-row={exp.slug}
                className={`${ROW_H} flex items-center pr-5 font-semibold border-b border-neutral-100 cursor-pointer transition-colors duration-300 md:hidden`}
              >
                {exp.title}
              </div>,
              <div
                key={`${exp.slug}-date`}
                data-href={href}
                data-row={exp.slug}
                className={`${ROW_H} flex items-center pr-5 text-neutral-600 border-b border-neutral-100 cursor-pointer transition-colors duration-300`}
              >
                {exp.dateRange || exp.date}
              </div>,
              <div
                key={`${exp.slug}-loc`}
                data-href={href}
                data-row={exp.slug}
                className={`${ROW_H} flex items-center pr-5 text-neutral-600 border-b border-neutral-100 cursor-pointer transition-colors duration-300`}
              >
                {exp.location}
              </div>,
              <div
                key={`${exp.slug}-type`}
                data-href={href}
                data-row={exp.slug}
                className={`${ROW_H} flex items-center pr-5 text-neutral-600 border-b border-neutral-100 cursor-pointer transition-colors duration-300`}
              >
                {exp.type}
              </div>,
              <div
                key={`${exp.slug}-area`}
                data-href={href}
                data-row={exp.slug}
                className={`${ROW_H} flex items-center pr-2 border-b border-neutral-100 cursor-pointer transition-colors duration-300`}
              >
                {exp.area && exp.area.length > 0 && (
                  <div className="flex gap-1">
                    {exp.area.map((tag) => {
                      const isHighlighted = tag.startsWith("*");
                      const label = isHighlighted ? tag.slice(1) : tag;
                      return (
                        <span
                          key={tag}
                          className={`inline-block text-sm font-medium px-2 py-0.5 rounded-lg ${
                            isHighlighted
                              ? "bg-neutral-800 text-white"
                              : "bg-neutral-200 text-neutral-600"
                          }`}
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>,
            ];
          })}
        </div>
      </div>
    </div>
  );
}
