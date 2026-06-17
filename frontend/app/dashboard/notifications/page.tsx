"use client";

// ── DESTINATION: frontend/app/dashboard/notifications/page.tsx
// (this comment is just a label — safe to delete)

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import DashPageWrapper from "../DashPageWrapper";

const BURG = "#9B0020";

type NotifItem = {
  _id: string;
  icon: string;
  title: string;
  desc: string;
  type: string;
  link?: string | null;
  read: boolean;
  createdAt: string;
};

const typeFilters = [
  { key: "",        label: "All" },
  { key: "ORDER",    label: "Orders" },
  { key: "WALLET",   label: "Wallet" },
  { key: "BILL",     label: "Bills" },
  { key: "KYC",      label: "KYC" },
  { key: "PAYOUT",   label: "Payouts" },
  { key: "SYSTEM",   label: "System" },
];

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins   = Math.floor(diffMs / 60000);
  if (mins < 1)   return "Just now";
  if (mins < 60)  return `${mins} min${mins > 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7)   return `${days} day${days > 1 ? "s" : ""} ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 9999, padding: "13px 18px", borderRadius: "12px", background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#15803d", fontSize: "13px", fontWeight: 500, boxShadow: "0 4px 16px rgba(0,0,0,.1)", display: "flex", alignItems: "center", gap: "10px" }}>
      <span>✅</span><span>{msg}</span>
    </div>
  );
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotifItem[]>([]);
  const [unread, setUnread]   = useState(0);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [pages, setPages]     = useState(1);
  const [filter, setFilter]   = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState<string | null>(null);

  const fetchNotifications = useCallback(async (p = 1, type = filter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "20" });
      if (type) params.append("type", type);
      const res = await api.get(`/notifications?${params}`);
      setNotifications(res.data.notifications || []);
      setUnread(res.data.unread || 0);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
      setPage(p);
    } catch {
      // keep previous state on failure
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchNotifications(1, filter); }, [filter]);

  const markRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    setUnread(prev => Math.max(0, prev - 1));
    try { await api.patch(`/notifications/${id}/read`); } catch {}
  };

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnread(0);
    try { await api.patch("/notifications/read-all"); showSavedToast("All notifications marked as read"); } catch {}
  };

  const deleteOne = async (id: string) => {
    setNotifications(prev => prev.filter(n => n._id !== id));
    setTotal(prev => Math.max(0, prev - 1));
    try { await api.delete(`/notifications/${id}`); } catch {}
  };

  const clearRead = async () => {
    setNotifications(prev => prev.filter(n => !n.read));
    try {
      await api.delete("/notifications/clear-read");
      showSavedToast("Read notifications cleared");
    } catch {}
  };

  const showSavedToast = (msg: string) => setToast(msg);

  return (
    <DashPageWrapper>
      <div style={{ maxWidth: "760px" }}>
        {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <p style={{ fontSize: "12px", color: "#6B7280", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "4px" }}>Account</p>
            <h1 style={{ fontSize: "26px", fontFamily: "Georgia, serif", color: "#1F2937", fontWeight: 400 }}>Notifications</h1>
            <p style={{ fontSize: "14px", color: "#6B7280", marginTop: "3px" }}>{total} total{unread > 0 ? ` · ${unread} unread` : ""}</p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {unread > 0 && (
              <button onClick={markAllRead} style={{ padding: "9px 16px", borderRadius: "8px", border: `1.5px solid ${BURG}`, background: "transparent", color: BURG, fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Mark all read</button>
            )}
            <button onClick={clearRead} style={{ padding: "9px 16px", borderRadius: "8px", border: "1.5px solid #E5E7EB", background: "transparent", color: "#6B7280", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Clear read</button>
          </div>
        </div>

        {/* Type filters */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "18px", flexWrap: "wrap" }}>
          {typeFilters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{ padding: "7px 14px", borderRadius: "99px", border: `1px solid ${filter === f.key ? BURG : "#E5E7EB"}`, background: filter === f.key ? "rgba(155,0,32,.08)" : "#fff", color: filter === f.key ? BURG : "#6B7280", fontSize: "12px", fontWeight: filter === f.key ? 600 : 400, cursor: "pointer", fontFamily: "inherit" }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px", overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: "18px 22px" }}>{[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: "56px", borderRadius: "8px", marginBottom: "10px" }} />)}</div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: "56px 22px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔔</div>
              <p style={{ fontSize: "14px", color: "#6B7280" }}>You're all caught up — no notifications here</p>
            </div>
          ) : (
            notifications.map((n, i) => (
              <div key={n._id} onClick={() => !n.read && markRead(n._id)} style={{ display: "flex", gap: "14px", padding: "16px 22px", borderBottom: i < notifications.length - 1 ? "1px solid #F3F4F6" : "none", background: n.read ? "#fff" : "rgba(155,0,32,.03)", cursor: n.read ? "default" : "pointer", transition: "background .15s" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: n.read ? "#F3F4F6" : "rgba(155,0,32,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>{n.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "14px", fontWeight: n.read ? 400 : 600, color: "#1F2937" }}>{n.title}</span>
                    {!n.read && <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: BURG, flexShrink: 0 }} />}
                  </div>
                  <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: 1.5, marginTop: "2px" }}>{n.desc}</p>
                  <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "5px" }}>{timeAgo(n.createdAt)}</div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteOne(n._id); }} style={{ background: "none", border: "none", color: "#D1D5DB", fontSize: "16px", cursor: "pointer", padding: "4px", flexShrink: 0, alignSelf: "flex-start" }}>×</button>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "16px 0" }}>
            <button onClick={() => fetchNotifications(page - 1)} disabled={page === 1} style={{ padding: "6px 14px", borderRadius: "7px", border: "1px solid #E5E7EB", background: "#fff", color: page === 1 ? "#D1D5DB" : "#374151", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "13px", fontFamily: "inherit" }}>← Prev</button>
            <span style={{ fontSize: "13px", color: "#6B7280" }}>Page {page} of {pages}</span>
            <button onClick={() => fetchNotifications(page + 1)} disabled={page === pages} style={{ padding: "6px 14px", borderRadius: "7px", border: "1px solid #E5E7EB", background: "#fff", color: page === pages ? "#D1D5DB" : "#374151", cursor: page === pages ? "not-allowed" : "pointer", fontSize: "13px", fontFamily: "inherit" }}>Next →</button>
          </div>
        )}
      </div>
    </DashPageWrapper>
  );
}
