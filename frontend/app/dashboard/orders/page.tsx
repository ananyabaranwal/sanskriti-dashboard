"use client";

// ── DESTINATION: frontend/app/dashboard/orders/page.tsx
// (this comment is just a label — safe to delete)

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import DashPageWrapper from "../DashPageWrapper";

const BURG      = "#9B0020";
const BURG_DARK = "#7A0018";

const ALL_STATUSES = ["PENDING","CONFIRMED","PROCESSING","SHIPPED","DELIVERED","CANCELLED"];
const STATUS_FLOW  = ["PENDING","CONFIRMED","PROCESSING","SHIPPED","DELIVERED"];

const statusStyle = (s: string) => ({
  PENDING:    { bg: "#FFFBEB", color: "#854d0e", border: "#FDE68A", dot: "#f59e0b" },
  CONFIRMED:  { bg: "#EFF6FF", color: "#1d4ed8", border: "#BFDBFE", dot: "#3b82f6" },
  PROCESSING: { bg: "#F5F3FF", color: "#6d28d9", border: "#DDD6FE", dot: "#8b5cf6" },
  SHIPPED:    { bg: "#ECFDF5", color: "#065f46", border: "#A7F3D0", dot: "#10b981" },
  DELIVERED:  { bg: "#F0FDF4", color: "#15803d", border: "#BBF7D0", dot: "#22c55e" },
  CANCELLED:  { bg: "#FEF2F2", color: "#dc2626", border: "#FECACA", dot: "#ef4444" },
}[s] || { bg: "#F3F4F6", color: "#374151", border: "#E5E7EB", dot: BURG });

// ── Toast ─────────────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, []);
  const c = type === "success"
    ? { bg: "#F0FDF4", border: "#BBF7D0", color: "#15803d", icon: "✅" }
    : { bg: "#FEF2F2", border: "#FECACA", color: "#dc2626", icon: "❌" };
  return (
    <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 9999, padding: "12px 16px", borderRadius: "12px", background: c.bg, border: `1px solid ${c.border}`, color: c.color, fontSize: "13px", fontWeight: 500, boxShadow: "0 6px 24px rgba(0,0,0,.1)", display: "flex", alignItems: "center", gap: "10px", maxWidth: "360px", animation: "slideDown .3s ease", fontFamily: "inherit" }}>
      <span>{c.icon}</span><span style={{ flex: 1, lineHeight: 1.5 }}>{msg}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "17px", color: "inherit", padding: 0, opacity: .6 }}>×</button>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "150px 1fr 100px 90px 110px 72px", padding: "14px 18px", borderBottom: "1px solid #F3F4F6", alignItems: "center", gap: "0" }}>
      {[120,160,70,60,80,50].map((w,i) => (
        <div key={i} className="skeleton" style={{ width: `${w}px`, height: "14px", borderRadius: "4px" }} />
      ))}
    </div>
  );
}

