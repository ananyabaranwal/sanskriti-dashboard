"use client";
import { useState } from "react";
import api from "@/lib/api";

function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 9999, padding: "12px 16px", borderRadius: "12px", background: type === "success" ? "#F0FDF4" : "#FEF2F2", border: `1px solid ${type === "success" ? "#BBF7D0" : "#FECACA"}`, color: type === "success" ? "#15803d" : "#dc2626", fontSize: "13px", fontWeight: 500, display: "flex", alignItems: "center", gap: "10px", fontFamily: "inherit" }}>
      {type === "success" ? "✅" : "❌"} {msg}
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "17px", color: "inherit", opacity: .6 }}>×</button>
    </div>
  );
}

function ExportCard({ title, desc, icon, exports }: {
  title: string; desc: string; icon: string;
  exports: { label: string; endpoint: string; filename: string; format: string; params?: Record<string, string> }[];
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const doExport = async (exp: typeof exports[0]) => {
    setLoading(exp.label);
    try {
      const params = new URLSearchParams({ format: exp.format, ...filters, ...exp.params });
      const res = await api.get(`${exp.endpoint}?${params}`, { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a"); a.href = url; a.download = `${exp.filename}_${Date.now()}.${exp.format}`; a.click();
      setToast({ msg: `${exp.label} downloaded`, type: "success" });
    } catch { setToast({ msg: "Export failed", type: "error" }); }
    finally { setLoading(null); }
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "16px", padding: "20px 22px" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(155,0,32,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{icon}</div>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>{title}</div>
          <div style={{ fontSize: "11px", color: "#888" }}>{desc}</div>
        </div>
      </div>

      {/* Date filters if needed */}
      {(title.includes("Orders") || title.includes("Bills") || title.includes("GST")) && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
          {[{ key: "from", label: "From" }, { key: "to", label: "To" }].map(f => (
            <div key={f.key}>
              <label style={{ fontSize: "10px", fontWeight: 600, color: "#888", letterSpacing: ".06em", display: "block", marginBottom: "3px" }}>{f.label}</label>
              <input type="date" value={filters[f.key] || ""} onChange={e => setFilters(p => ({ ...p, [f.key]: e.target.value }))} style={{ padding: "6px 10px", borderRadius: "7px", border: "1.5px solid #f0f0f0", fontSize: "12px", color: "#111", background: "#f9f9f9", outline: "none", fontFamily: "inherit" }} />
            </div>
          ))}
          {title.includes("Bills") && (
            <div>
              <label style={{ fontSize: "10px", fontWeight: 600, color: "#888", letterSpacing: ".06em", display: "block", marginBottom: "3px" }}>STATE</label>
              <input type="text" placeholder="e.g. Maharashtra" value={filters.state || ""} onChange={e => setFilters(p => ({ ...p, state: e.target.value }))} style={{ padding: "6px 10px", borderRadius: "7px", border: "1.5px solid #f0f0f0", fontSize: "12px", color: "#111", background: "#f9f9f9", outline: "none", fontFamily: "inherit" }} />
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {exports.map(exp => (
          <button key={exp.label} onClick={() => doExport(exp)} disabled={loading === exp.label}
            style={{ padding: "8px 16px", borderRadius: "8px", background: exp.format === "xlsx" ? "linear-gradient(135deg,#9B0020,#7a001a)" : "#fff", color: exp.format === "xlsx" ? "#111" : "#7a001a", border: exp.format === "csv" ? "1.5px solid #f0f0f0" : "none", fontSize: "12px", fontWeight: 600, cursor: loading === exp.label ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: loading === exp.label ? 0.6 : 1 }}>
            {loading === exp.label ? "Downloading..." : `⬇ ${exp.label}`}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AdminExportPage() {
  const exportSections = [
    {
      title: "Orders Export",
      desc: "All orders with buyer, status, payment info",
      icon: "📦",
      exports: [
        { label: "Excel", endpoint: "/admin/export/orders", filename: "orders", format: "xlsx" },
        { label: "CSV",   endpoint: "/admin/export/orders", filename: "orders", format: "csv" },
      ],
    },
    {
      title: "Bills Export",
      desc: "GST invoices filtered by date, state, client",
      icon: "🧾",
      exports: [
        { label: "Excel", endpoint: "/admin/export/bills", filename: "bills", format: "xlsx" },
        { label: "CSV",   endpoint: "/admin/export/bills", filename: "bills", format: "csv" },
      ],
    },
    {
      title: "GST Summary",
      desc: "Tax collected by state and invoice type",
      icon: "📋",
      exports: [
        { label: "Excel", endpoint: "/admin/export/gst-summary", filename: "gst_summary", format: "xlsx" },
        { label: "CSV",   endpoint: "/admin/export/gst-summary", filename: "gst_summary", format: "csv" },
      ],
    },
    {
      title: "Clients Export",
      desc: "All clients with revenue and order stats",
      icon: "👥",
      exports: [
        { label: "Excel", endpoint: "/admin/export/clients", filename: "clients", format: "xlsx" },
        { label: "CSV",   endpoint: "/admin/export/clients", filename: "clients", format: "csv" },
      ],
    },
    {
      title: "Inventory Export",
      desc: "All products with stock levels and pricing",
      icon: "📦",
      exports: [
        { label: "Excel", endpoint: "/admin/export/inventory", filename: "inventory", format: "xlsx" },
        { label: "CSV",   endpoint: "/admin/export/inventory", filename: "inventory", format: "csv" },
      ],
    },
    {
      title: "Outstanding Payments",
      desc: "All unpaid bills sorted by overdue days",
      icon: "⏳",
      exports: [
        { label: "Excel", endpoint: "/admin/export/outstanding-payments", filename: "outstanding", format: "xlsx" },
        { label: "CSV",   endpoint: "/admin/export/outstanding-payments", filename: "outstanding", format: "csv" },
      ],
    },
  ];

  return (
    <div style={{ maxWidth: "1000px" }}>
      <div style={{ marginBottom: "28px" }}>
        <p style={{ fontSize: "12px", color: "#888", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "4px" }}>Admin</p>
        <h1 style={{ fontSize: "26px", fontFamily: "Georgia,serif", color: "#111", fontWeight: 400 }}>Export Center</h1>
        <p style={{ fontSize: "14px", color: "#888", marginTop: "4px" }}>One-click download for all your data</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "16px" }}>
        {exportSections.map(s => <ExportCard key={s.title} {...s} />)}
      </div>
      <style>{`input::placeholder{color:#C4A882}input:focus{border-color:#9B0020!important}`}</style>
    </div>
  );
}
