import markdownStyles from "./markdown-styles.module.css";
import { Lightbox } from "./lightbox";

type Props = {
  content: string;
};

export function PostBody({ content }: Props) {
  return (
    <div className="max-w-[1024px] mx-auto">
      <Lightbox>
        <div
          className={markdownStyles["markdown"]}
          dangerouslySetInnerHTML={{ __html: content }}
          suppressHydrationWarning
        />
      </Lightbox>
    </div>
  );
}
