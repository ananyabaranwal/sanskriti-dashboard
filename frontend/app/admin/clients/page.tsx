"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

type Client = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  address?: { city?: string; state?: string };
  totalOrders: number;
  totalRevenue: number;
  pendingPayments: number;
  returnPercent: number;
  lastOrderAt?: string;
  notes?: { _id: string; text: string; addedByName?: string; createdAt: string }[];
};

function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, []);
  const c = type === "success"
    ? { bg: "#F0FDF4", border: "#BBF7D0", color: "#15803d", icon: "✅" }
    : { bg: "#FEF2F2", border: "#FECACA", color: "#dc2626", icon: "❌" };
  return (
    <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 9999, padding: "12px 16px", borderRadius: "12px", background: c.bg, border: `1px solid ${c.border}`, color: c.color, fontSize: "13px", fontWeight: 500, boxShadow: "0 6px 24px rgba(0,0,0,.1)", display: "flex", alignItems: "center", gap: "10px", maxWidth: "360px", fontFamily: "inherit" }}>
      <span>{c.icon}</span><span style={{ flex: 1 }}>{msg}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "17px", color: "inherit", padding: 0, opacity: .6 }}>×</button>
    </div>
  );
}

function ClientDrawer({ client, onClose, onRefresh }: { client: Client; onClose: () => void; onRefresh: () => void }) {
  const [tab, setTab] = useState<"overview" | "orders" | "notes">("overview");
  const [orders, setOrders] = useState<any[]>([]);
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (tab === "orders") {
      setLoadingOrders(true);
      api.get(`/admin/clients/${client._id}/activity`)
        .then(r => setOrders(r.data.activity || []))
        .finally(() => setLoadingOrders(false));
    }
  }, [tab, client._id]);

  const addNote = async () => {
    if (!noteText.trim()) return;
    setSaving(true);
    try {
      await api.post(`/admin/clients/${client._id}/notes`, { text: noteText });
      setNoteText("");
      onRefresh();
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const tabs = ["overview", "orders", "notes"] as const;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(44,24,16,.5)", backdropFilter: "blur(3px)" }} onClick={onClose} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "480px", background: "#fff", boxShadow: "-8px 0 48px rgba(44,24,16,.2)", overflowY: "auto", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#1A0F0A,#111,#111)", padding: "22px 24px", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg,#9B0020,#7a001a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#111", fontSize: "18px", fontWeight: 700, marginBottom: "10px" }}>{client.name.charAt(0).toUpperCase()}</div>
              <div style={{ fontSize: "20px", fontFamily: "Georgia,serif", color: "#9B0020" }}>{client.name}</div>
              <div style={{ fontSize: "12px", color: "rgba(245,230,200,.5)", marginTop: "3px" }}>{client.phone}{client.email ? ` · ${client.email}` : ""}</div>
              {client.address?.city && <div style={{ fontSize: "11px", color: "rgba(245,230,200,.4)", marginTop: "2px" }}>📍 {[client.address.city, client.address.state].filter(Boolean).join(", ")}</div>}
            </div>
            <button onClick={onClose} style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(255,255,255,.08)", border: "none", color: "#9B0020", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          </div>
          {/* Tabs */}
          <div style={{ display: "flex", gap: "6px", marginTop: "16px" }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: "6px 14px", borderRadius: "99px", fontSize: "12px", fontWeight: 600, border: "none", cursor: "pointer", background: tab === t ? "#9B0020" : "rgba(255,255,255,.08)", color: tab === t ? "#111" : "rgba(245,230,200,.6)", fontFamily: "inherit", textTransform: "capitalize" }}>{t}</button>
            ))}
          </div>
        </div>

        <div style={{ padding: "20px 24px", flex: 1 }}>

          {/* Overview tab */}
          {tab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  { label: "Total Orders", value: String(client.totalOrders), icon: "📦" },
                  { label: "Total Revenue", value: `₹${client.totalRevenue.toLocaleString("en-IN")}`, icon: "💹" },
                  { label: "Pending Payments", value: `₹${client.pendingPayments.toLocaleString("en-IN")}`, icon: "⏳" },
                  { label: "Return Rate", value: `${client.returnPercent}%`, icon: "↩️" },
                ].map(s => (
                  <div key={s.label} style={{ background: "#f9f9f9", border: "1px solid #f0f0f0", borderRadius: "12px", padding: "14px" }}>
                    <div style={{ fontSize: "18px", marginBottom: "6px" }}>{s.icon}</div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#111", fontFamily: "Georgia,serif" }}>{s.value}</div>
                    <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>{s.label}</div>
                  </div>
                ))}
              </div>
              {client.lastOrderAt && (
                <div style={{ fontSize: "12px", color: "#888", padding: "10px 14px", background: "#f9f9f9", borderRadius: "8px", border: "1px solid #f0f0f0" }}>
                  Last order: <strong style={{ color: "#7a001a" }}>{new Date(client.lastOrderAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</strong>
                </div>
              )}
            </div>
          )}

          {/* Orders tab */}
          {tab === "orders" && (
            <div>
              {loadingOrders ? (
                Array(4).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: "60px", borderRadius: "8px", marginBottom: "8px" }} />)
              ) : orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>No orders found</div>
              ) : (
                orders.map((o, i) => (
                  <div key={o._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: i % 2 === 0 ? "#f9f9f9" : "#fff", borderRadius: "8px", marginBottom: "6px", border: "1px solid #f0f0f0" }}>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#111" }}>{o.orderNumber}</div>
                      <div style={{ fontSize: "11px", color: "#888" }}>{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#7a001a" }}>₹{o.total?.toLocaleString("en-IN")}</div>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "#7a001a", background: "#f0f0f0", padding: "2px 7px", borderRadius: "99px", marginTop: "3px" }}>{o.status}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Notes tab */}
          {tab === "notes" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add an internal note about this client..." rows={3} style={{ flex: 1, padding: "10px 12px", borderRadius: "9px", border: "1.5px solid #f0f0f0", fontSize: "13px", color: "#111", background: "#f9f9f9", outline: "none", resize: "none", fontFamily: "inherit" }} />
              </div>
              <button onClick={addNote} disabled={saving || !noteText.trim()} style={{ padding: "9px 18px", borderRadius: "8px", background: "linear-gradient(135deg,#9B0020,#7a001a)", color: "#111", border: "none", fontSize: "13px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                {saving ? "Saving..." : "Add Note"}
              </button>
              <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "12px" }}>
                {(client.notes || []).length === 0 ? (
                  <div style={{ textAlign: "center", padding: "24px", color: "#888", fontSize: "13px" }}>No notes yet</div>
                ) : (
                  [...(client.notes || [])].reverse().map(n => (
                    <div key={n._id} style={{ padding: "12px 14px", background: "#f9f9f9", borderRadius: "8px", marginBottom: "8px", border: "1px solid #f0f0f0" }}>
                      <div style={{ fontSize: "13px", color: "#111", lineHeight: 1.5 }}>{n.text}</div>
                      <div style={{ fontSize: "11px", color: "#888", marginTop: "6px" }}>
                        {n.addedByName || "Admin"} · {new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Client | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const fetchClients = useCallback(async (p = 1, s = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "20" });
      if (s) params.append("search", s);
      const res = await api.get(`/admin/clients?${params}`);
      setClients(res.data.clients);
      setTotal(res.data.total);
      setTotalPages(res.data.pages);
      setPage(p);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const handleExport = async () => {
    try {
      const res = await api.get("/admin/export/clients", { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a"); a.href = url; a.download = "clients.xlsx"; a.click();
      setToast({ msg: "Clients exported", type: "success" });
    } catch { setToast({ msg: "Export failed", type: "error" }); }
  };

  const refreshSelected = async () => {
    if (!selected) return;
    try {
      const res = await api.get(`/admin/clients/${selected._id}`);
      setSelected(res.data.client);
      fetchClients(page, search);
    } catch (e) { console.error(e); }
  };

  return (
    <div style={{ maxWidth: "1100px" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {selected && <ClientDrawer client={selected} onClose={() => setSelected(null)} onRefresh={refreshSelected} />}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <p style={{ fontSize: "12px", color: "#888", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "4px" }}>Admin</p>
          <h1 style={{ fontSize: "26px", fontFamily: "Georgia,serif", color: "#111", fontWeight: 400 }}>Client Management</h1>
          <p style={{ fontSize: "14px", color: "#888", marginTop: "3px" }}>{total} clients</p>
        </div>
        <button onClick={handleExport} style={{ padding: "10px 20px", borderRadius: "9px", background: "linear-gradient(135deg,#9B0020,#7a001a)", color: "#111", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>⬇ Export Excel</button>
      </div>

      {/* Search */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", fontSize: "14px" }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && fetchClients(1, search)} placeholder="Search by name, phone, email..." style={{ width: "100%", padding: "10px 14px 10px 36px", borderRadius: "9px", border: "1.5px solid #f0f0f0", fontSize: "13px", color: "#111", background: "#fff", outline: "none", fontFamily: "inherit" }} />
        </div>
        <button onClick={() => fetchClients(1, search)} style={{ padding: "10px 20px", borderRadius: "9px", background: "#111", color: "#9B0020", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Search</button>
        {search && <button onClick={() => { setSearch(""); fetchClients(1, ""); }} style={{ padding: "10px 16px", borderRadius: "9px", border: "1px solid #f0f0f0", background: "transparent", color: "#888", fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>Clear</button>}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "16px", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 140px 120px 100px 80px", padding: "10px 20px", background: "linear-gradient(135deg,#111,#111)" }}>
          {["Client", "Phone", "Revenue", "Pending", "Orders", ""].map(h => (
            <div key={h} style={{ fontSize: "10px", fontWeight: 700, color: "#9B0020", letterSpacing: ".08em", textTransform: "uppercase" }}>{h}</div>
          ))}
        </div>
        {loading ? Array(6).fill(0).map((_, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 120px 140px 120px 100px 80px", padding: "14px 20px", borderBottom: "1px solid #f5f5f5", gap: "12px" }}>
            {[160, 90, 80, 70, 40, 50].map((w, j) => <div key={j} className="skeleton" style={{ height: "13px", width: `${w}px`, borderRadius: "4px" }} />)}
          </div>
        )) : clients.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>👥</div>
            <p style={{ color: "#888" }}>No clients found</p>
          </div>
        ) : clients.map((c, i) => (
          <div key={c._id} onClick={() => setSelected(c)} style={{ display: "grid", gridTemplateColumns: "1fr 120px 140px 120px 100px 80px", padding: "14px 20px", borderBottom: i < clients.length - 1 ? "1px solid #f5f5f5" : "none", alignItems: "center", cursor: "pointer", background: i % 2 === 0 ? "#fff" : "#FDFAF4", transition: "background .15s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#f0f0f0"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? "#fff" : "#FDFAF4"}
          >
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#111" }}>{c.name}</div>
              <div style={{ fontSize: "11px", color: "#888" }}>{c.email || "—"}</div>
            </div>
            <div style={{ fontSize: "12px", color: "#7a001a" }}>{c.phone}</div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#111", fontFamily: "Georgia,serif" }}>₹{c.totalRevenue.toLocaleString("en-IN")}</div>
            <div style={{ fontSize: "12px", color: c.pendingPayments > 0 ? "#dc2626" : "#15803d", fontWeight: 600 }}>
              {c.pendingPayments > 0 ? `₹${c.pendingPayments.toLocaleString("en-IN")}` : "—"}
            </div>
            <div style={{ fontSize: "12px", color: "#7a001a" }}>{c.totalOrders}</div>
            <div style={{ fontSize: "12px", color: "#7a001a", fontWeight: 600 }}>View →</div>
          </div>
        ))}
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "14px", borderTop: "1px solid #f0f0f0" }}>
            <button onClick={() => fetchClients(page - 1, search)} disabled={page === 1} style={{ padding: "5px 13px", borderRadius: "6px", border: "1px solid #f0f0f0", background: "transparent", color: page === 1 ? "#C4A882" : "#111", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "13px", fontFamily: "inherit" }}>← Prev</button>
            <span style={{ fontSize: "13px", color: "#888", padding: "0 8px" }}>Page {page} of {totalPages}</span>
            <button onClick={() => fetchClients(page + 1, search)} disabled={page === totalPages} style={{ padding: "5px 13px", borderRadius: "6px", border: "1px solid #f0f0f0", background: "transparent", color: page === totalPages ? "#C4A882" : "#111", cursor: page === totalPages ? "not-allowed" : "pointer", fontSize: "13px", fontFamily: "inherit" }}>Next →</button>
          </div>
        )}
      </div>
      <style>{`input::placeholder{color:#C4A882}input:focus,select:focus{border-color:#9B0020!important}`}</style>
    </div>
  );
}
