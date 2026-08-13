"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Post } from "@/interfaces/post";
import DateFormatter from "@/app/_components/date-formatter";
import { PiCaretDownBold, PiCaretUpBold } from "react-icons/pi";

type Props = {
  writings: Post[];
  lang: string;
  isEn: boolean;
};

export function WritingSection({ writings, lang, isEn }: Props) {
  const [expanded, setExpanded] = useState(false);
  const extraRef = useRef<HTMLDivElement>(null);
  const [extraHeight, setExtraHeight] = useState(0);

  const visible = writings.slice(0, 6);
  const extra = writings.slice(6);

  useEffect(() => {
    if (extraRef.current) {
      setExtraHeight(extraRef.current.scrollHeight);
    }
  }, [extra.length]);

  const renderItem = (post: Post) => (
    <Link key={post.slug} href={`/${lang}/writing/${post.slug}`} className="group col-span-3 grid grid-cols-subgrid items-baseline border-b border-neutral-100 py-2 transition-colors duration-300 hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900">
      <div className="min-w-0 mr-3">
        <h3 className="text-base font-semibold group-hover:underline">
          {post.title}
        </h3>
      </div>
      <div className="flex items-baseline justify-end">
        {post.type && (
          <span className="inline-block rounded-lg bg-neutral-200 px-2 py-0.5 text-sm font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">{post.type}</span>
        )}
      </div>
      <span className="whitespace-nowrap text-right text-base text-neutral-600 dark:text-neutral-400">
        <DateFormatter dateString={post.date} lang={lang} />
      </span>
    </Link>
  );

  return (
    <section className="mb-20">
      <h2 className="mb-6 text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
        {isEn ? "Writing" : "写作"}
      </h2>
      <div className="grid" style={{ gridTemplateColumns: '1fr auto auto', columnGap: '0.5rem' }}>
        {visible.map(renderItem)}
        {extra.length > 0 && (
          <div
            ref={extraRef}
            className="grid grid-cols-subgrid col-span-3"
            style={{
              maxHeight: expanded ? extraHeight + 10 : 0,
              opacity: expanded ? 1 : 0,
              overflow: "hidden",
              transition: "max-height 400ms ease-in-out, opacity 300ms ease-in-out",
            }}
          >
            {extra.map(renderItem)}
          </div>
        )}
      </div>
      {extra.length > 0 && (
        <>
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-base text-neutral-500 transition-colors duration-300 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              {expanded
                ? (isEn ? "Show less" : "收起")
                : (isEn ? `View ${extra.length} more` : `查看更多 ${extra.length} 篇`)}
              {expanded ? <PiCaretUpBold className="w-4 h-4" style={{ position: 'relative', top: '1px' }} /> : <PiCaretDownBold className="w-4 h-4" style={{ position: 'relative', top: '1px' }} />}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
