"use client";

import { useState } from "react";
import Link from "next/link";
import { Post } from "@/interfaces/post";
import { PiCaretDownBold, PiCaretUpBold } from "react-icons/pi";
import { CoverImage } from "./cover-image";

type Props = {
  creations: Post[];
  lang: string;
  isEn: boolean;
};

export function CreationSection({ creations, lang, isEn }: Props) {
  const [showArchive, setShowArchive] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const nonArchive = creations.filter(
    (post) => !post.skill?.includes("Archive")
  );
  const archive = creations.filter(
    (post) => post.skill?.includes("Archive")
  );

  const handleToggle = () => {
    if (showArchive) {
      setIsClosing(true);
      setTimeout(() => {
        setShowArchive(false);
        setIsClosing(false);
      }, 250);
    } else {
      setShowArchive(true);
    }
  };

  const renderCard = (post: Post) => {
    const href = `/${lang}/creation/${post.slug}`;
    return (
      <Link key={post.slug} href={href} className="group block">
        {(post.coverImage || post.firstImage) && (
          <CoverImage
            src={post.coverImage || post.firstImage || ""}
            alt={post.title}
          />
        )}
        <h3 className="mt-2 text-base font-semibold group-hover:underline">{post.title}</h3>
        {post.skill && post.skill.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
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
      </Link>
    );
  };

  return (
    <section className="mb-32">
      <h2 className="mb-8 text-4xl md:text-5xl font-bold tracking-tighter leading-tight">
        {isEn ? "Creation" : "创作"}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {nonArchive.map(renderCard)}
        {showArchive && archive.map((post) => (
          <div key={post.slug} className={isClosing ? "animate-fade-out" : "animate-fade-in"}>
            {renderCard(post)}
          </div>
        ))}
      </div>
      {archive.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleToggle}
            className="flex items-center gap-1.5 text-base text-neutral-500 transition-colors duration-300 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
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
