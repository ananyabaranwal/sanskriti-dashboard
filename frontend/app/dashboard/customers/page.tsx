"use client";

// ── DESTINATION: frontend/app/dashboard/customers/page.tsx
// (this comment is just a label — safe to delete)

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import DashPageWrapper from "../DashPageWrapper";

const BURG = "#9B0020";

type Customer = {
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
    <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 9999, padding: "13px 18px", borderRadius: "12px", background: c.bg, border: `1px solid ${c.border}`, color: c.color, fontSize: "13px", fontWeight: 500, boxShadow: "0 4px 16px rgba(0,0,0,.1)", display: "flex", alignItems: "center", gap: "10px", maxWidth: "340px", animation: "slideDown .3s ease" }}>
      <span>{c.icon}</span><span style={{ flex: 1 }}>{msg}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "inherit", padding: 0, opacity: .6 }}>×</button>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 90px 120px 120px 40px", padding: "14px 22px", borderBottom: "1px solid #F3F4F6", alignItems: "center", gap: "8px" }}>
      {[160, 110, 50, 80, 80, 16].map((w, i) => (
        <div key={i} className="skeleton" style={{ width: `${w}px`, height: "13px", borderRadius: "4px" }} />
      ))}
    </div>
  );
}

// ── Customer Detail Drawer ───────────────────────────────────
function CustomerDrawer({ customer, onClose, onRefresh, showToast }: {
  customer: Customer; onClose: () => void; onRefresh: () => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}) {
  const [tab, setTab]               = useState<"overview" | "orders" | "notes">("overview");
  const [orders, setOrders]         = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [noteText, setNoteText]     = useState("");
  const [saving, setSaving]         = useState(false);
  const [notes, setNotes]           = useState(customer.notes || []);

  useEffect(() => {
    if (tab === "orders" && orders.length === 0) {
      setLoadingOrders(true);
      api.get(`/customers/${customer._id}/orders`)
        .then(r => setOrders(r.data.orders || []))
        .catch(() => showToast("Failed to load orders", "error"))
        .finally(() => setLoadingOrders(false));
    }
  }, [tab]);

  const addNote = async () => {
    if (!noteText.trim()) return;
    setSaving(true);
    try {
      const res = await api.post(`/customers/${customer._id}/notes`, { text: noteText });
      setNotes(res.data.notes || []);
      setNoteText("");
      showToast("Note added");
      onRefresh();
    } catch {
      showToast("Failed to add note", "error");
    } finally {
      setSaving(false);
    }
  };

  const statusColor = (s: string) => ({
    PENDING:    { bg: "#FFFBEB", color: "#854d0e" },
    CONFIRMED:  { bg: "#EFF6FF", color: "#1d4ed8" },
    PROCESSING: { bg: "#F5F3FF", color: "#6d28d9" },
    SHIPPED:    { bg: "#ECFDF5", color: "#065f46" },
    DELIVERED:  { bg: "#F0FDF4", color: "#15803d" },
    CANCELLED:  { bg: "#FEF2F2", color: "#dc2626" },
    RETURNED:   { bg: "#FFF1F2", color: "#9f1239" },
  }[s] || { bg: "#F3F4F6", color: "#374151" });

  const tabs = ["overview", "orders", "notes"] as const;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(3px)" }} onClick={onClose} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "440px", maxWidth: "92vw", background: "#fff", boxShadow: "-8px 0 48px rgba(0,0,0,.18)", overflowY: "auto", animation: "slideLeft .3s ease", display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${BURG}, #7A0018)`, padding: "22px 24px", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "18px", fontWeight: 700, flexShrink: 0 }}>
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: "18px", fontFamily: "Georgia, serif", color: "#fff", fontWeight: 400 }}>{customer.name}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,.7)", marginTop: "2px" }}>{customer.phone}</div>
              </div>
            </div>
            <button onClick={onClose} style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(255,255,255,.15)", border: "none", color: "#fff", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", padding: "12px 24px 0", borderBottom: "1px solid #F3F4F6" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "10px 16px", border: "none", background: "none", borderBottom: tab === t ? `2px solid ${BURG}` : "2px solid transparent", color: tab === t ? BURG : "#6B7280", fontSize: "13px", fontWeight: tab === t ? 600 : 400, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: "20px 24px", flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>

          {tab === "overview" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  { label: "Total Orders",  value: String(customer.totalOrders),                            icon: "📦" },
                  { label: "Total Revenue", value: `₹${customer.totalRevenue.toLocaleString("en-IN")}`,    icon: "💹" },
                  { label: "Pending",       value: `₹${customer.pendingPayments.toLocaleString("en-IN")}`, icon: "⏳" },
                  { label: "Returns",       value: `${customer.returnPercent}%`,                              icon: "↩️" },
                ].map(s => (
                  <div key={s.label} style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "14px" }}>
                    <div style={{ fontSize: "16px", marginBottom: "6px" }}>{s.icon}</div>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "#1F2937", fontFamily: "Georgia, serif" }}>{s.value}</div>
                    <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "2px" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "8px" }}>Contact</p>
                <div style={{ fontSize: "13px", color: "#374151", lineHeight: 1.7 }}>
                  <div>📞 {customer.phone}</div>
                  {customer.email && <div>✉️ {customer.email}</div>}
                  {(customer.address?.city || customer.address?.state) && (
                    <div>📍 {[customer.address?.city, customer.address?.state].filter(Boolean).join(", ")}</div>
                  )}
                </div>
              </div>

              {customer.lastOrderAt && (
                <div>
                  <p style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "4px" }}>Last Order</p>
                  <div style={{ fontSize: "13px", color: "#374151" }}>{new Date(customer.lastOrderAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
                </div>
              )}
            </>
          )}

          {tab === "orders" && (
            loadingOrders ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: "52px", borderRadius: "8px" }} />)}
              </div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 0" }}>
                <div style={{ fontSize: "30px", marginBottom: "8px" }}>📦</div>
                <p style={{ fontSize: "13px", color: "#6B7280" }}>No orders yet</p>
              </div>
            ) : orders.map(o => {
              const sc = statusColor(o.status);
              return (
                <div key={o._id} style={{ padding: "12px 14px", border: "1px solid #F3F4F6", borderRadius: "10px", marginBottom: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#1F2937" }}>{o.orderNumber}</span>
                    <span style={{ padding: "2px 8px", borderRadius: "99px", fontSize: "10px", fontWeight: 700, background: sc.bg, color: sc.color }}>{o.status}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#6B7280" }}>
                    <span>{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    <span style={{ fontWeight: 600, color: "#1F2937" }}>₹{o.total?.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              );
            })
          )}

          {tab === "notes" && (
            <>
              <div style={{ display: "flex", gap: "8px" }}>
                <input value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add an internal note…" style={{ flex: 1, padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: "13px", outline: "none", fontFamily: "inherit" }} onKeyDown={e => e.key === "Enter" && addNote()} />
                <button onClick={addNote} disabled={saving || !noteText.trim()} style={{ padding: "10px 16px", borderRadius: "8px", background: BURG, color: "#fff", border: "none", fontSize: "13px", fontWeight: 600, cursor: saving ? "default" : "pointer", opacity: saving || !noteText.trim() ? .6 : 1, fontFamily: "inherit" }}>
                  {saving ? "..." : "Add"}
                </button>
              </div>
              {notes.length === 0 ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <p style={{ fontSize: "13px", color: "#6B7280" }}>No notes yet</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[...notes].reverse().map(n => (
                    <div key={n._id} style={{ padding: "10px 12px", background: "#F9FAFB", borderRadius: "8px", border: "1px solid #F3F4F6" }}>
                      <p style={{ fontSize: "13px", color: "#1F2937", lineHeight: 1.5 }}>{n.text}</p>
                      <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "4px" }}>
                        {n.addedByName || "You"} · {new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const [customers, setCustomers]   = useState<Customer[]>([]);
  const [stats, setStats]           = useState<any>(null);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [selected, setSelected]     = useState<Customer | null>(null);
  const [toast, setToast]           = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => setToast({ msg, type });

  const fetchCustomers = useCallback(async (q = "") => {
    setLoading(true);
    try {
      const [custRes, statsRes] = await Promise.allSettled([
        api.get(`/customers?search=${encodeURIComponent(q)}&limit=50`),
        api.get("/customers/stats"),
      ]);
      if (custRes.status === "fulfilled")  setCustomers(custRes.value.data.customers || []);
      if (statsRes.status === "fulfilled") setStats(statsRes.value.data.stats);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchCustomers(search); };

  return (
    <DashPageWrapper>
      <div style={{ maxWidth: "1100px" }}>
        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        {selected && (
          <CustomerDrawer
            customer={selected}
            onClose={() => setSelected(null)}
            onRefresh={() => fetchCustomers(search)}
            showToast={showToast}
          />
        )}

        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontSize: "12px", color: "#6B7280", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "4px" }}>Manage</p>
          <h1 style={{ fontSize: "26px", fontFamily: "Georgia, serif", color: "#1F2937", fontWeight: 400 }}>Customers</h1>
          <p style={{ fontSize: "14px", color: "#6B7280", marginTop: "3px" }}>{stats?.totalCustomers ?? customers.length} buyers tracked across your orders</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "20px" }}>
          {loading && !stats
            ? Array(4).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: "90px", borderRadius: "14px" }} />)
            : [
                { label: "Total Customers",  value: String(stats?.totalCustomers ?? 0),                            icon: "👥" },
                { label: "Repeat Customers", value: String(stats?.repeatCustomers ?? 0),                           icon: "🔁" },
                { label: "Total Revenue",    value: `₹${(stats?.totalRevenue ?? 0).toLocaleString("en-IN")}`,    icon: "💹" },
                { label: "Pending Payments", value: `₹${(stats?.pendingPayments ?? 0).toLocaleString("en-IN")}`, icon: "⏳" },
              ].map(s => (
                <div key={s.label} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "14px", padding: "16px 18px" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "rgba(155,0,32,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", marginBottom: "10px" }}>{s.icon}</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#1F2937", fontFamily: "Georgia, serif", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "4px" }}>{s.label}</div>
                </div>
              ))
          }
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ marginBottom: "16px" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, phone, or email…" style={{ width: "100%", maxWidth: "360px", padding: "11px 14px", borderRadius: "9px", border: "1.5px solid #E5E7EB", fontSize: "13px", outline: "none", fontFamily: "inherit" }} />
        </form>

        {/* Table */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 90px 120px 120px 40px", padding: "12px 22px", background: "#fff", border: `1.5px solid ${BURG}`, borderRadius: "10px 10px 0 0" }}>
            {["Name", "Phone", "Orders", "Revenue", "Last Order", ""].map(h => (
              <div key={h} style={{ fontSize: "11px", fontWeight: 700, color: BURG, letterSpacing: ".05em", textTransform: "uppercase" }}>{h}</div>
            ))}
          </div>

          {loading ? (
            <>{[1,2,3,4,5].map(i => <SkeletonRow key={i} />)}</>
          ) : customers.length === 0 ? (
            <div style={{ padding: "48px 22px", textAlign: "center" }}>
              <div style={{ fontSize: "36px", marginBottom: "10px" }}>👥</div>
              <p style={{ fontSize: "14px", color: "#6B7280" }}>No customers yet — they'll show up here once you create orders</p>
            </div>
          ) : customers.map((c, i) => (
            <div key={c._id} onClick={() => setSelected(c)} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 90px 120px 120px 40px", padding: "14px 22px", borderBottom: i < customers.length - 1 ? "1px solid #F3F4F6" : "none", alignItems: "center", cursor: "pointer", transition: "background .15s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(155,0,32,.08)", color: BURG, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>{c.name.charAt(0).toUpperCase()}</div>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#1F2937", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</span>
              </div>
              <div style={{ fontSize: "13px", color: "#6B7280" }}>{c.phone}</div>
              <div style={{ fontSize: "13px", color: "#1F2937" }}>{c.totalOrders}</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#1F2937" }}>₹{c.totalRevenue.toLocaleString("en-IN")}</div>
              <div style={{ fontSize: "12px", color: "#6B7280" }}>{c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}</div>
              <div style={{ color: BURG, fontSize: "14px", opacity: .5 }}>→</div>
            </div>
          ))}
        </div>

        <style>{`
          @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes slideLeft { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
          input::placeholder { color: #9CA3AF; }
          input:focus { border-color: ${BURG} !important; }
        `}</style>
      </div>
    </DashPageWrapper>
  );
}
