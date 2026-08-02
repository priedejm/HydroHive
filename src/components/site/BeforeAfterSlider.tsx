import { useCallback, useRef, useState, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

export function BeforeAfterSlider({
  before,
  after,
  alt,
  className,
}: {
  before: string;
  after: string;
  alt: string;
  className?: string;
}) {
  const [pos, setPos] = useState(50);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }, []);

  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      dragging.current = true;
      e.currentTarget.setPointerCapture?.(e.pointerId);
      setFromClientX(e.clientX);
      e.preventDefault();
    },
    [setFromClientX],
  );

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!dragging.current) return;
      setFromClientX(e.clientX);
      e.preventDefault();
    },
    [setFromClientX],
  );

  const stopDragging = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative aspect-[3/4] w-full select-none overflow-hidden rounded-2xl border-2 border-dashed border-navy/20 bg-muted touch-none",
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onContextMenu={(e) => e.preventDefault()}
    >
      <img
        src={after}
        alt={`${alt} - after`}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
      />
      <img
        src={before}
        alt={`${alt} - before`}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
      />

      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-navy/80 px-2.5 py-1 text-xs font-semibold text-white">
        Before
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-gold px-2.5 py-1 text-xs font-semibold text-navy">
        After
      </span>

      <div
        className="pointer-events-none absolute inset-y-0"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div className="h-full w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white shadow-lg grid place-items-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1B2A4A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="10 6 4 12 10 18" />
            <polyline points="14 6 20 12 14 18" />
          </svg>
        </div>
      </div>
    </div>
  );
}
