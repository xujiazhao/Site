import Container from "@/app/_components/container";

type Props = {
  lang: string;
};

export function Footer({ lang }: Props) {
  const now = new Date();
  const version = `${now.getFullYear()}.${now.getMonth() + 1}`;
  const isEn = lang === "en";

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-700">
      <Container>
        <div className="py-8 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500">
          <div>{isEn ? "Jiazhao Xu, All rights reserved." : "许嘉昭保留所有权利"}</div>
          <div className="mt-2 md:mt-0">Ver. {version}</div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
