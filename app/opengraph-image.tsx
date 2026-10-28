import { ImageResponse } from "next/og";

export const alt = "Panier Perdu : récupérez les paniers abandonnés de votre boutique";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#f6f1e7",
          color: "#1d1b16",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", fontSize: 34, color: "#b4361b", letterSpacing: 4 }}>
          PANIER PERDU
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.05,
            marginTop: 28,
          }}
        >
          Récupérez les paniers abandonnés de votre boutique.
        </div>
        <div style={{ display: "flex", fontSize: 36, marginTop: 36 }}>
          29 € par mois · relances illimitées
        </div>
      </div>
    ),
    { ...size },
  );
}
