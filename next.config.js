const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

/** @type {import('next').NextConfig} */
const sharedConfig = {
  images: {
    remotePatterns: [],
  },
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],
  outputFileTracingIncludes: {
    "/api/resume-pdf": [
      "./node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2",
    ],
  },
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/favicon/favicon.ico",
      },
    ];
  },
};

module.exports = (phase) => ({
  ...sharedConfig,
  // NODE_ENV is not guaranteed to be set when this file is evaluated.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
});
