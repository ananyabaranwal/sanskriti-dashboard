"use client";

import { ToastItem } from "@/lib/useToast";

const icons: Record<string, string> = {
  success: "✅",
  error:   "❌",
  info:    "💡",
};

const styles: Record<string, React.CSSProperties> = {
  success: { background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#15803d" },
  error:   { background: "#FEF2F2", border: "1px solid #FECACA", color: "#dc2626" },
  info:    { background: "#FFFBEB", border: "1px solid #FDE68A", color: "#854d0e" },
};

export default function ToastContainer({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null;
  return (
    <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 9999, display: "flex", flexDirection: "column", gap: "8px", pointerEvents: "none" }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => onRemove(t.id)}
          style={{
            ...styles[t.type],
            pointerEvents: "all",
            padding: "12px 16px",
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 4px 20px rgba(0,0,0,.1)",
            cursor: "pointer",
            maxWidth: "360px",
            minWidth: "240px",
            animation: "slideDown .3s ease",
            fontFamily: "'Segoe UI', sans-serif",
          }}
        >
          <span style={{ fontSize: "15px", flexShrink: 0 }}>{icons[t.type]}</span>
          <span style={{ flex: 1, lineHeight: 1.4 }}>{t.msg}</span>
          <span style={{ opacity: .5, fontSize: "16px", flexShrink: 0, lineHeight: 1 }}>×</span>
        </div>
      ))}
      <style>{`@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
