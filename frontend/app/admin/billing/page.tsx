"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";

function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, []);
  const c = type === "success" ? { bg: "#F0FDF4", border: "#BBF7D0", color: "#15803d", icon: "✅" } : { bg: "#FEF2F2", border: "#FECACA", color: "#dc2626", icon: "❌" };
  return (
    <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 9999, padding: "12px 16px", borderRadius: "12px", background: c.bg, border: `1px solid ${c.border}`, color: c.color, fontSize: "13px", fontWeight: 500, display: "flex", alignItems: "center", gap: "10px", fontFamily: "inherit" }}>
      <span>{c.icon}</span><span>{msg}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "17px", color: "inherit", padding: 0, opacity: .6 }}>×</button>
    </div>
  );
}

export default function AdminBillingPage() {
  const [tab, setTab] = useState<"bills" | "gst" | "outstanding" | "revenue">("bills");
  const [bills, setBills] = useState<any[]>([]);
  const [gst, setGst] = useState<any>(null);
  const [outstanding, setOutstanding] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [filters, setFilters] = useState({ from: "", to: "", client: "", state: "", paymentStatus: "" });

  const fetchBills = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.from) params.append("from", filters.from);
      if (filters.to) params.append("to", filters.to);
      if (filters.client) params.append("client", filters.client);
      if (filters.state) params.append("state", filters.state);
      if (filters.paymentStatus) params.append("paymentStatus", filters.paymentStatus);
      const [billsRes, gstRes, outRes] = await Promise.allSettled([
        api.get(`/admin/reports/outstanding-payments`),
        api.get(`/admin/reports/gst-summary?${params}`),
        api.get(`/admin/reports/outstanding-payments`),
      ]);
      if (gstRes.status === "fulfilled") setGst(gstRes.value.data);
      if (outRes.status === "fulfilled") setOutstanding(outRes.value.data.bills || []);
      // Bills from export endpoint info
      setBills([]);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchRevenue = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/reports/top-clients?limit=20");
      setRevenue(res.data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (tab === "bills" || tab === "gst" || tab === "outstanding") fetchBills();
    if (tab === "revenue") fetchRevenue();
  }, [tab]);

  const exportData = async (type: string, format = "xlsx") => {
    try {
      const params = new URLSearchParams({ format });
      if (filters.from) params.append("from", filters.from);
      if (filters.to) params.append("to", filters.to);
      if (filters.state) params.append("state", filters.state);
      const res = await api.get(`/admin/export/${type}?${params}`, { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a"); a.href = url; a.download = `${type}_${Date.now()}.${format}`; a.click();
      setToast({ msg: `${type} exported as ${format.toUpperCase()}`, type: "success" });
    } catch { setToast({ msg: "Export failed", type: "error" }); }
  };

  const tabs = [
    { key: "bills", label: "Bills", icon: "🧾" },
    { key: "gst", label: "GST Summary", icon: "📋" },
    { key: "outstanding", label: "Outstanding", icon: "⏳" },
    { key: "revenue", label: "Client Revenue", icon: "💹" },
  ] as const;

  return (
    <div style={{ maxWidth: "1100px" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <p style={{ fontSize: "12px", color: "#888", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "4px" }}>Admin</p>
          <h1 style={{ fontSize: "26px", fontFamily: "Georgia,serif", color: "#111", fontWeight: 400 }}>Billing & Finance</h1>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => exportData("bills", "xlsx")} style={{ padding: "9px 16px", borderRadius: "9px", border: "1.5px solid #f0f0f0", background: "#fff", color: "#7a001a", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>⬇ Excel</button>
          <button onClick={() => exportData("bills", "csv")} style={{ padding: "9px 16px", borderRadius: "9px", border: "1.5px solid #f0f0f0", background: "#fff", color: "#7a001a", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>⬇ CSV</button>
          <button onClick={() => exportData("gst-summary", "xlsx")} style={{ padding: "9px 16px", borderRadius: "9px", background: "linear-gradient(135deg,#9B0020,#7a001a)", color: "#111", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>⬇ GST Report</button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap", padding: "14px 16px", background: "#f9f9f9", borderRadius: "12px", border: "1px solid #f0f0f0" }}>
        {[
          { key: "from", label: "From", type: "date" },
          { key: "to", label: "To", type: "date" },
          { key: "client", label: "Client name", type: "text" },
          { key: "state", label: "State", type: "text" },
        ].map(f => (
          <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "10px", fontWeight: 600, color: "#888", letterSpacing: ".06em" }}>{f.label.toUpperCase()}</label>
            <input type={f.type} value={(filters as any)[f.key]} onChange={e => setFilters(p => ({ ...p, [f.key]: e.target.value }))} style={{ padding: "7px 10px", borderRadius: "7px", border: "1.5px solid #f0f0f0", fontSize: "12px", color: "#111", background: "#fff", outline: "none", fontFamily: "inherit" }} />
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "10px", fontWeight: 600, color: "#888", letterSpacing: ".06em" }}>STATUS</label>
          <select value={filters.paymentStatus} onChange={e => setFilters(p => ({ ...p, paymentStatus: e.target.value }))} style={{ padding: "7px 10px", borderRadius: "7px", border: "1.5px solid #f0f0f0", fontSize: "12px", color: "#111", background: "#fff", fontFamily: "inherit" }}>
            <option value="">All</option>
            <option value="PAID">Paid</option>
            <option value="UNPAID">Unpaid</option>
            <option value="PARTIAL">Partial</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button onClick={fetchBills} style={{ padding: "7px 16px", borderRadius: "7px", background: "#111", color: "#9B0020", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Apply</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: "8px 16px", borderRadius: "99px", fontSize: "12px", fontWeight: 600, border: `1.5px solid ${tab === t.key ? "#9B0020" : "#f0f0f0"}`, background: tab === t.key ? "rgba(155,0,32,.12)" : "#fff", color: tab === t.key ? "#7a001a" : "#888", cursor: "pointer", fontFamily: "inherit" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* GST Summary */}
      {tab === "gst" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {gst?.totals && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "12px" }}>
              {[
                { label: "Total Revenue", value: `₹${(gst.totals.totalRevenue || 0).toLocaleString("en-IN")}` },
                { label: "CGST", value: `₹${(gst.totals.totalCGST || 0).toLocaleString("en-IN")}` },
                { label: "SGST", value: `₹${(gst.totals.totalSGST || 0).toLocaleString("en-IN")}` },
                { label: "IGST", value: `₹${(gst.totals.totalIGST || 0).toLocaleString("en-IN")}` },
                { label: "Total Tax", value: `₹${(gst.totals.totalTax || 0).toLocaleString("en-IN")}` },
                { label: "Invoices", value: String(gst.totals.invoiceCount || 0) },
              ].map(s => (
                <div key={s.label} style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "12px", padding: "16px" }}>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#111", fontFamily: "Georgia,serif" }}>{s.value}</div>
                  <div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
          {gst?.byState?.length > 0 && (
            <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>By State</div>
                <button onClick={() => exportData("gst-summary", "xlsx")} style={{ fontSize: "12px", color: "#7a001a", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>Export ↗</button>
              </div>
              {gst.byState.map((s: any, i: number) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px 100px 100px", padding: "12px 18px", borderBottom: "1px solid #f5f5f5", fontSize: "13px" }}>
                  <div style={{ fontWeight: 600, color: "#111" }}>{s._id || "Unknown"}</div>
                  <div style={{ color: "#7a001a" }}>₹{(s.totalCGST || 0).toLocaleString("en-IN")}</div>
                  <div style={{ color: "#7a001a" }}>₹{(s.totalSGST || 0).toLocaleString("en-IN")}</div>
                  <div style={{ color: "#7a001a" }}>₹{(s.totalIGST || 0).toLocaleString("en-IN")}</div>
                  <div style={{ fontWeight: 700, color: "#111" }}>₹{(s.revenue || 0).toLocaleString("en-IN")}</div>
                </div>
              ))}
            </div>
          )}
          {loading && <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>Loading...</div>}
        </div>
      )}

      {/* Outstanding Payments */}
      {tab === "outstanding" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ fontSize: "13px", color: "#888" }}>{outstanding.length} unpaid bills · Total: <strong style={{ color: "#dc2626" }}>₹{outstanding.reduce((s, b) => s + b.grandTotal, 0).toLocaleString("en-IN")}</strong></div>
            <button onClick={() => exportData("outstanding-payments", "xlsx")} style={{ fontSize: "12px", color: "#7a001a", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>⬇ Export</button>
          </div>
          <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 120px 100px 90px", padding: "10px 18px", background: "linear-gradient(135deg,#111,#111)" }}>
              {["Invoice", "Buyer", "Amount", "Overdue", "Date"].map(h => <div key={h} style={{ fontSize: "10px", fontWeight: 700, color: "#9B0020", letterSpacing: ".06em" }}>{h}</div>)}
            </div>
            {loading ? Array(4).fill(0).map((_, i) => <div key={i} style={{ height: "48px", margin: "8px 18px", borderRadius: "6px" }} className="skeleton" />) :
              outstanding.length === 0 ? <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>No outstanding payments</div> :
                outstanding.map((b, i) => {
                  const days = Math.floor((Date.now() - new Date(b.createdAt).getTime()) / 86400000);
                  return (
                    <div key={b._id} style={{ display: "grid", gridTemplateColumns: "160px 1fr 120px 100px 90px", padding: "12px 18px", borderBottom: i < outstanding.length - 1 ? "1px solid #f5f5f5" : "none", alignItems: "center" }}>
                      <div style={{ fontSize: "12px", fontWeight: 600, color: "#111" }}>{b.invoiceNumber}</div>
                      <div>
                        <div style={{ fontSize: "13px", color: "#111" }}>{b.buyer?.name}</div>
                        <div style={{ fontSize: "11px", color: "#888" }}>{b.buyer?.phone}</div>
                      </div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#dc2626" }}>₹{b.grandTotal?.toLocaleString("en-IN")}</div>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: days > 30 ? "#dc2626" : days > 7 ? "#854d0e" : "#7a001a" }}>{days}d</div>
                      <div style={{ fontSize: "11px", color: "#888" }}>{new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                    </div>
                  );
                })}
          </div>
        </div>
      )}

      {/* Client Revenue */}
      {tab === "revenue" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
            <button onClick={() => exportData("clients", "xlsx")} style={{ fontSize: "12px", color: "#7a001a", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>⬇ Export</button>
          </div>
          <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px 80px", padding: "10px 18px", background: "linear-gradient(135deg,#111,#111)" }}>
              {["Client", "Revenue", "Phone", "Orders"].map(h => <div key={h} style={{ fontSize: "10px", fontWeight: 700, color: "#9B0020", letterSpacing: ".06em" }}>{h}</div>)}
            </div>
            {loading ? Array(5).fill(0).map((_, i) => <div key={i} style={{ height: "48px", margin: "8px 18px", borderRadius: "6px" }} className="skeleton" />) :
              revenue.map((c, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px 80px", padding: "12px 18px", borderBottom: i < revenue.length - 1 ? "1px solid #f5f5f5" : "none", alignItems: "center" }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#111" }}>{c.name}</div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#7a001a", fontFamily: "Georgia,serif" }}>₹{c.totalRevenue?.toLocaleString("en-IN")}</div>
                  <div style={{ fontSize: "12px", color: "#888" }}>{c.phone}</div>
                  <div style={{ fontSize: "12px", color: "#7a001a" }}>{c.orderCount}</div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Bills tab placeholder */}
      {tab === "bills" && (
        <div style={{ textAlign: "center", padding: "48px", background: "#fff", border: "1px solid #f0f0f0", borderRadius: "16px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🧾</div>
          <p style={{ fontSize: "15px", color: "#111", fontWeight: 600, marginBottom: "8px" }}>Use Export to download bills</p>
          <p style={{ fontSize: "13px", color: "#888", marginBottom: "20px" }}>Set filters above and click Excel or CSV to download</p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button onClick={() => exportData("bills", "xlsx")} style={{ padding: "10px 20px", borderRadius: "9px", background: "linear-gradient(135deg,#9B0020,#7a001a)", color: "#111", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>⬇ Download Excel</button>
            <button onClick={() => exportData("bills", "csv")} style={{ padding: "10px 20px", borderRadius: "9px", border: "1.5px solid #f0f0f0", background: "#fff", color: "#7a001a", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>⬇ Download CSV</button>
          </div>
        </div>
      )}

      <style>{`input::placeholder{color:#C4A882}input:focus,select:focus{border-color:#9B0020!important}`}</style>
    </div>
  );
}
