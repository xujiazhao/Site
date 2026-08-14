"use client";

import Link from "next/link";
import { useState } from "react";

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
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  return (
    <div
      className="flex bg-white/40 text-base whitespace-nowrap dark:bg-neutral-950/40"
      onMouseOver={(event) => {
        const cell = (event.target as HTMLElement).closest<HTMLElement>("[data-row]");
        if (cell?.dataset.row) setHoveredRow(cell.dataset.row);
      }}
      onMouseLeave={() => setHoveredRow(null)}
    >
      {/* ===== Pinned left column (outside scroll container) ===== */}
      <div className="z-10 flex-shrink-0">
        {/* Header */}
        <div className={`${HEADER_H} flex items-center border-b border-neutral-200 pr-2 font-semibold text-neutral-500 dark:border-neutral-800 dark:text-neutral-400`}>
          {icon}
          <span className="hidden md:inline ml-1.5">{isEn ? "Name" : "名称"}</span>
        </div>
        {/* Rows */}
        {experiences.map((exp) => (
          <Link
            key={exp.slug}
            href={`/${lang}/experience/${exp.slug}`}
            data-row={exp.slug}
            className={`${ROW_H} flex cursor-pointer items-center border-b border-neutral-100 pr-2 font-semibold transition-[background-color] duration-300 dark:border-neutral-800 ${
              hoveredRow === exp.slug
                ? "bg-neutral-100/75 dark:bg-neutral-800/70"
                : "bg-transparent"
            }`}
          >
            {exp.favicon && (
              <img src={exp.favicon} alt="" className="w-4 h-4 flex-shrink-0" />
            )}
            <span className="hidden md:inline ml-1.5">{exp.title}</span>
          </Link>
        ))}
      </div>

      {/* ===== Scrollable right area ===== */}
      <div className="overflow-x-auto flex-1 min-w-0">
        <div className="exp-scroll-grid">
          {/* Header */}
          <div className={`${HEADER_H} flex items-center border-b border-neutral-200 pr-5 font-semibold text-neutral-500 dark:border-neutral-800 dark:text-neutral-400 md:hidden`}>
            {isEn ? "Name" : "名称"}
          </div>
          <div className={`${HEADER_H} flex items-center border-b border-neutral-200 pr-5 font-semibold text-neutral-500 dark:border-neutral-800 dark:text-neutral-400`}>
            {isEn ? "Time Range" : "时间"}
          </div>
          <div className={`${HEADER_H} flex items-center border-b border-neutral-200 pr-5 font-semibold text-neutral-500 dark:border-neutral-800 dark:text-neutral-400`}>
            {isEn ? "Location" : "地点"}
          </div>
          <div className={`${HEADER_H} flex items-center border-b border-neutral-200 pr-5 font-semibold text-neutral-500 dark:border-neutral-800 dark:text-neutral-400`}>
            {isEn ? "Type" : "类型"}
          </div>
          <div className={`${HEADER_H} flex items-center border-b border-neutral-200 pr-2 font-semibold text-neutral-500 dark:border-neutral-800 dark:text-neutral-400`}>
            {isEn ? "Area" : "领域"}
          </div>

          {/* Rows */}
          {experiences.map((exp) => {
            const href = `/${lang}/experience/${exp.slug}`;
            return [
              <Link
                key={`${exp.slug}-name`}
                href={href}
                data-row={exp.slug}
                className={`${ROW_H} flex cursor-pointer items-center border-b border-neutral-100 pr-5 font-semibold transition-[background-color] duration-300 dark:border-neutral-800 md:hidden ${hoveredRow === exp.slug ? "bg-neutral-100/75 dark:bg-neutral-800/70" : ""}`}
              >
                {exp.title}
              </Link>,
              <Link
                key={`${exp.slug}-date`}
                href={href}
                data-row={exp.slug}
                className={`${ROW_H} flex cursor-pointer items-center border-b border-neutral-100 pr-5 text-neutral-600 transition-[background-color] duration-300 dark:border-neutral-800 dark:text-neutral-400 ${hoveredRow === exp.slug ? "bg-neutral-100/75 dark:bg-neutral-800/70" : ""}`}
              >
                {exp.dateRange || exp.date}
              </Link>,
              <Link
                key={`${exp.slug}-loc`}
                href={href}
                data-row={exp.slug}
                className={`${ROW_H} flex cursor-pointer items-center border-b border-neutral-100 pr-5 text-neutral-600 transition-[background-color] duration-300 dark:border-neutral-800 dark:text-neutral-400 ${hoveredRow === exp.slug ? "bg-neutral-100/75 dark:bg-neutral-800/70" : ""}`}
              >
                {exp.location}
              </Link>,
              <Link
                key={`${exp.slug}-type`}
                href={href}
                data-row={exp.slug}
                className={`${ROW_H} flex cursor-pointer items-center border-b border-neutral-100 pr-5 text-neutral-600 transition-[background-color] duration-300 dark:border-neutral-800 dark:text-neutral-400 ${hoveredRow === exp.slug ? "bg-neutral-100/75 dark:bg-neutral-800/70" : ""}`}
              >
                {exp.type}
              </Link>,
              <Link
                key={`${exp.slug}-area`}
                href={href}
                data-row={exp.slug}
                className={`${ROW_H} flex cursor-pointer items-center border-b border-neutral-100 pr-2 transition-[background-color] duration-300 dark:border-neutral-800 ${hoveredRow === exp.slug ? "bg-neutral-100/75 dark:bg-neutral-800/70" : ""}`}
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
                              ? "bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-900"
                              : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                          }`}
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>
                )}
              </Link>,
            ];
          })}
        </div>
      </div>
    </div>
  );
}
