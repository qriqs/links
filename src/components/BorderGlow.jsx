import { useRef, useCallback, useState, useEffect } from "react";

function parseHSL(hslStr) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return {
    h: parseFloat(match[1]),
    s: parseFloat(match[2]),
    l: parseFloat(match[3]),
  };
}

function buildBoxShadow(glowColor, intensity) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const layers = [
    [0, 0, 0, 1, 100, true],
    [0, 0, 1, 0, 60, true],
    [0, 0, 3, 0, 50, true],
    [0, 0, 6, 0, 40, true],
    [0, 0, 15, 0, 30, true],
    [0, 0, 25, 2, 20, true],
    [0, 0, 50, 2, 10, true],
    [0, 0, 1, 0, 60, false],
    [0, 0, 3, 0, 50, false],
    [0, 0, 6, 0, 40, false],
    [0, 0, 15, 0, 30, false],
    [0, 0, 25, 2, 20, false],
    [0, 0, 50, 2, 10, false],
  ];
  return layers
    .map(([x, y, blur, spread, alpha, inset]) => {
      const a = Math.min(alpha * intensity, 100);
      return `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px hsl(${base} / ${a}%)`;
    })
    .join(", ");
}

const GRADIENT_POSITIONS = [
  "80% 55%",
  "69% 34%",
  "8% 6%",
  "41% 38%",
  "86% 85%",
  "82% 18%",
  "51% 4%",
];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildMeshGradients(colors) {
  const gradients = [];
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    gradients.push(`radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`);
  }
  gradients.push(`linear-gradient(${colors[0]} 0 100%)`);
  return gradients;
}

export default function BorderGlow({
  children,
  className = "",
  edgeSensitivity = 25,
  glowColor = "190 95 65",
  backgroundColor = "#0a0f1d",
  borderRadius = 20,
  glowRadius = 35,
  glowIntensity = 1.2,
  coneSpread = 28,
  colors = ["#00f0ff", "#7000ff", "#ff007b"],
  fillOpacity = 0.35,
}) {
  const cardRef = useRef(null);
  const borderLayerRef = useRef(null);
  const fillLayerRef = useRef(null);
  const glowLayerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const getEdgeProximityAndAngle = useCallback(
    (card, x, y) => {
      const { width, height } = card.getBoundingClientRect();
      const cx = width / 2;
      const cy = height / 2;
      const dx = x - cx;
      const dy = y - cy;

      let kx = Infinity;
      let ky = Infinity;
      if (dx !== 0) kx = cx / Math.abs(dx);
      if (dy !== 0) ky = cy / Math.abs(dy);
      const edgeProximity = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);

      let degrees = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      if (degrees < 0) degrees += 360;

      return { edgeProximity, degrees };
    },
    []
  );

  const handlePointerMove = useCallback(
    (e) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const { edgeProximity, degrees } = getEdgeProximityAndAngle(card, x, y);
      const colorSens = edgeSensitivity + 15;
      const borderOpacity = Math.max(0, (edgeProximity * 100 - colorSens) / (100 - colorSens));
      const glowOpacity = Math.max(0, (edgeProximity * 100 - edgeSensitivity) / (100 - edgeSensitivity));
      const angleDeg = `${degrees.toFixed(2)}deg`;

      // Direct DOM update - zero React reconciliation overhead
      if (borderLayerRef.current) {
        borderLayerRef.current.style.opacity = `${borderOpacity}`;
        borderLayerRef.current.style.maskImage = `conic-gradient(from ${angleDeg} at center, black ${coneSpread}%, transparent ${coneSpread + 15}%, transparent ${100 - coneSpread - 15}%, black ${100 - coneSpread}%)`;
        borderLayerRef.current.style.webkitMaskImage = borderLayerRef.current.style.maskImage;
      }

      if (fillLayerRef.current) {
        fillLayerRef.current.style.opacity = `${borderOpacity * fillOpacity}`;
        fillLayerRef.current.style.maskImage = `conic-gradient(from ${angleDeg} at center, transparent 5%, black 15%, black 85%, transparent 95%)`;
        fillLayerRef.current.style.webkitMaskImage = fillLayerRef.current.style.maskImage;
      }

      if (glowLayerRef.current) {
        glowLayerRef.current.style.opacity = `${glowOpacity}`;
        glowLayerRef.current.style.maskImage = `conic-gradient(from ${angleDeg} at center, black 3%, transparent 12%, transparent 88%, black 97%)`;
        glowLayerRef.current.style.webkitMaskImage = glowLayerRef.current.style.maskImage;
      }
    },
    [edgeSensitivity, coneSpread, fillOpacity, getEdgeProximityAndAngle]
  );

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    if (borderLayerRef.current) borderLayerRef.current.style.opacity = "0";
    if (fillLayerRef.current) fillLayerRef.current.style.opacity = "0";
    if (glowLayerRef.current) glowLayerRef.current.style.opacity = "0";
  }, []);

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const meshGradients = buildMeshGradients(colors);
  const borderBg = meshGradients.map((g) => `${g} border-box`);
  const fillBg = meshGradients.map((g) => `${g} padding-box`);
  const boxShadowStyle = buildBoxShadow(glowColor, glowIntensity);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`relative grid isolate border border-white/10 ${className}`}
      style={{
        background: backgroundColor,
        borderRadius: `${borderRadius}px`,
        transform: "translate3d(0, 0, 0.01px)",
        boxShadow:
          "rgba(0,0,0,0.2) 0 4px 12px, rgba(0,0,0,0.3) 0 12px 32px",
      }}
    >
      {/* Mesh gradient border */}
      <div
        ref={borderLayerRef}
        className="absolute inset-0 rounded-[inherit] -z-[1] pointer-events-none transition-opacity duration-300"
        style={{
          border: "1px solid transparent",
          background: [
            `linear-gradient(${backgroundColor} 0 100%) padding-box`,
            "linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box",
            ...borderBg,
          ].join(", "),
          opacity: 0,
        }}
      />

      {/* Mesh gradient fill near edges */}
      <div
        ref={fillLayerRef}
        className="absolute inset-0 rounded-[inherit] -z-[1] pointer-events-none transition-opacity duration-300 mix-blend-soft-light"
        style={{
          border: "1px solid transparent",
          background: fillBg.join(", "),
          opacity: 0,
        }}
      />

      {/* Outer glow */}
      <span
        ref={glowLayerRef}
        className="absolute pointer-events-none z-[1] rounded-[inherit] transition-opacity duration-300 mix-blend-plus-lighter"
        style={{
          inset: `${-glowRadius}px`,
          opacity: 0,
        }}
      >
        <span
          className="absolute rounded-[inherit]"
          style={{
            inset: `${glowRadius}px`,
            boxShadow: boxShadowStyle,
          }}
        />
      </span>

      <div className="flex flex-col relative z-[1]">{children}</div>
    </div>
  );
}
