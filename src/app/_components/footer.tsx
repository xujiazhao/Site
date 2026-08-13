"use client";

import Container from "@/app/_components/container";
import { usePathname } from "next/navigation";

type Props = {
  lang: string;
};

export function Footer({ lang }: Props) {
  const pathname = usePathname();
  const now = new Date();
  const version = `${now.getFullYear()}.${now.getMonth() + 1}`;
  const isEn = lang === "en";
  const isResume = pathname.includes("/resume");

  return (
    <footer className="border-t border-neutral-200/50 dark:border-neutral-800/70">
      <Container>
        <div className="flex h-14 flex-row items-center justify-between text-base text-neutral-500 dark:text-neutral-400">
          <div>{isEn ? "Jiazhao Xu, All rights reserved." : "许嘉昭保留所有权利"}</div>
          <div className={isResume ? "" : "hidden md:block"}>
            {isResume ? `Resume. ${version}` : `Ver. ${version}`}
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
