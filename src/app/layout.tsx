import { GeistSans } from "geist/font/sans";
import "@fontsource-variable/noto-sans-sc/wght.css";
import { CustomCursor } from "./_components/custom-cursor";
import "./[lang]/globals.css";

const THEME_INIT_SCRIPT = `
  (() => {
    try {
      const savedTheme = localStorage.getItem("site-theme");
      const isDark = savedTheme === "dark" ||
        (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", isDark);
      document.documentElement.style.colorScheme = isDark ? "dark" : "light";
      document.querySelector('meta[name="theme-color"]')?.setAttribute(
        "content",
        isDark ? "#0a0a0a" : "#ffffff"
      );
      document.documentElement.classList.toggle(
        "custom-cursor-enabled",
        window.matchMedia("(hover: hover) and (pointer: fine)").matches
      );
    } catch {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#ffffff" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="bg-white font-sans text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <CustomCursor />
        <div className="ambient-backdrop" aria-hidden="true" />
        <div className="site-content-layer">{children}</div>
      </body>
    </html>
  );
}
