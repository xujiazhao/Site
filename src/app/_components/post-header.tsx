import { PostTitle } from "@/app/_components/post-title";

type Props = {
  title: string;
  date: string;
  favicon?: string;
};

export function PostHeader({ title, date, favicon }: Props) {
  return (
    <div className="mt-8">
      <PostTitle favicon={favicon}>{title}</PostTitle>
    </div>
  );
}
