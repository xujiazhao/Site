// 样式已迁移为全局类名 .markdown
import { Lightbox } from "./lightbox";

type Props = {
  content: string;
};

export function PostBody({ content }: Props) {
  return (
    <div className="max-w-[1024px] mx-auto">
      <Lightbox>
        <div
          className="markdown"
          dangerouslySetInnerHTML={{ __html: content }}
          suppressHydrationWarning
        />
      </Lightbox>
    </div>
  );
}
