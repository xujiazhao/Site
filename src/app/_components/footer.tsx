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
    <footer className="border-t border-neutral-200/50">
      <Container>
        <div className="h-14 flex flex-row justify-between items-center text-base text-neutral-500">
          <div>{isEn ? "Jiazhao Xu, All rights reserved." : "许嘉昭保留所有权利"}</div>
          <div className={isResume ? "" : "hidden md:block"}>
            {isResume ? `Resume Ver. ${version}` : `Ver. ${version}`}
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
