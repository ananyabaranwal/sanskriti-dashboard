// frontend/components/LazyGrid.tsx
// Drop-in wrapper that lazy-loads children using IntersectionObserver
// Usage: <LazyGrid>{items.map(i => <Card key={i.id} {...i}/>)}</LazyGrid>

"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface LazyItemProps {
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
  placeholder?: ReactNode;
}

export function LazyItem({ children, threshold = 0.1, rootMargin = "200px", placeholder }: LazyItemProps) {
  const ref      = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold, rootMargin }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {visible ? children : (placeholder || <div style={{ height:"280px", background:"linear-gradient(90deg,#E8D5A3 0%,#F5E6C8 50%,#E8D5A3 100%)", backgroundSize:"200% 100%", animation:"shimmer 1.6s infinite", borderRadius:"14px" }}/>)}
      <style>{`@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>
    </div>
  );
}

interface LazyGridProps {
  children: ReactNode[];
  columns?: string;
  gap?: string;
  itemHeight?: string;
}

export function LazyGrid({ children, columns = "repeat(auto-fill, minmax(280px, 1fr))", gap = "18px", itemHeight = "280px" }: LazyGridProps) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:columns, gap }}>
      {children.map((child, i) => (
        <LazyItem key={i} placeholder={<div style={{ height:itemHeight, borderRadius:"14px", background:"linear-gradient(90deg,#E8D5A3 0%,#F5E6C8 50%,#E8D5A3 100%)", backgroundSize:"200% 100%", animation:"shimmer 1.6s infinite" }}/>}>
          {child}
        </LazyItem>
      ))}
    </div>
  );
}
