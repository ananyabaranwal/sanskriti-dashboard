"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";

function MiniBar({ data, valueKey, labelKey, color = "#9B0020" }: { data: any[]; valueKey: string; labelKey: string; color?: string }) {
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "80px" }}>
      {data.map((d, i) => {
        const pct = Math.max((d[valueKey] / max) * 100, d[valueKey] > 0 ? 6 : 2);
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", height: "100%" }}>
            <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
              <div title={`${d[labelKey]}: ₹${d[valueKey]?.toLocaleString("en-IN")}`} style={{ width: "100%", height: `${pct}%`, minHeight: "2px", borderRadius: "3px 3px 0 0", background: color, opacity: i === data.length - 1 ? 1 : 0.45 }} />
            </div>
            <div style={{ fontSize: "9px", color: "#888", whiteSpace: "nowrap", overflow: "hidden", maxWidth: "40px", textAlign: "center" }}>{d[labelKey]}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminReportsPage() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [sales, setSales] = useState<any>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [topClients, setTopClients] = useState<any[]>([]);
  const [trend, setTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const fetchAll = async (p: string) => {
    setLoading(true);
    try {
      const [salesRes, prodRes, clientRes, trendRes] = await Promise.allSettled([
        api.get(`/admin/reports/sales?period=${p}`),
        api.get("/admin/reports/top-products?limit=10"),
        api.get("/admin/reports/top-clients?limit=10"),
        api.get("/admin/reports/sales-trend?months=6"),
      ]);
      if (salesRes.status === "fulfilled") setSales(salesRes.value.data);
      if (prodRes.status === "fulfilled") setTopProducts(prodRes.value.data.data || []);
      if (clientRes.status === "fulfilled") setTopClients(clientRes.value.data.data || []);
      if (trendRes.status === "fulfilled") setTrend(trendRes.value.data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(period); }, [period]);

  const exportReport = async (type: string) => {
    try {
      const res = await api.get(`/admin/export/${type}`, { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a"); a.href = url; a.download = `${type}_report.xlsx`; a.click();
      setToast({ msg: "Report exported", type: "success" });
    } catch { setToast({ msg: "Export failed", type: "error" }); }
  };

  const totalRevenue = sales?.totals?.revenue || 0;
  const totalOrders = sales?.totals?.orders || 0;

  return (
    <div style={{ maxWidth: "1100px" }}>
      {toast && (
        <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 9999, padding: "12px 16px", borderRadius: "12px", background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#15803d", fontSize: "13px", fontWeight: 500, display: "flex", alignItems: "center", gap: "10px", fontFamily: "inherit" }}>
          ✅ {toast.msg} <button onClick={() => setToast(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "17px", color: "inherit", opacity: .6 }}>×</button>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <p style={{ fontSize: "12px", color: "#888", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "4px" }}>Admin</p>
          <h1 style={{ fontSize: "26px", fontFamily: "Georgia,serif", color: "#111", fontWeight: 400 }}>Reports & Analytics</h1>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => exportReport("orders")} style={{ padding: "9px 16px", borderRadius: "9px", border: "1.5px solid #f0f0f0", background: "#fff", color: "#7a001a", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>⬇ Orders</button>
          <button onClick={() => exportReport("bills")} style={{ padding: "9px 16px", borderRadius: "9px", border: "1.5px solid #f0f0f0", background: "#fff", color: "#7a001a", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>⬇ Bills</button>
          <button onClick={() => exportReport("clients")} style={{ padding: "9px 16px", borderRadius: "9px", background: "linear-gradient(135deg,#9B0020,#7a001a)", color: "#111", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>⬇ Clients</button>
        </div>
      </div>

      {/* Period selector */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
        {(["daily", "weekly", "monthly"] as const).map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{ padding: "8px 18px", borderRadius: "99px", fontSize: "12px", fontWeight: 600, border: `1.5px solid ${period === p ? "#9B0020" : "#f0f0f0"}`, background: period === p ? "rgba(155,0,32,.12)" : "#fff", color: period === p ? "#7a001a" : "#888", cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>{p}</button>
        ))}
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "12px", marginBottom: "24px" }}>
        {loading ? Array(4).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: "90px", borderRadius: "12px" }} />) : (
          <>
            {[
              { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: "💹" },
              { label: "Total Orders", value: String(totalOrders), icon: "📦" },
              { label: "Top Product", value: topProducts[0]?.name || "—", icon: "🏆" },
              { label: "Top Client", value: topClients[0]?.name || "—", icon: "👤" },
            ].map(s => (
              <div key={s.label} style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "12px", padding: "16px" }}>
                <div style={{ fontSize: "20px", marginBottom: "6px" }}>{s.icon}</div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#111", fontFamily: "Georgia,serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.value}</div>
                <div style={{ fontSize: "11px", color: "#888", marginTop: "3px" }}>{s.label}</div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Sales trend chart */}
      {!loading && trend.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "16px", padding: "20px 22px", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "#111", fontFamily: "Georgia,serif" }}>Sales Trend</div>
              <div style={{ fontSize: "12px", color: "#888" }}>Last 6 months revenue</div>
            </div>
            {trend[trend.length - 1]?.growthPercent !== null && (
              <div style={{ padding: "4px 12px", borderRadius: "99px", background: (trend[trend.length - 1]?.growthPercent || 0) >= 0 ? "#F0FDF4" : "#FEF2F2", color: (trend[trend.length - 1]?.growthPercent || 0) >= 0 ? "#15803d" : "#dc2626", fontSize: "12px", fontWeight: 700 }}>
                {(trend[trend.length - 1]?.growthPercent || 0) >= 0 ? "▲" : "▼"} {Math.abs(trend[trend.length - 1]?.growthPercent || 0)}% vs last month
              </div>
            )}
          </div>
          <MiniBar data={trend} valueKey="revenue" labelKey="_id" color="#9B0020" />
        </div>
      )}

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

        {/* Top products */}
        <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "16px", overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>🏆 Top Products</div>
            <button onClick={() => exportReport("inventory")} style={{ fontSize: "12px", color: "#7a001a", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>Export ↗</button>
          </div>
          {loading ? Array(5).fill(0).map((_, i) => <div key={i} style={{ height: "44px", margin: "8px 18px", borderRadius: "6px" }} className="skeleton" />) :
            topProducts.length === 0 ? <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>No data</div> :
              topProducts.slice(0, 8).map((p, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 18px", borderBottom: "1px solid #f5f5f5" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: i < 3 ? "rgba(155,0,32,.2)" : "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: i < 3 ? "#7a001a" : "#888" }}>{i + 1}</div>
                    <div style={{ fontSize: "13px", color: "#111", fontWeight: 500 }}>{p.name}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#7a001a" }}>₹{p.totalRevenue?.toLocaleString("en-IN")}</div>
                    <div style={{ fontSize: "10px", color: "#888" }}>{p.totalQty} sold</div>
                  </div>
                </div>
              ))}
        </div>

        {/* Top clients */}
        <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "16px", overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>👤 Top Clients</div>
            <button onClick={() => exportReport("clients")} style={{ fontSize: "12px", color: "#7a001a", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>Export ↗</button>
          </div>
          {loading ? Array(5).fill(0).map((_, i) => <div key={i} style={{ height: "44px", margin: "8px 18px", borderRadius: "6px" }} className="skeleton" />) :
            topClients.length === 0 ? <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>No data</div> :
              topClients.slice(0, 8).map((c, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 18px", borderBottom: "1px solid #f5f5f5" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: i < 3 ? "rgba(155,0,32,.2)" : "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: i < 3 ? "#7a001a" : "#888" }}>{i + 1}</div>
                    <div>
                      <div style={{ fontSize: "13px", color: "#111", fontWeight: 500 }}>{c.name}</div>
                      <div style={{ fontSize: "10px", color: "#888" }}>{c.phone}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#7a001a" }}>₹{c.totalRevenue?.toLocaleString("en-IN")}</div>
                    <div style={{ fontSize: "10px", color: "#888" }}>{c.orderCount} orders</div>
                  </div>
                </div>
              ))}
        </div>
      </div>

      <style>{`.skeleton{background:linear-gradient(90deg,#e5e7eb 0%,#f3f4f6 50%,#e5e7eb 100%);background-size:200% 100%;animation:shimmer 1.6s infinite}.@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>
    </div>
  );
}
