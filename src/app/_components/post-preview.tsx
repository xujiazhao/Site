import Link from "next/link";
import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  dateRange?: string; // Optional
  excerpt: string;
  slug: string;
  lang: string;
  section: string;
};

export function PostPreview({
  title,
  coverImage,
  date,
  dateRange,
  excerpt,
  slug,
  lang,
  section,
}: Props) {
  const href = `/${lang}/${section}/${slug}`;
  return (
    <div>
      <div className="mb-5">
        <CoverImage title={title} src={coverImage} href={href} />
      </div>
      <h3 className="text-3xl mb-3 leading-snug">
        <Link
          href={href}
          className="hover:underline"
        >
          {title}
        </Link>
      </h3>
      <div className="text-lg mb-4">
        {dateRange ? <p>{dateRange}</p> : <DateFormatter dateString={date} />}
      </div>
      <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
    </div>
  );
}
