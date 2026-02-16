import cn from "classnames";
import Link from "next/link";

type Props = {
  title: string;
  src: string;
  slug?: string;
  href?: string;
};

const CoverImage = ({ title, src, slug, href }: Props) => {
  if (!src) return null;

  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`Cover Image for ${title}`}
      className={cn("shadow-sm w-full", {
        "hover:shadow-lg transition-shadow duration-200": slug || href,
      })}
    />
  );
  return (
    <div className="sm:mx-0">
      {slug || href ? (
        <Link href={href || `/posts/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  );
};

export default CoverImage;
