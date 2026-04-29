"use client";

import {
  motion,
  type HTMLMotionProps,
  type Variants,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from "motion/react";
import {
  type ReactNode,
  useRef,
  useEffect,
  useState,
  type MouseEvent,
} from "react";

// ───────────────────────────────────────────────
// FadeUp — fade + slide up quando entra viewport
// ───────────────────────────────────────────────
export function FadeUp({
  children,
  delay = 0,
  y = 24,
  duration = 0.55,
  className,
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
} & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// ───────────────────────────────────────────────
// Stagger — orquestra children com delay incremental
// ───────────────────────────────────────────────
const STAGGER: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};
const STAGGER_ITEM: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

export function Stagger({
  children,
  className,
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  return (
    <motion.div
      variants={STAGGER}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & HTMLMotionProps<"div">) {
  return (
    <motion.div variants={STAGGER_ITEM} className={className} {...rest}>
      {children}
    </motion.div>
  );
}

// ───────────────────────────────────────────────
// RevealChars — reveal char por char (headline)
// ───────────────────────────────────────────────
export function RevealChars({
  text,
  className,
  delay = 0,
  highlight,
}: {
  text: string;
  className?: string;
  delay?: number;
  highlight?: string;
}) {
  const chars = text.split("");
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.025, delayChildren: delay },
        },
      }}
      aria-label={text}
    >
      {chars.map((c, i) => {
        const isInHighlight =
          highlight && text.indexOf(highlight) >= 0
            ? i >= text.indexOf(highlight) &&
              i < text.indexOf(highlight) + highlight.length
            : false;
        return (
          <motion.span
            key={i}
            aria-hidden
            className={isInHighlight ? "text-hzn-brand-400" : undefined}
            style={{ display: "inline-block", whiteSpace: "pre" }}
            variants={{
              hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
              show: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] },
              },
            }}
          >
            {c}
          </motion.span>
        );
      })}
    </motion.span>
  );
}

// ───────────────────────────────────────────────
// TiltCard — 3D tilt mousemove (sem libs extras)
// ───────────────────────────────────────────────
export function TiltCard({
  children,
  className,
  intensity = 8,
  glow = true,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glow?: boolean;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), {
    stiffness: 200,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), {
    stiffness: 200,
    damping: 25,
  });
  const glowX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), {
    stiffness: 200,
    damping: 25,
  });
  const glowY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), {
    stiffness: 200,
    damping: 25,
  });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  }

  function handleMouseLeave() {
    animate(x, 0, { duration: 0.5 });
    animate(y, 0, { duration: 0.5 });
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className ?? ""}`}
    >
      {glow && (
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: useTransform(
              [glowX, glowY] as never,
              ([gx, gy]: number[]) =>
                `radial-gradient(280px circle at ${gx}% ${gy}%, rgba(245,158,11,0.18), transparent 70%)`
            ),
          }}
        />
      )}
      <div style={{ transform: "translateZ(20px)" }}>{children}</div>
    </motion.div>
  );
}

// ───────────────────────────────────────────────
// Counter — anima número de 0 (ou from) até value
// ───────────────────────────────────────────────
export function Counter({
  from = 0,
  to,
  duration = 1.6,
  prefix = "",
  suffix = "",
  className,
}: {
  from?: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const [display, setDisplay] = useState(from);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(from, to, {
      duration,
      ease: [0.21, 0.47, 0.32, 0.98],
      onUpdate(v) {
        setDisplay(Math.round(v));
      },
    });
    return controls.stop;
  }, [inView, from, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

// ───────────────────────────────────────────────
// MagneticBtn — wrapper que puxa o filho pro cursor
// ───────────────────────────────────────────────
export function MagneticBtn({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 250, damping: 18, mass: 0.4 });

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
    x.set(dx);
    y.set(dy);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ───────────────────────────────────────────────
// GradientMeshBg — animated radial blobs (CSS-only mas com motion translate)
// ───────────────────────────────────────────────
export function GradientMeshBg() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute"
        style={{
          width: "60vmax",
          height: "60vmax",
          left: "5%",
          top: "-20%",
          background:
            "radial-gradient(circle, rgba(245,158,11,0.32), rgba(245,158,11,0) 70%)",
          filter: "blur(40px)",
        }}
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute"
        style={{
          width: "50vmax",
          height: "50vmax",
          right: "-10%",
          top: "20%",
          background:
            "radial-gradient(circle, rgba(217,119,6,0.22), rgba(217,119,6,0) 70%)",
          filter: "blur(48px)",
        }}
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 40, -30, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute"
        style={{
          width: "40vmax",
          height: "40vmax",
          left: "30%",
          bottom: "-20%",
          background:
            "radial-gradient(circle, rgba(180,83,9,0.18), rgba(180,83,9,0) 70%)",
          filter: "blur(56px)",
        }}
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -30, 50, 0],
          scale: [1, 1.05, 0.92, 1],
        }}
        transition={{ duration: 36, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* grid overlay sutil */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,158,11,1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}

// ───────────────────────────────────────────────
// FloatingBadge — proof badge flutuando (Hero overlay)
// ───────────────────────────────────────────────
export function FloatingBadge({
  children,
  className,
  delay = 0,
  floatY = 10,
  floatDuration = 4.5,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  floatY?: number;
  floatDuration?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -floatY, 0],
      }}
      transition={{
        opacity: { duration: 0.6, delay },
        scale: { duration: 0.6, delay },
        y: {
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 0.6,
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
