import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { namedBrands, company } from "@/data/brand";

// Generated from code rather than shipped as a screenshot: a static export of the
// homepage goes stale the moment the design changes, which is exactly how the old
// London Chocolate card outlived the site it pictured.
export const alt =
  "Modern Supply — chocolate, fillings, sauces, syrups and ice cream ingredients, distributed across Oman since 2014.";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

// Ink palette from globals.css. Bronze-300 is the dark-theme accent (10.1:1 on
// black); ink-300 is the dark-theme muted tone (8.9:1). The card commits to the
// dark canvas in both themes — a social card has no theme to follow.
const INK_950 = "#000000";
const INK_700 = "#38383a";
const INK_300 = "#a1a1a6";
const INK_0 = "#ffffff";
const BRONZE_300 = "#e3b341";

const font = (name: string) => readFile(join(process.cwd(), "assets", name));

export default async function Image() {
  const [geistSemiBold, geistRegular, tajawalBold] = await Promise.all([
    font("Geist-SemiBold.ttf"),
    font("Geist-Regular.ttf"),
    font("Tajawal-Bold.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: INK_950,
          padding: "72px 80px",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", width: 10, height: 10, backgroundColor: BRONZE_300 }} />
          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: "0.18em",
              color: BRONZE_300,
            }}
          >
            SINCE {company.since}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 104,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: INK_0,
            }}
          >
            {company.nameEn}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 12,
              fontSize: 56,
              fontFamily: "Tajawal",
              color: INK_300,
            }}
          >
            {company.nameAr}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", height: 1, backgroundColor: INK_700 }} />
          <div
            style={{
              display: "flex",
              marginTop: 28,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Both stay on one line: a wrapped brand list collides with the
                domain, and Satori will not shrink text to fit. */}
            <div style={{ display: "flex", fontSize: 24, color: INK_300, whiteSpace: "nowrap" }}>
              {namedBrands.map((b) => b.nameEn).join("  ·  ")}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 24,
                color: BRONZE_300,
                whiteSpace: "nowrap",
                flexShrink: 0,
                marginLeft: 32,
              }}
            >
              modernsupply.om
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: geistSemiBold, weight: 600, style: "normal" },
        { name: "Geist", data: geistRegular, weight: 400, style: "normal" },
        { name: "Tajawal", data: tajawalBold, weight: 700, style: "normal" },
      ],
    },
  );
}
