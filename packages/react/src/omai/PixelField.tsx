import {
  useCallback,
  useEffect,
  useRef,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cn, mergeRefs, usePrefersReducedMotion } from '../utils';

export interface PixelFieldProps extends ComponentPropsWithRef<'div'> {
  pattern?: 'wave' | 'rain' | 'noise' | 'logo' | 'static';
  cellSize?: number;
  gap?: number;
  speed?: number;
  interactive?: boolean;
  paused?: boolean;
  height?: number | string;
  children?: ReactNode;
}

interface FieldPalette {
  bg: string;
  dim: string;
  mid: string;
  lit: string;
  hover: string;
  crest: string;
}

const FALLBACK_PALETTE: FieldPalette = {
  bg: '#0e0e14',
  dim: '#39482e',
  mid: '#678549',
  lit: '#9ece6a',
  hover: '#bbdd97',
  crest: '#daecc6',
};

function readPalette(el: HTMLElement | null): FieldPalette {
  if (!el || typeof window === 'undefined') return FALLBACK_PALETTE;
  const styles = window.getComputedStyle(el);
  const read = (prop: string, fallback: string) => {
    const val = styles.getPropertyValue(prop).trim();
    return val || fallback;
  };
  return {
    bg: read('--omai-field-bg', FALLBACK_PALETTE.bg),
    dim: read('--omai-field-dim', FALLBACK_PALETTE.dim),
    mid: read('--omai-field-mid', FALLBACK_PALETTE.mid),
    lit: read('--omai-field-lit', FALLBACK_PALETTE.lit),
    hover: read('--omai-field-hover', FALLBACK_PALETTE.hover),
    crest: read('--omai-field-crest', FALLBACK_PALETTE.crest),
  };
}

function hash2d(x: number, y: number, seed = 0): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
  return n - Math.floor(n);
}

// 7x7 pixel "O" logo bitmap
const LOGO_MASK: readonly string[] = [
  '0111110',
  '1100011',
  '1100011',
  '1100011',
  '1100011',
  '1100011',
  '0111110',
];

