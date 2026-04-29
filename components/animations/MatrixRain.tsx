"use client";

import { useEffect, useRef } from "react";

/**
 * Matrix-style code rain em canvas — paleta âmbar/grafite Horizon.
 * <5KB, 60fps em desktop, throttled em mobile, opt-out via prefers-reduced-motion.
 */
export default function MatrixRain({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return;

    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);
    const fontSize = 14 * window.devicePixelRatio;
    let columns = Math.floor(width / fontSize);
    let drops: number[] = new Array(columns).fill(0).map(() => Math.random() * -50);

    // Caracteres temáticos: snippets de código + símbolos AI/MCP
    const chars =
      "01<>{}[]()=>;@#$%^&*-+/\\|~`AIClaudeMCPGPTLLMnpmRAGRESTSDKAPIyamljson"
        .split("");

    const speeds = new Array(columns).fill(0).map(() => 0.3 + Math.random() * 0.7);

    function reset() {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(0).map(() => Math.random() * -50);
      speeds.length = columns;
      for (let i = 0; i < columns; i++) {
        if (speeds[i] === undefined) speeds[i] = 0.3 + Math.random() * 0.7;
      }
    }

    function draw() {
      if (!ctx) return;
      // Trail fade
      ctx.fillStyle = "rgba(11, 13, 18, 0.08)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px 'JetBrains Mono', 'Fira Code', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        const ch = chars[Math.floor(Math.random() * chars.length)];

        // leading char (mais brilhante)
        ctx.fillStyle = "rgba(252, 211, 77, 0.95)";
        ctx.fillText(ch, x, y);

        // trail (âmbar fading)
        const trailY = y - fontSize;
        if (trailY > 0) {
          ctx.fillStyle = "rgba(245, 158, 11, 0.45)";
          ctx.fillText(
            chars[Math.floor(Math.random() * chars.length)],
            x,
            trailY
          );
        }

        if (y > height && Math.random() > 0.975) {
          drops[i] = -10;
        }
        drops[i] += speeds[i];
      }
    }

    let raf = 0;
    let last = performance.now();
    const fpsInterval = 1000 / 30; // 30fps suficiente, economiza CPU
    function loop(now: number) {
      const elapsed = now - last;
      if (elapsed > fpsInterval) {
        last = now - (elapsed % fpsInterval);
        draw();
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(reset);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
