import { PostTitle } from "@/app/_components/post-title";
import DateFormatter from "@/app/_components/date-formatter";

type Props = {
  title: string;
  date: string;
  favicon?: string;
  skill?: string[];
  area?: string[];
  type?: string;
  typeBadge?: boolean;
  dateRange?: string;
  location?: string;
  showDate?: boolean;
  lang?: string;
};

export function PostHeader({ title, date, favicon, skill, area, type, typeBadge = true, dateRange, location, showDate, lang }: Props) {
  return (
    <div className="mt-8">
      <PostTitle favicon={favicon}>{title}</PostTitle>
      {(skill && skill.length > 0) || (area && area.length > 0) || type || dateRange || location || showDate ? (
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          {type && (
            typeBadge ? (
              <span className="inline-block text-sm font-medium px-2 py-0.5 rounded-lg bg-neutral-200 text-neutral-600">
                {type}
              </span>
            ) : (
              <span className="text-base text-neutral-600">
                {type}
              </span>
            )
          )}
          {area && area.map((tag) => {
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
          {skill && skill.map((tag) => (
            <span
              key={tag}
              className="inline-block text-sm font-medium px-2 py-0.5 rounded-lg bg-neutral-200 text-neutral-600"
            >
              {tag}
            </span>
          ))}
          {(dateRange || location) && (
            <span className="text-base text-neutral-600">
              {[dateRange, location].filter(Boolean).join(", ")}
            </span>
          )}
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