export function PixelField({
  pattern = 'wave',
  cellSize = 10,
  gap = 2,
  speed = 1,
  interactive = true,
  paused = false,
  height = 320,
  children,
  className,
  style,
  ref,
  ...rest
}: PixelFieldProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const paletteRef = useRef<FieldPalette>(FALLBACK_PALETTE);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const sizeRef = useRef<{ width: number; height: number }>({ width: 640, height: 320 });
  const prefersReducedMotion = usePrefersReducedMotion();

  const mergedRef = mergeRefs(ref, rootRef);

  const drawFrame = useCallback(
    (timeMs: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height: h } = sizeRef.current;
      if (width <= 0 || h <= 0) return;

      const step = Math.max(2, cellSize + gap);
      const cols = Math.max(1, Math.floor((width + gap) / step));
      const rows = Math.max(1, Math.floor((h + gap) / step));
      const offsetX = Math.floor((width - (cols * step - gap)) / 2);
      const offsetY = Math.floor((h - (rows * step - gap)) / 2);

      const palette = paletteRef.current;
      const ramp = [palette.bg, palette.dim, palette.mid, palette.lit, palette.hover, palette.crest];
      const t = (timeMs / 1000) * speed;

      ctx.fillStyle = palette.bg;
      ctx.fillRect(0, 0, width, h);

      const pointer = interactive ? pointerRef.current : null;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let level = 0;

          if (pattern === 'static') {
            const dither = (c + r * 2) % 4 === 0 ? 0.25 : 0;
            const n = hash2d(c, r, 1) * 0.75 + dither;
            level = n > 0.85 ? 3 : n > 0.6 ? 2 : n > 0.3 ? 1 : 0;
          } else if (pattern === 'wave') {
            const v1 = Math.sin(c * 0.22 + t * 1.4);
            const v2 = Math.cos(r * 0.26 - t * 1.1);
            const v3 = Math.sin((c + r) * 0.14 + t * 0.8);
            const intensity = (v1 + v2 + v3 + 3) / 6;
            const bayer = ((c & 1) * 2 + ((c ^ r) & 1)) * 0.06;
            const val = intensity + bayer;
            level = val > 0.86 ? 4 : val > 0.68 ? 3 : val > 0.5 ? 2 : val > 0.34 ? 1 : 0;
          } else if (pattern === 'rain') {
            const colSeed = hash2d(c, 0, 7);
            const colSpeed = 4 + colSeed * 7;
            const head = ((t * colSpeed + colSeed * 30) % (rows + 8)) - 4;
            const dist = head - r;
            if (dist >= 0 && dist < 1.2) level = 5;
            else if (dist >= 1.2 && dist < 3.5) level = 3;
            else if (dist >= 3.5 && dist < 7) level = 2;
            else if (dist >= 7 && dist < 11) level = 1;
            else level = 0;
          } else if (pattern === 'noise') {
            const bucket = Math.floor(t * 4);
            const n = hash2d(c, r, bucket);
            level = n > 0.92 ? 4 : n > 0.78 ? 3 : n > 0.58 ? 2 : n > 0.35 ? 1 : 0;
          } else if (pattern === 'logo') {
            const centerC = Math.floor(cols / 2);
            const centerR = Math.floor(rows / 2);
            const scale = Math.max(1, Math.min(3, Math.floor(Math.min(cols, rows) / 11)));
            const maskW = 7 * scale;
            const maskH = 7 * scale;
            const lx = c - (centerC - Math.floor(maskW / 2));
            const ly = r - (centerR - Math.floor(maskH / 2));
            if (lx >= 0 && lx < maskW && ly >= 0 && ly < maskH) {
              const mx = Math.floor(lx / scale);
              const my = Math.floor(ly / scale);
              if (LOGO_MASK[my]?.[mx] === '1') {
                const pulse = Math.sin(t * 2 + mx * 0.4 + my * 0.4);
                level = pulse > 0.4 ? 5 : 3;
              }
            }
            if (level === 0) {
              const bgWave = Math.sin(c * 0.25 + r * 0.2 + t);
              level = bgWave > 0.6 ? 1 : 0;
            }
          }

          const px = offsetX + c * step;
          const py = offsetY + r * step;

          if (pointer) {
            const dx = px + cellSize / 2 - pointer.x;
            const dy = py + cellSize / 2 - pointer.y;
            const dist = Math.hypot(dx, dy);
            const radius = step * 5;
            if (dist < radius) {
              const boost = dist < step * 1.6 ? 5 : dist < step * 3.2 ? 4 : Math.max(level, 3);
              level = Math.max(level, boost);
            }
          }

          if (level > 0) {
            ctx.fillStyle = ramp[Math.min(ramp.length - 1, level)]!;
            ctx.fillRect(px, py, cellSize, cellSize);
          }
        }
      }
    },
    [cellSize, gap, interactive, pattern, speed],
  );

  // Sync palette with CSS variables and observe theme changes
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const refreshPalette = () => {
      paletteRef.current = readPalette(root);
      drawFrame(0);
    };

    refreshPalette();

    const observer = new MutationObserver(() => {
      refreshPalette();
    });

    const attrFilter = ['data-omai-theme', 'data-omai-mode', 'style', 'class'];
    observer.observe(document.documentElement, { attributes: true, attributeFilter: attrFilter });

    const scopedParent = root.closest('[data-omai-theme]');
    if (scopedParent && scopedParent !== document.documentElement) {
      observer.observe(scopedParent, { attributes: true, attributeFilter: attrFilter });
    }

    return () => observer.disconnect();
  }, [drawFrame]);

  // Size canvas DPR-aware via ResizeObserver
  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const syncSize = () => {
      const rect = root.getBoundingClientRect();
      const w = rect.width || root.clientWidth || 640;
      const h = rect.height || root.clientHeight || (typeof height === 'number' ? height : 320);
      sizeRef.current = { width: w, height: h };

      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      drawFrame(0);
    };

    syncSize();

    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(syncSize);
    ro.observe(root);
    return () => ro.disconnect();
  }, [drawFrame, height]);

  // Animation loop (paused or reduced-motion renders static frame)
  useEffect(() => {
    if (prefersReducedMotion || paused || pattern === 'static') {
      drawFrame(0);
      return;
    }

    let rafId = 0;
    const tick = (time: number) => {
      drawFrame(time);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [drawFrame, paused, pattern, prefersReducedMotion]);

  const rootStyle: CSSProperties = {
    height: typeof height === 'number' ? `${height}px` : height,
    ...style,
  };

  return (
    <div
      ref={mergedRef}
      className={cn('omai-pixel-field', className)}
      data-pattern={pattern}
      style={rootStyle}
      onPointerMove={
        interactive
          ? (e) => {
              const rect = rootRef.current?.getBoundingClientRect();
              if (!rect) return;
              pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
              if (prefersReducedMotion || paused || pattern === 'static') {
                drawFrame(0);
              }
            }
          : undefined
      }
      onPointerLeave={
        interactive
          ? () => {
              pointerRef.current = null;
              if (prefersReducedMotion || paused || pattern === 'static') {
                drawFrame(0);
              }
            }
          : undefined
      }
      {...rest}
    >
      <canvas ref={canvasRef} className="omai-pixel-field__canvas" aria-hidden="true" />
      {children ? <div className="omai-pixel-field__content">{children}</div> : null}
    </div>
  );
}
