// 样式已迁移为全局类名 .markdown
import { Lightbox } from "./lightbox";
import { EmbeddedMediaGuard } from "./embedded-media-guard";
import { MediaSkeleton } from "./media-skeleton";
import { MobilePreviewScaler } from "./mobile-preview-scaler";

type Props = {
  content: string;
};

export function PostBody({ content }: Props) {
  return (
    <div className="max-w-[1024px] mx-auto">
      <MobilePreviewScaler />
      <Lightbox>
        <MediaSkeleton>
          <EmbeddedMediaGuard>
            <div
              className="markdown"
              dangerouslySetInnerHTML={{ __html: content }}
              suppressHydrationWarning
            />
          </EmbeddedMediaGuard>
        </MediaSkeleton>
      </Lightbox>
    </div>
  );
}
