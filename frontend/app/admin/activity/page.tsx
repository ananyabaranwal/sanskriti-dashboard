"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

const actionColors: Record<string, { bg: string; color: string }> = {
  CREATE:        { bg: "#F0FDF4", color: "#15803d" },
  UPDATE:        { bg: "#EFF6FF", color: "#1d4ed8" },
  DELETE:        { bg: "#FEF2F2", color: "#dc2626" },
  STATUS_CHANGE: { bg: "#FFFBEB", color: "#854d0e" },
  EXPORT:        { bg: "#F5F3FF", color: "#6d28d9" },
  LOGIN:         { bg: "#F0FDF4", color: "#065f46" },
  LOGOUT:        { bg: "#F9FAFB", color: "#6b7280" },
  OTHER:         { bg: "#f0f0f0", color: "#7a001a" },
};

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ entity: "", action: "", from: "", to: "" });

  const fetchLogs = useCallback(async (p = 1, f = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "30" });
      if (f.entity) params.append("entity", f.entity);
      if (f.action) params.append("action", f.action);
      if (f.from)   params.append("from", f.from);
      if (f.to)     params.append("to", f.to);
      const res = await api.get(`/admin/audit-logs?${params}`);
      setLogs(res.data.logs || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.pages || 1);
      setPage(p);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const actionIcons: Record<string, string> = {
    CREATE: "✅", UPDATE: "✏️", DELETE: "🗑️",
    STATUS_CHANGE: "🔄", EXPORT: "⬇️", LOGIN: "🔑", LOGOUT: "🚪", OTHER: "📝",
  };

  return (
    <div style={{ maxWidth: "1000px" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{ fontSize: "12px", color: "#888", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "4px" }}>Admin</p>
        <h1 style={{ fontSize: "26px", fontFamily: "Georgia,serif", color: "#111", fontWeight: 400 }}>Activity Log</h1>
        <p style={{ fontSize: "14px", color: "#888", marginTop: "3px" }}>{total} total actions recorded</p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap", padding: "14px 16px", background: "#f9f9f9", borderRadius: "12px", border: "1px solid #f0f0f0" }}>
        <div>
          <label style={{ fontSize: "10px", fontWeight: 600, color: "#888", letterSpacing: ".06em", display: "block", marginBottom: "4px" }}>ENTITY</label>
          <select value={filters.entity} onChange={e => setFilters(p => ({ ...p, entity: e.target.value }))} style={{ padding: "7px 10px", borderRadius: "7px", border: "1.5px solid #f0f0f0", fontSize: "12px", color: "#111", background: "#fff", fontFamily: "inherit" }}>
            <option value="">All</option>
            {["Order", "Bill", "Client", "Product", "Seller", "Payout", "Wallet", "System"].map(e => <option key={e}>{e}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: "10px", fontWeight: 600, color: "#888", letterSpacing: ".06em", display: "block", marginBottom: "4px" }}>ACTION</label>
          <select value={filters.action} onChange={e => setFilters(p => ({ ...p, action: e.target.value }))} style={{ padding: "7px 10px", borderRadius: "7px", border: "1.5px solid #f0f0f0", fontSize: "12px", color: "#111", background: "#fff", fontFamily: "inherit" }}>
            <option value="">All</option>
            {["CREATE", "UPDATE", "DELETE", "STATUS_CHANGE", "EXPORT", "LOGIN", "LOGOUT", "OTHER"].map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
        {[{ key: "from", label: "FROM" }, { key: "to", label: "TO" }].map(f => (
          <div key={f.key}>
            <label style={{ fontSize: "10px", fontWeight: 600, color: "#888", letterSpacing: ".06em", display: "block", marginBottom: "4px" }}>{f.label}</label>
            <input type="date" value={(filters as any)[f.key]} onChange={e => setFilters(p => ({ ...p, [f.key]: e.target.value }))} style={{ padding: "7px 10px", borderRadius: "7px", border: "1.5px solid #f0f0f0", fontSize: "12px", color: "#111", background: "#fff", fontFamily: "inherit" }} />
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "6px" }}>
          <button onClick={() => fetchLogs(1, filters)} style={{ padding: "7px 16px", borderRadius: "7px", background: "#111", color: "#9B0020", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Apply</button>
          <button onClick={() => { const f = { entity: "", action: "", from: "", to: "" }; setFilters(f); fetchLogs(1, f); }} style={{ padding: "7px 14px", borderRadius: "7px", border: "1px solid #f0f0f0", background: "transparent", color: "#888", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>Reset</button>
        </div>
      </div>

      {/* Timeline */}
      {loading ? (
        Array(6).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: "72px", borderRadius: "12px", marginBottom: "10px" }} />)
      ) : logs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", background: "#fff", border: "1px solid #f0f0f0", borderRadius: "16px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>📋</div>
          <p style={{ color: "#888" }}>No activity logs found</p>
        </div>
      ) : (
        <div style={{ position: "relative", paddingLeft: "24px" }}>
          <div style={{ position: "absolute", left: "10px", top: 0, bottom: 0, width: "1px", background: "#f0f0f0" }} />
          {logs.map((log, i) => {
            const ac = actionColors[log.action] || actionColors.OTHER;
            return (
              <div key={log._id} style={{ position: "relative", marginBottom: "12px" }}>
                <div style={{ position: "absolute", left: "-20px", top: "16px", width: "20px", height: "20px", borderRadius: "50%", background: ac.bg, border: `2px solid ${ac.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px" }}>
                  {actionIcons[log.action] || "📝"}
                </div>
                <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "12px", padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                        <span style={{ padding: "2px 8px", borderRadius: "99px", fontSize: "10px", fontWeight: 700, background: ac.bg, color: ac.color }}>{log.action}</span>
                        {log.entity && <span style={{ padding: "2px 8px", borderRadius: "99px", fontSize: "10px", fontWeight: 600, background: "#f0f0f0", color: "#7a001a" }}>{log.entity}</span>}
                        {log.entityRef && <span style={{ fontSize: "11px", color: "#7a001a", fontWeight: 600 }}>{log.entityRef}</span>}
                      </div>
                      <div style={{ fontSize: "13px", color: "#111" }}>{log.description}</div>
                      {log.performedByName && (
                        <div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>by <strong style={{ color: "#7a001a" }}>{log.performedByName}</strong> · {log.performedByRole}</div>
                      )}
                    </div>
                    <div style={{ fontSize: "11px", color: "#888", whiteSpace: "nowrap", flexShrink: 0 }}>
                      {new Date(log.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}<br />
                      <span style={{ fontSize: "10px" }}>{new Date(log.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                  {/* Before/after diff */}
                  {(log.before || log.after) && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "10px" }}>
                      {log.before && (
                        <div style={{ padding: "8px 10px", background: "#FEF2F2", borderRadius: "8px", fontSize: "11px", color: "#A32D2D" }}>
                          <div style={{ fontWeight: 700, marginBottom: "3px" }}>Before</div>
                          <pre style={{ margin: 0, fontFamily: "monospace", fontSize: "10px", whiteSpace: "pre-wrap" }}>{JSON.stringify(log.before, null, 2)}</pre>
                        </div>
                      )}
                      {log.after && (
                        <div style={{ padding: "8px 10px", background: "#F0FDF4", borderRadius: "8px", fontSize: "11px", color: "#15803d" }}>
                          <div style={{ fontWeight: 700, marginBottom: "3px" }}>After</div>
                          <pre style={{ margin: 0, fontFamily: "monospace", fontSize: "10px", whiteSpace: "pre-wrap" }}>{JSON.stringify(log.after, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", padding: "16px 0" }}>
              <button onClick={() => fetchLogs(page - 1)} disabled={page === 1} style={{ padding: "7px 16px", borderRadius: "8px", border: "1px solid #f0f0f0", background: "transparent", color: page === 1 ? "#C4A882" : "#111", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "13px", fontFamily: "inherit" }}>← Prev</button>
              <span style={{ fontSize: "13px", color: "#888", padding: "7px 12px" }}>Page {page} of {totalPages}</span>
              <button onClick={() => fetchLogs(page + 1)} disabled={page === totalPages} style={{ padding: "7px 16px", borderRadius: "8px", border: "1px solid #f0f0f0", background: "transparent", color: page === totalPages ? "#C4A882" : "#111", cursor: page === totalPages ? "not-allowed" : "pointer", fontSize: "13px", fontFamily: "inherit" }}>Next →</button>
            </div>
          )}
        </div>
      )}
      <style>{`input:focus,select:focus{border-color:#9B0020!important}`}</style>
    </div>
  );
}
