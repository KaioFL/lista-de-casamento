/** Textura de grão sutil sobre toda a página (sensação de papel impresso). */
export function Grain() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] mix-blend-multiply dark:opacity-[0.05] dark:mix-blend-screen"
      style={{
        backgroundImage: `url("data:image/svg+xml,${svg}")`,
        backgroundSize: "140px 140px",
      }}
    />
  );
}
