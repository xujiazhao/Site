import { PostTitle } from "@/app/_components/post-title";
import DateFormatter from "@/app/_components/date-formatter";

type Props = {
  title: string;
  date: string;
  favicon?: string;
  skill?: string[];
  type?: string;
  showDate?: boolean;
  lang?: string;
};

export function PostHeader({ title, date, favicon, skill, type, showDate, lang }: Props) {
  return (
    <div className="mt-8">
      <PostTitle favicon={favicon}>{title}</PostTitle>
      {(skill && skill.length > 0) || type || showDate ? (
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          {type && (
            <span className="inline-block text-sm font-medium px-2 py-0.5 rounded-lg bg-neutral-200 text-neutral-600">
              {type}
            </span>
          )}
          {skill && skill.map((tag) => (
            <span
              key={tag}
              className="inline-block text-sm font-medium px-2 py-0.5 rounded-lg bg-neutral-200 text-neutral-600"
            >
              {tag}
            </span>
          ))}
          {showDate && (
            <span className="text-base text-neutral-600">
              <DateFormatter dateString={date} lang={lang} />
            </span>
          )}
        </div>
      ) : null}
    </div>
  );
}
