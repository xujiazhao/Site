import { NextRequest, NextResponse } from "next/server";
import { getResumeByVariant } from "@resume/lib/resume-api";
import markdownToHtml from "@/lib/markdownToHtml";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

const isDev = process.env.NODE_ENV === "development";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "en";
  const variant = searchParams.get("variant") || "product-designer";

  const resume = getResumeByVariant(lang, variant);
  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  const htmlContent = await markdownToHtml(resume.content);
  const isEn = lang === "en";

  // Convert relative image paths to absolute URLs so Puppeteer can fetch them
  const origin = new URL(request.url).origin;
  const resolvedHtml = htmlContent.replace(
    /src="\/([^"]+)"/g,
    `src="${origin}/$1"`
  );

  const padding = isEn ? "0.55in" : "15mm";
  const width = isEn ? "8.5in" : "210mm";
  const minHeight = isEn ? "11in" : "297mm";

  const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${resume.title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  ${!isEn ? '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&display=swap" rel="stylesheet">' : ''}
  <style>
    /* Tailwind preflight subset */
    *, ::before, ::after { box-sizing: border-box; border-width: 0; border-style: solid; }
    html { line-height: 1.5; }
    body { margin: 0; line-height: inherit; }
    h1, h2, h3, h4, h5, h6, p { margin: 0; }
    ul, ol { margin: 0; padding: 0; list-style: none; }
    img { display: block; max-width: 100%; }
    a { color: inherit; text-decoration: inherit; }
    body {
      font-family: ${isEn
        ? "'Barlow', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        : "'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif"};
      color: #171717;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .resume-paper {
      width: ${width};
      min-height: ${minHeight};
      padding: ${padding};
    }
    .resume-content { width: 100%; }
    /* Scope typography under .resume-content to match web specificity */
    .resume-content h1 { font-size: 22pt; font-weight: 700; margin-bottom: 2pt; line-height: 1.2; color: #171717; display: flex; align-items: center; }
    .resume-content h1::after { content: ''; margin-left: auto; width: 22pt; height: 22pt; flex-shrink: 0; background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M44.7119 61.3301L26.6653 99.9947H3.99979C1.78826 99.9947 0 98.0371 0 95.8309V3.83578C0 1.62425 1.78826 0 3.99979 0H44.7119L30.4005 30.665H44.7119L30.4005 61.3301H44.7119ZM95.9949 0H57.2033L48.1721 19.3482H62.4835L48.1721 50.0132H99.9947V3.83578C99.9947 1.62425 98.2064 0 95.9949 0ZM39.1567 99.9947H95.9949C98.2064 99.9947 99.9947 98.0371 99.9947 95.8309V61.3354H57.2033L39.1567 100V99.9947Z' fill='%23ee9933'/%3E%3C/svg%3E"); background-size: contain; background-repeat: no-repeat; }
    .resume-content h2 { font-size: 10.5pt; font-weight: 500; margin-top: 10pt; margin-bottom: 4pt; padding-bottom: 0pt; border-bottom: none; color: #ee9933; text-transform: uppercase; }
    .resume-content h3 { font-size: 10.5pt; font-weight: 600; margin-top: 8pt; margin-bottom: 2pt; color: #171717; display: flex; align-items: center; gap: 4pt; }
    .resume-content h3 img { width: 14pt; height: 14pt; border-radius: 0; object-fit: cover; flex-shrink: 0; }
    .resume-content .resume-meta { margin-left: auto; font-size: 10.5pt; font-weight: 600; color: #737373; white-space: nowrap; flex-shrink: 0; }
    .resume-content .resume-contact { float: right; font-size: 9pt; font-weight: 400; color: #737373; }
    .resume-content .resume-contact a { color: #2563eb; text-decoration: underline; }
    .resume-content p { font-size: 9.5pt; line-height: 1.3; margin-top: 0; margin-bottom: 4pt; color: #171717; }
    .resume-content h1 + p { font-size: 10.5pt; }
    .resume-content strong { font-weight: 600; }
    .resume-content hr { display: none; }
    .resume-content ul { padding-left: 18pt; margin-top: 0pt; margin-bottom: 0pt; list-style-type: disc; }
    .resume-content li { font-size: 9.5pt; line-height: 1.2; margin-bottom: 3pt; color: #171717; margin-left: -2pt; padding-left: 2pt; }
    .resume-content li::marker { font-size: 7pt; }
    .resume-content ul ul { padding-left: 10pt; margin-top: 3pt; margin-bottom: 1pt; list-style-type: none; }
    .resume-content ul ul li::before { content: '\\2013'; position: absolute; left: -8pt; color: #171717; }
    .resume-content ul ul li { position: relative; margin-left: 0; padding-left: 0; }
    .resume-content ul ul li::marker { content: none; }
    .resume-content a { color: #b09494; text-decoration: none; }
    /* Override UI-only styles not needed in PDF */
    .resume-toolbar, .resume-paper-wrapper { display: none; }
    .resume-page { background: white; min-height: auto; }
    .resume-paper {
      box-shadow: none;
      border-radius: 0;
      overflow: visible;
    }
  </style>
</head>
<body>
  <div class="resume-paper">
    <div class="resume-content">
      ${resolvedHtml}
    </div>
  </div>
</body>
</html>`;

  const browser = await puppeteer.launch({
    args: isDev ? [] : chromium.args,
    defaultViewport: { width: 1920, height: 1080 },
    executablePath: isDev
      ? (process.platform === "win32"
        ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
        : "/usr/bin/google-chrome")
      : await chromium.executablePath(),
    headless: true,
  });

  try {
    const page = await browser.newPage();
    
    console.log(`[resume-pdf] Generating PDF for lang=${lang}, variant=${variant}`);
    
    await page.setContent(fullHtml, { waitUntil: "networkidle2", timeout: 15000 });
    
    console.log("[resume-pdf] Content set, waiting for render...");
    
    // Give time for fonts to load and CSS to render
    await new Promise(resolve => setTimeout(resolve, isEn ? 1500 : 3000));

    console.log("[resume-pdf] Measuring paper height...");

    // Get actual height of the paper
    const paperHeight = await page.evaluate(() => {
      const paper = document.querySelector(".resume-paper");
      return paper ? paper.scrollHeight : 0;
    });

    const paperWidthIn = isEn ? 8.5 : 210 / 25.4;
    const minHeightIn = isEn ? 11 : 297 / 25.4;
    const actualHeightIn = paperHeight / 96;
    const finalHeightIn = Math.max(actualHeightIn, minHeightIn);

    console.log(`[resume-pdf] Paper: ${paperWidthIn}in x ${finalHeightIn}in (actual: ${actualHeightIn}in, min: ${minHeightIn}in)`);

    const pdfBuffer = await page.pdf({
      width: `${paperWidthIn}in`,
      height: `${finalHeightIn}in`,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    await browser.close();

    // Generate filename: 许嘉昭_产品设计师_2026.02.pdf / Jiazhao_Xu_Product_Designer_2026.02.pdf
    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}`;
    const name = isEn ? "JiazhaoXu" : "许嘉昭";
    const roleMap: Record<string, string> = {
      'product-designer': isEn ? 'ProductDesigner' : '产品设计师',
      'product-manager': isEn ? 'ProductManager' : '产品经理',
    };
    const role = roleMap[resume.variant] || resume.label;
    const filename = `${name}_${role}_${dateStr}.pdf`;
    const asciiFilename = `${name}_${role}_${dateStr}.pdf`.replace(/[^\x20-\x7E]/g, '_');
    const encodedFilename = encodeURIComponent(filename);
    console.log(`[resume-pdf] Done: ${filename}, ${pdfBuffer.length} bytes`);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${asciiFilename}"; filename*=UTF-8''${encodedFilename}`,
      },
    });
  } catch (error) {
    await browser.close();
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