// ── Create Order Modal ────────────────────────────────────────
function CreateOrderModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ buyerName: "", buyerPhone: "", buyerEmail: "", buyerCity: "", buyerState: "", itemName: "", itemDesc: "", itemQty: "1", itemPrice: "", paymentMethod: "CASH", notes: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inp: React.CSSProperties = { width: "100%", padding: "10px 13px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: "14px", color: "#1F2937", background: "#F9FAFB", outline: "none", fontFamily: "inherit" };
  const lbl: React.CSSProperties = { fontSize: "11px", fontWeight: 700, color: "#6B7280", display: "block", marginBottom: "4px", letterSpacing: ".04em", textTransform: "uppercase" };

  const submit = async () => {
    if (!form.buyerName || !form.buyerPhone || !form.itemName || !form.itemPrice) { setError("Buyer name, phone, item name and price are required"); return; }
    setLoading(true); setError("");
    try {
      await api.post("/orders", {
        buyer: { name: form.buyerName, phone: form.buyerPhone, email: form.buyerEmail, address: { city: form.buyerCity, state: form.buyerState } },
        items: [{ name: form.itemName, description: form.itemDesc, quantity: Number(form.itemQty) || 1, price: Number(form.itemPrice) }],
        paymentMethod: form.paymentMethod,
        notes: form.notes,
      });
      onSuccess();
    } catch (e: any) { setError(e.response?.data?.message || "Failed to create order"); }
    finally { setLoading(false); }
  };

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "20px", backdropFilter: "blur(6px)" }}>
      <div style={{ background: "#fff", borderRadius: "20px", width: "100%", maxWidth: "520px", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,.35)", animation: "scaleIn .3s ease" }}>
        <div style={{ background: `linear-gradient(135deg, #1A0006, #5C0014, ${BURG_DARK})`, padding: "22px 28px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "20px 20px 0 0" }}>
          <div>
            <h2 style={{ fontSize: "19px", fontFamily: "Georgia, serif", color: "#fff", fontWeight: 400 }}>Create New Order</h2>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,.6)", marginTop: "2px" }}>Fill buyer and item details</p>
          </div>
          <button onClick={onClose} style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(255,255,255,.1)", border: "none", color: "#fff", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>×</button>
        </div>
        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: BURG, textTransform: "uppercase", letterSpacing: ".06em" }}>Buyer Information</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div><label style={lbl}>Name *</label><input value={form.buyerName} onChange={e => setForm({ ...form, buyerName: e.target.value })} placeholder="Full name" style={inp} /></div>
            <div><label style={lbl}>Phone *</label><input value={form.buyerPhone} onChange={e => setForm({ ...form, buyerPhone: e.target.value })} placeholder="Mobile number" style={inp} /></div>
          </div>
          <div><label style={lbl}>Email (optional)</label><input value={form.buyerEmail} onChange={e => setForm({ ...form, buyerEmail: e.target.value })} placeholder="buyer@email.com" style={inp} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div><label style={lbl}>City</label><input value={form.buyerCity} onChange={e => setForm({ ...form, buyerCity: e.target.value })} placeholder="City" style={inp} /></div>
            <div><label style={lbl}>State</label><input value={form.buyerState} onChange={e => setForm({ ...form, buyerState: e.target.value })} placeholder="State" style={inp} /></div>
          </div>
          <p style={{ fontSize: "11px", fontWeight: 700, color: BURG, textTransform: "uppercase", letterSpacing: ".06em", marginTop: "4px" }}>Item Details</p>
          <div><label style={lbl}>Item Name *</label><input value={form.itemName} onChange={e => setForm({ ...form, itemName: e.target.value })} placeholder="e.g. Brass Ganesh Idol" style={inp} /></div>
          <div><label style={lbl}>Description</label><input value={form.itemDesc} onChange={e => setForm({ ...form, itemDesc: e.target.value })} placeholder="Brief description (optional)" style={inp} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div><label style={lbl}>Price (₹) *</label><input type="number" value={form.itemPrice} onChange={e => setForm({ ...form, itemPrice: e.target.value })} placeholder="Amount" style={inp} /></div>
            <div><label style={lbl}>Quantity</label><input type="number" value={form.itemQty} onChange={e => setForm({ ...form, itemQty: e.target.value })} min="1" style={inp} /></div>
          </div>
          <div>
            <label style={lbl}>Payment Method</label>
            <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })} style={{ ...inp, cursor: "pointer" }}>
              {["CASH","ONLINE","WALLET","OTHER"].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div><label style={lbl}>Notes (optional)</label><input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Special instructions" style={inp} /></div>
          {error && <div style={{ padding: "10px 14px", borderRadius: "8px", background: "#FEF2F2", border: "1px solid #FECACA", color: "#dc2626", fontSize: "13px" }}>⚠️ {error}</div>}
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1.5px solid #E5E7EB", background: "transparent", color: "#374151", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            <button onClick={submit} disabled={loading} style={{ flex: 2, padding: "12px", borderRadius: "8px", background: loading ? "#E5E7EB" : `linear-gradient(135deg, ${BURG}, ${BURG_DARK})`, color: loading ? "#9CA3AF" : "#fff", border: "none", fontSize: "14px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
              {loading ? "Creating..." : "Create Order →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Order Detail Drawer ──────────────────────────────────────
function OrderDrawer({ order, onClose, onStatusUpdate, onGenerateBill }: {
  order: any;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string) => Promise<void>;
  onGenerateBill: (id: string) => Promise<void>;
}) {
  const [updating, setUpdating] = useState(false);
  const [billing, setBilling]   = useState(false);
  const sc = statusStyle(order.status);
  const currentIdx = STATUS_FLOW.indexOf(order.status);

  const handleStatus = async (status: string) => {
    setUpdating(true);
    await onStatusUpdate(order._id, status);
    setUpdating(false);
  };

  const handleBill = async () => {
    setBilling(true);
    await onGenerateBill(order._id);
    setBilling(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(3px)" }} onClick={onClose} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "440px", maxWidth: "92vw", background: "#fff", boxShadow: "-8px 0 48px rgba(0,0,0,.2)", overflowY: "auto", animation: "slideLeft .3s ease", display: "flex", flexDirection: "column" }}>

        {/* Drawer header */}
        <div style={{ background: `linear-gradient(135deg, #1A0006, #5C0014, ${BURG_DARK})`, padding: "22px 24px", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "20px", fontFamily: "Georgia, serif", color: "#fff", fontWeight: 400 }}>{order.orderNumber}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,.6)", marginTop: "3px" }}>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ padding: "4px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: 700, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>{order.status}</span>
              <button onClick={onClose} style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(255,255,255,.1)", border: "none", color: "#fff", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>×</button>
            </div>
          </div>
        </div>

        {/* Drawer content */}
        <div style={{ padding: "20px 24px", flex: 1, display: "flex", flexDirection: "column", gap: "18px" }}>

          {/* Buyer */}
          <div>
            <p style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "8px" }}>Buyer</p>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#1F2937" }}>{order.buyer?.name}</div>
            <div style={{ fontSize: "13px", color: "#6B7280", marginTop: "2px", lineHeight: 1.6 }}>
              <div>📞 {order.buyer?.phone}</div>
              {order.buyer?.email && <div>✉️ {order.buyer.email}</div>}
              {(order.buyer?.address?.city || order.buyer?.address?.state) && (
                <div>📍 {[order.buyer?.address?.city, order.buyer?.address?.state].filter(Boolean).join(", ")}</div>
              )}
            </div>
          </div>

          {/* Items */}
          <div>
            <p style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "8px" }}>Items</p>
            <div style={{ border: "1px solid #F3F4F6", borderRadius: "10px", overflow: "hidden" }}>
              {(order.items || []).map((it: any, i: number) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: "10px", padding: "10px 14px", borderBottom: i < order.items.length - 1 ? "1px solid #F3F4F6" : "none", background: i % 2 === 0 ? "#fff" : "#F9FAFB" }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: "#1F2937" }}>{it.name}</div>
                    <div style={{ fontSize: "11px", color: "#9CA3AF" }}>{it.quantity} × ₹{it.price?.toLocaleString("en-IN")}</div>
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#1F2937", flexShrink: 0 }}>₹{it.total?.toLocaleString("en-IN")}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "10px", padding: "10px 14px", background: "#F9FAFB", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#6B7280" }}><span>Subtotal</span><span>₹{order.subtotal?.toLocaleString("en-IN")}</span></div>
              {order.taxAmount > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#6B7280" }}><span>Tax</span><span>₹{order.taxAmount.toLocaleString("en-IN")}</span></div>}
              {order.discountAmount > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#6B7280" }}><span>Discount</span><span>-₹{order.discountAmount.toLocaleString("en-IN")}</span></div>}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: 700, color: "#1F2937", paddingTop: "4px", borderTop: "1px solid #E5E7EB" }}><span>Total</span><span>₹{order.total?.toLocaleString("en-IN")}</span></div>
            </div>
          </div>

          {/* Status update */}
          <div>
            <p style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "10px" }}>Update Status</p>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {STATUS_FLOW.map(s => {
                const isCurrent = s === order.status;
                const isPast    = STATUS_FLOW.indexOf(s) < currentIdx;
                return (
                  <button key={s} disabled={isCurrent || updating || order.status === "CANCELLED"} onClick={() => handleStatus(s)} style={{ padding: "6px 12px", borderRadius: "99px", fontSize: "11px", fontWeight: 600, border: `1px solid ${isCurrent ? BURG : isPast ? "#E5E7EB" : "#E5E7EB"}`, background: isCurrent ? `linear-gradient(135deg, ${BURG}, ${BURG_DARK})` : isPast ? "#F3F4F6" : "transparent", color: isCurrent ? "#fff" : isPast ? "#9CA3AF" : "#374151", cursor: isCurrent || updating || order.status === "CANCELLED" ? "default" : "pointer", transition: "all .15s", opacity: updating ? .6 : 1, fontFamily: "inherit" }}>
                    {isCurrent && <span style={{ marginRight: "4px" }}>✓</span>}{s}
                  </button>
                );
              })}
              <button disabled={order.status === "CANCELLED" || updating} onClick={() => handleStatus("CANCELLED")} style={{ padding: "6px 12px", borderRadius: "99px", fontSize: "11px", fontWeight: 600, border: "1px solid #FECACA", background: order.status === "CANCELLED" ? "#FEF2F2" : "transparent", color: "#dc2626", cursor: order.status === "CANCELLED" ? "default" : "pointer", fontFamily: "inherit" }}>
                {order.status === "CANCELLED" && <span style={{ marginRight: "4px" }}>✓</span>}CANCEL
              </button>
            </div>
          </div>

          {/* Status history */}
          {order.statusHistory?.length > 0 && (
            <div>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "10px" }}>Activity Timeline</p>
              <div style={{ position: "relative", paddingLeft: "20px" }}>
                <div style={{ position: "absolute", left: "6px", top: 0, bottom: 0, width: "1px", background: "#E5E7EB" }} />
                {[...order.statusHistory].reverse().slice(0, 5).map((h: any, i: number) => {
                  const hs = statusStyle(h.status);
                  return (
                    <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "12px", position: "relative" }}>
                      <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: hs.dot, flexShrink: 0, position: "absolute", left: "-17px", top: "2px", border: "2px solid #fff" }} />
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: 600, color: hs.color }}>{h.status}</div>
                        <div style={{ fontSize: "11px", color: "#6B7280", lineHeight: 1.4 }}>{h.note}</div>
                        <div style={{ fontSize: "10px", color: "#9CA3AF", marginTop: "2px" }}>{new Date(h.changedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Drawer footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #F3F4F6", flexShrink: 0, background: "#fff" }}>
          <button onClick={handleBill} disabled={billing} style={{ width: "100%", padding: "13px", borderRadius: "10px", background: billing ? "#E5E7EB" : `linear-gradient(135deg, ${BURG}, ${BURG_DARK})`, color: billing ? "#9CA3AF" : "#fff", border: "none", fontSize: "14px", fontWeight: 700, cursor: billing ? "not-allowed" : "pointer", fontFamily: "inherit", letterSpacing: ".02em", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            {billing ? <><span style={{ width: "14px", height: "14px", borderRadius: "50%", border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", animation: "spin .7s linear infinite", display: "inline-block" }} />Generating...</> : <>🧾 Generate GST Invoice</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Orders Page ──────────────────────────────────────────
export default function OrdersPage() {
  const [orders, setOrders]               = useState<any[]>([]);
  const [stats, setStats]                 = useState<any[]>([]);
  const [loading, setLoading]             = useState(true);
  const [tableLoading, setTableLoading]   = useState(false);
  const [page, setPage]                   = useState(1);
  const [totalPages, setTotalPages]       = useState(1);
  const [total, setTotal]                 = useState(0);
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showCreate, setShowCreate]       = useState(false);
  const [toast, setToast]                 = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => setToast({ msg, type });

  const fetchOrders = useCallback(async (p = 1, s = "", sf = "", smooth = false) => {
    smooth ? setTableLoading(true) : setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "8" });
      if (s)  params.append("search", s);
      if (sf) params.append("status", sf);
      const res = await api.get(`/orders?${params}`);
      setOrders(res.data.orders);
      setStats(res.data.stats || []);
      setTotalPages(res.data.pagination.totalPages);
      setTotal(res.data.pagination.total);
      setPage(p);
    } catch (e) { console.error(e); }
    finally { smooth ? setTableLoading(false) : setLoading(false); }
  }, []);

  useEffect(() => { fetchOrders(1, "", ""); }, [fetchOrders]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchOrders(1, search, statusFilter, true); };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status, note: `Status updated to ${status}` });
      showToast(`Order status updated to ${status}`);
      setSelectedOrder((prev: any) => prev ? { ...prev, status, statusHistory: [...prev.statusHistory, { status, note: `Status updated to ${status}`, changedAt: new Date() }] } : null);
      fetchOrders(page, search, statusFilter, true);
    } catch (e: any) { showToast(e.response?.data?.message || "Update failed", "error"); }
  };

  const handleGenerateBill = async (orderId: string) => {
    try {
      const res = await api.post(`/bills/generate/${orderId}`);
      showToast(`Invoice ${res.data.bill?.invoiceNumber} generated!`);
    } catch (e: any) { showToast(e.response?.data?.message || "Failed to generate bill", "error"); }
  };

  const totalRevenue = stats.filter(s => s._id !== "CANCELLED").reduce((sum, s) => sum + s.revenue, 0);
  const getCount = (s: string) => stats.find(x => x._id === s)?.count || 0;

  return (
    <DashPageWrapper>
    <div style={{ maxWidth: "1100px" }}>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {showCreate && <CreateOrderModal onClose={() => setShowCreate(false)} onSuccess={() => { setShowCreate(false); fetchOrders(1, "", ""); showToast("Order created successfully!"); }} />}
      {selectedOrder && <OrderDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} onStatusUpdate={handleStatusUpdate} onGenerateBill={handleGenerateBill} />}

      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <p style={{ fontSize: "12px", color: "#6B7280", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "4px" }}>Manage</p>
          <h1 style={{ fontSize: "26px", fontFamily: "Georgia, serif", color: "#1F2937", fontWeight: 400 }}>Orders</h1>
          <p style={{ fontSize: "14px", color: "#6B7280", marginTop: "3px" }}>{total} total orders</p>
        </div>
        <button onClick={() => setShowCreate(true)} style={{ padding: "11px 22px", borderRadius: "9px", background: `linear-gradient(135deg, ${BURG}, ${BURG_DARK})`, color: "#fff", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(155,0,32,.25)", letterSpacing: ".02em" }}>
          + New Order
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "20px" }}>
        {loading ? Array(5).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: "90px", borderRadius: "12px" }} />) : (
          <>
            <div style={{ background: "rgba(255,255,255,.7)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", border: `1.5px solid ${BURG}`, borderRadius: "14px", padding: "16px 18px", boxShadow: "0 4px 16px rgba(155,0,32,.06)" }}>
              <div style={{ fontSize: "10px", color: BURG, opacity: .75, letterSpacing: ".08em", marginBottom: "8px" }}>REVENUE</div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#1F2937", fontFamily: "Georgia, serif" }}>₹{totalRevenue.toLocaleString("en-IN")}</div>
              <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "3px" }}>All time</div>
            </div>
            {[
              { label: "Pending",   s: "PENDING",   icon: "⏳" },
              { label: "Confirmed", s: "CONFIRMED", icon: "✅" },
              { label: "Shipped",   s: "SHIPPED",   icon: "🚚" },
              { label: "Delivered", s: "DELIVERED", icon: "📬" },
            ].map(({ label, s, icon }) => {
              const sc = statusStyle(s);
              return (
                <div key={s} onClick={() => { setStatusFilter(statusFilter === s ? "" : s); fetchOrders(1, search, statusFilter === s ? "" : s, true); }} style={{ background: "#fff", border: `1px solid ${statusFilter === s ? sc.border : "#E5E7EB"}`, borderRadius: "14px", padding: "16px 18px", cursor: "pointer", transition: "all .2s" }}>
                  <div style={{ fontSize: "18px", marginBottom: "6px" }}>{icon}</div>
                  <div style={{ fontSize: "20px", fontWeight: 700, color: sc.color, fontFamily: "Georgia, serif" }}>{getCount(s)}</div>
                  <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "3px" }}>{label}</div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Search + filter bar */}
      <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
          <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", fontSize: "14px", pointerEvents: "none" }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order no., buyer name, phone..." style={{ width: "100%", padding: "10px 14px 10px 36px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: "13px", color: "#1F2937", background: "#fff", outline: "none", fontFamily: "inherit" }} />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); fetchOrders(1, search, e.target.value, true); }} style={{ padding: "10px 14px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: "13px", color: "#1F2937", background: "#fff", outline: "none", cursor: "pointer", fontFamily: "inherit" }}>
          <option value="">All Status</option>
          {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button type="submit" style={{ padding: "10px 20px", borderRadius: "8px", background: BURG, color: "#fff", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Search</button>
        {(search || statusFilter) && (
          <button type="button" onClick={() => { setSearch(""); setStatusFilter(""); fetchOrders(1, "", "", true); }} style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #E5E7EB", background: "transparent", color: "#6B7280", fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>Clear</button>
        )}
      </form>

      {/* Orders table */}
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px", overflow: "hidden", opacity: tableLoading ? .6 : 1, transition: "opacity .25s" }}>

        <div style={{ display: "grid", gridTemplateColumns: "150px 1fr 100px 90px 110px 72px", padding: "10px 18px", background: "#fff", border: `1.5px solid ${BURG}`, borderRadius: "10px 10px 0 0" }}>
          {["Order #","Buyer","Items","Total","Status",""].map(h => (
            <div key={h} style={{ fontSize: "10px", fontWeight: 700, color: BURG, letterSpacing: ".08em", textTransform: "uppercase" }}>{h}</div>
          ))}
        </div>

        {loading ? (
          Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)
        ) : orders.length === 0 ? (
          <div style={{ padding: "64px 20px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "14px" }}>📦</div>
            <p style={{ fontSize: "17px", fontWeight: 500, color: "#1F2937", marginBottom: "6px" }}>No orders found</p>
            <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "20px" }}>{search || statusFilter ? "Try different filters or clear search" : "Create your first order to get started"}</p>
            {!search && !statusFilter && <button onClick={() => setShowCreate(true)} style={{ padding: "10px 24px", borderRadius: "8px", background: `linear-gradient(135deg, ${BURG}, ${BURG_DARK})`, color: "#fff", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+ Create First Order</button>}
          </div>
        ) : (
          <>
            {orders.map((o, i) => {
              const sc = statusStyle(o.status);
              return (
                <div key={o._id} onClick={() => setSelectedOrder(o)} style={{ display: "grid", gridTemplateColumns: "150px 1fr 100px 90px 110px 72px", padding: "14px 18px", borderBottom: i < orders.length - 1 ? "1px solid #F3F4F6" : "none", background: i % 2 === 0 ? "#fff" : "#FAFAFA", alignItems: "center", cursor: "pointer", transition: "background .15s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(155,0,32,.04)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? "#fff" : "#FAFAFA"}
                >
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#1F2937" }}>{o.orderNumber}</div>
                    <div style={{ fontSize: "11px", color: "#9CA3AF" }}>{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: "#1F2937" }}>{o.buyer?.name}</div>
                    <div style={{ fontSize: "11px", color: "#9CA3AF" }}>{o.buyer?.phone}</div>
                  </div>
                  <div style={{ fontSize: "12px", color: "#6B7280" }}>{o.items?.length} item{o.items?.length > 1 ? "s" : ""}</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#1F2937" }}>₹{o.total?.toLocaleString("en-IN")}</div>
                  <div style={{ display: "inline-flex", padding: "3px 8px", borderRadius: "99px", background: sc.bg, color: sc.color, fontSize: "10px", fontWeight: 700, letterSpacing: ".04em", width: "fit-content" }}>{o.status}</div>
                  <div style={{ color: BURG, fontSize: "14px", opacity: .5, textAlign: "right" }}>→</div>
                </div>
              );
            })}

            {totalPages > 1 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "16px", borderTop: "1px solid #F3F4F6" }}>
                <button onClick={() => fetchOrders(1, search, statusFilter, true)} disabled={page === 1} style={{ padding: "5px 10px", borderRadius: "6px", border: "1px solid #E5E7EB", background: "transparent", color: page === 1 ? "#D1D5DB" : "#374151", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "12px", fontFamily: "inherit" }}>«</button>
                <button onClick={() => fetchOrders(page - 1, search, statusFilter, true)} disabled={page === 1} style={{ padding: "5px 13px", borderRadius: "6px", border: "1px solid #E5E7EB", background: "transparent", color: page === 1 ? "#D1D5DB" : "#1F2937", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "13px", fontFamily: "inherit" }}>← Prev</button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                  const p = start + i;
                  return (
                    <button key={p} onClick={() => fetchOrders(p, search, statusFilter, true)} style={{ width: "32px", height: "32px", borderRadius: "7px", border: `1px solid ${p === page ? BURG : "#E5E7EB"}`, background: p === page ? `linear-gradient(135deg, ${BURG}, ${BURG_DARK})` : "transparent", color: p === page ? "#fff" : "#374151", fontSize: "13px", fontWeight: p === page ? 700 : 400, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}>
                      {p}
                    </button>
                  );
                })}
                <button onClick={() => fetchOrders(page + 1, search, statusFilter, true)} disabled={page === totalPages} style={{ padding: "5px 13px", borderRadius: "6px", border: "1px solid #E5E7EB", background: "transparent", color: page === totalPages ? "#D1D5DB" : "#1F2937", cursor: page === totalPages ? "not-allowed" : "pointer", fontSize: "13px", fontFamily: "inherit" }}>Next →</button>
                <button onClick={() => fetchOrders(totalPages, search, statusFilter, true)} disabled={page === totalPages} style={{ padding: "5px 10px", borderRadius: "6px", border: "1px solid #E5E7EB", background: "transparent", color: page === totalPages ? "#D1D5DB" : "#374151", cursor: page === totalPages ? "not-allowed" : "pointer", fontSize: "12px", fontFamily: "inherit" }}>»</button>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes scaleIn   { from{opacity:0;transform:scale(.93)} to{opacity:1;transform:scale(1)} }
        @keyframes slideLeft { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        input::placeholder   { color:#9CA3AF; }
        input:focus,select:focus { border-color:${BURG} !important; }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }
      `}</style>
    </div>
    </DashPageWrapper>
  );
}
