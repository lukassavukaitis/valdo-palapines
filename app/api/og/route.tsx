import { ImageResponse } from "next/og";

export const runtime = "nodejs";

/**
 * Dinaminis OG paveikslėlis (1200×630) socialiniams tinklams.
 * Naudojimas: /api/og?title=Antraštė&subtitle=Paantraštė
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "Palapinių ir renginių nuoma").slice(0, 120);
  const subtitle =
    (searchParams.get("subtitle") || "Vestuvėms ir renginiams visoje Lietuvoje").slice(0, 140);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FBF9F4",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 30, color: "#1A1B18" }}>
          <span style={{ fontWeight: 700 }}>Valdo</span>
          <span style={{ fontWeight: 700, color: "#B08D4C" }}>palapines</span>
          <span style={{ fontWeight: 700 }}>.lt</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              color: "#1A1B18",
              lineHeight: 1.05,
              maxWidth: 900,
            }}
          >
            {title}
          </div>
          <div style={{ marginTop: 24, fontSize: 32, color: "#6B6E66", maxWidth: 900 }}>
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            color: "#2F4A3C",
          }}
        >
          <div style={{ width: 44, height: 6, background: "#B08D4C", borderRadius: 3, display: "flex" }} />
          Palapinės · Baldai · Tekstilė · Apšvietimas
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
