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
    <Link key={post.slug} href={`/${lang}/writing/${post.slug}`} className="group flex flex-col md:flex-row md:items-baseline justify-between border-b border-neutral-100 py-2 hover:bg-neutral-100 transition-colors duration-300">
      <div className="md:w-3/4">
        <h3 className="text-base font-semibold group-hover:underline">
          {post.title}
        </h3>
      </div>
      <div className="md:w-1/4 flex items-baseline gap-2 md:justify-end mt-1 md:mt-0">
        {post.type && (
          <span className="inline-block text-sm font-medium px-2 py-0.5 rounded-lg bg-neutral-200 text-neutral-600">{post.type}</span>
        )}
        <span className="text-neutral-600 text-base whitespace-nowrap" style={{ minWidth: '6em', textAlign: 'right' }}>
          <DateFormatter dateString={post.date} lang={lang} />
        </span>
      </div>
    </Link>
  );

  return (
    <section className="mb-20">
      <h2 className="mb-6 text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
        {isEn ? "Writing" : "写作"}
      </h2>
      <div className="flex flex-col">
        {visible.map(renderItem)}
      </div>
      {extra.length > 0 && (
        <>
          <div
            ref={extraRef}
            style={{
              maxHeight: expanded ? extraHeight + 10 : 0,
              opacity: expanded ? 1 : 0,
              overflow: "hidden",
              transition: "max-height 400ms ease-in-out, opacity 300ms ease-in-out",
            }}
          >
            <div className="flex flex-col">
              {extra.map(renderItem)}
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-base text-neutral-500 hover:text-neutral-800 transition-colors duration-300"
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
