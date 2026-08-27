"use client";

import Link from "next/link";
import { Post } from "@/interfaces/post";
import { PiCaretDownBold, PiCaretUpBold } from "react-icons/pi";
import { CoverImage } from "./cover-image";
import { useExpandableGrid } from "./use-expandable-grid";

type Props = {
  creations: Post[];
  lang: string;
  isEn: boolean;
};

export function CreationSection({ creations, lang, isEn }: Props) {
  const {
    containerRef: gridRef,
    contentVisible: archiveVisible,
    expanded: showArchive,
    isAnimating,
    toggle: handleToggle,
  } = useExpandableGrid<HTMLDivElement>({
    homePathname: `/${lang}`,
    sectionKey: "creation",
  });

  const nonArchive = creations.filter(
    (post) => !post.skill?.includes("Archive")
  );
  const archive = creations.filter(
    (post) => post.skill?.includes("Archive")
  );

  const renderCard = (post: Post, isArchived = false) => {
    const href = `/${lang}/creation/${post.slug}`;
    return (
      <Link
        key={post.slug}
        href={href}
        className="group block"
        data-collapse-base={isArchived ? undefined : ""}
      >
        {(post.coverImage || post.firstImage) && (
          <CoverImage
            src={post.coverImage || post.firstImage || ""}
            alt={post.title}
          />
        )}
        <div className="homepage-media-caption">
          <h3 className="mt-2 text-base font-semibold group-hover:underline">{post.title}</h3>
          {post.skill && post.skill.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {post.skill.map((tag) => (
                <span
                  key={tag}
                  className="inline-block rounded-md bg-neutral-200 px-1.5 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    );
  };

  return (
    <section className="mb-32">
      <h2 className="mb-8 text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
        {isEn ? "Creation" : "创作"}
      </h2>
      <div
        ref={gridRef}
        className="homepage-media-breakout homepage-creation-grid grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4"
      >
        {nonArchive.map((post) => renderCard(post))}
        {showArchive && archive.map((post) => (
          <div
            key={post.slug}
            className={`transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
              archiveVisible
                ? "translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-2 opacity-0"
            }`}
          >
            {renderCard(post, true)}
          </div>
        ))}
      </div>
      {archive.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleToggle}
            disabled={isAnimating}
            aria-expanded={showArchive}
            className="liquid-glass-control flex items-center gap-1.5 rounded-full px-4 py-2 text-base text-neutral-500 transition-[color,background-color,box-shadow] duration-300 hover:text-neutral-800 disabled:cursor-default dark:text-neutral-300 dark:hover:text-neutral-100"
          >
            {showArchive
              ? (isEn ? "Hide earlier works" : "收起早期作品")
              : (isEn ? `View ${archive.length} earlier works` : `查看 ${archive.length} 个早期作品`)}
            {showArchive ? <PiCaretUpBold className="w-4 h-4" style={{ position: 'relative', top: '1px' }} /> : <PiCaretDownBold className="w-4 h-4" style={{ position: 'relative', top: '1px' }} />}
          </button>
        </div>
      )}
    </section>
  );
}
