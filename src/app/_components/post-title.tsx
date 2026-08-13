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
        <img
          src={favicon}
          alt=""
          className={`ml-4 h-8 w-8 flex-shrink-0 md:h-10 md:w-10 lg:h-12 lg:w-12 ${
            favicon.includes("/appleicon.") ? "dark:invert" : ""
          }`}
        />
      )}
    </div>
  );
}
