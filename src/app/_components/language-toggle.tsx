import Link from "next/link";

type Props = {
  lang: string;
};

export function LanguageToggle({ lang }: Props) {
  const isEn = lang === "en";
  const targetLang = isEn ? "zh" : "en";
  const label = isEn ? "中文" : "English";

  return (
    <div className="absolute top-5 right-5 z-50">
      <Link
        href={`/${targetLang}`}
        className="text-lg font-bold hover:underline"
      >
        {label}
      </Link>
    </div>
  );
}
