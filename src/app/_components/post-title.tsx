import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  favicon?: string;
};

export function PostTitle({ children, favicon }: Props) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter leading-tight text-left">
        {children}
      </h1>
      {favicon && (
        <img src={favicon} alt="" className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 flex-shrink-0 ml-4" />
      )}
    </div>
  );
}
