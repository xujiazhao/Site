"use client";

import Link from "next/link";
import { Post } from "@/interfaces/post";
import DateFormatter from "@/app/_components/date-formatter";
import { ExpandableToggleButton } from "./expandable-toggle-button";
import { useExpandableGrid } from "./use-expandable-grid";

type Props = {
  writings: Post[];
  lang: string;
  isEn: boolean;
};

export function WritingSection({ writings, lang, isEn }: Props) {
  const {
    containerRef: gridRef,
    contentVisible,
    expanded,
    isAnimating,
    toggle,
  } = useExpandableGrid<HTMLDivElement>({
    homePathname: `/${lang}`,
    sectionKey: "writing",
  });

  const visible = writings.slice(0, 6);
  const extra = writings.slice(6);

  const renderItem = (post: Post, isExtra = false) => (
    <Link
      key={post.slug}
      href={`/${lang}/writing/${post.slug}`}
      data-collapse-base={isExtra ? undefined : ""}
      className={`group col-span-3 grid grid-cols-subgrid items-baseline border-b border-neutral-100 py-2 transition-[color,background-color,opacity,transform] duration-300 hover:bg-neutral-100 motion-reduce:transition-none dark:border-neutral-800 dark:hover:bg-neutral-900 ${
        isExtra
          ? contentVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
          : ""
      }`}
    >
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
      <div
        ref={gridRef}
        className="grid"
        style={{ gridTemplateColumns: '1fr auto auto', columnGap: '0.5rem' }}
      >
        {visible.map((post) => renderItem(post))}
        {expanded && extra.map((post) => renderItem(post, true))}
      </div>
      {extra.length > 0 && (
        <>
          <div className="flex justify-center mt-6">
            <ExpandableToggleButton
              onClick={toggle}
              disabled={isAnimating}
              expanded={expanded}
              label={expanded
                ? (isEn ? "Show less" : "收起")
                : (isEn ? `View ${extra.length} more` : `查看更多 ${extra.length} 篇`)}
            />
          </div>
        </>
      )}
    </section>
  );
}
