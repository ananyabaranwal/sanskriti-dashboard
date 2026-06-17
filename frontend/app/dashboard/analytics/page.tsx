"use client";

// ── DESTINATION: frontend/app/dashboard/analytics/page.tsx
// (this comment is just a label — safe to delete)

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import api from "@/lib/api";
import DashPageWrapper from "../DashPageWrapper";

const BURG      = "#9B0020";
const BURG_DARK = "#7A0018";

type TrendPoint = { month: string; year: number; revenue: number; orders: number };
type StatusRow  = { _id: string; count: number };
type ProductRow = { _id: string; revenue: number; qty: number };
type CustomerRow = { _id: string; name: string; phone: string; totalOrders: number; totalRevenue: number };

const statusMeta: Record<string, { color: string; bg: string; label: string }> = {
  PENDING:    { color: "#854d0e", bg: "#FFFBEB", label: "Pending" },
  CONFIRMED:  { color: "#1d4ed8", bg: "#EFF6FF", label: "Confirmed" },
  PROCESSING: { color: "#6d28d9", bg: "#F5F3FF", label: "Processing" },
  PACKED:     { color: "#0369a1", bg: "#F0F9FF", label: "Packed" },
  SHIPPED:    { color: "#065f46", bg: "#ECFDF5", label: "Shipped" },
  DELIVERED:  { color: "#15803d", bg: "#F0FDF4", label: "Delivered" },
  CANCELLED:  { color: "#dc2626", bg: "#FEF2F2", label: "Cancelled" },
  RETURNED:   { color: "#9f1239", bg: "#FFF1F2", label: "Returned" },
};

// ── Sales trend bar chart ────────────────────────────────────
function TrendChart({ data }: { data: TrendPoint[] }) {
  const max = Math.max(...data.map(d => d.revenue), 1);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", height: "160px", padding: "0 4px" }}>
        {data.map((d, i) => {
          const pct = Math.max((d.revenue / max) * 100, d.revenue > 0 ? 6 : 3);
          const isLast = i === data.length - 1;
          return (
            <div key={`${d.month}-${d.year}`} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%" }}>
              <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                <div title={`₹${d.revenue.toLocaleString("en-IN")} · ${d.orders} orders`} style={{ width: "100%", height: `${pct}%`, minHeight: "4px", borderRadius: "5px 5px 0 0", background: isLast ? `linear-gradient(180deg, ${BURG}, ${BURG_DARK})` : d.revenue > 0 ? "rgba(155,0,32,.25)" : "#F3F4F6", transition: "height .4s ease" }} />
              </div>
              <div style={{ fontSize: "10px", color: isLast ? BURG : "#9CA3AF", fontWeight: isLast ? 700 : 400 }}>{d.month}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [months, setMonths]   = useState(6);
  const [data, setData]       = useState<{
    trend: TrendPoint[];
    totals: { revenue: number; orders: number };
    statusBreakdown: StatusRow[];
    topProducts: ProductRow[];
    topCustomers: CustomerRow[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (m: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/analytics/overview?months=${m}`);
      setData(res.data);
    } catch {
      // leave data as-is on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(months); }, [months, fetchData]);

  const totalStatusCount = data?.statusBreakdown.reduce((s, r) => s + r.count, 0) || 0;
  const maxProductRevenue = Math.max(...(data?.topProducts.map(p => p.revenue) || [1]), 1);
  const maxCustomerRevenue = Math.max(...(data?.topCustomers.map(c => c.totalRevenue) || [1]), 1);

  return (
    <DashPageWrapper>
      <div style={{ maxWidth: "1100px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <p style={{ fontSize: "12px", color: "#6B7280", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "4px" }}>Insights</p>
            <h1 style={{ fontSize: "26px", fontFamily: "Georgia, serif", color: "#1F2937", fontWeight: 400 }}>Analytics</h1>
            <p style={{ fontSize: "14px", color: "#6B7280", marginTop: "3px" }}>Sales trends, top products, and top customers</p>
          </div>
          <div style={{ display: "flex", gap: "4px", background: "#F3F4F6", padding: "4px", borderRadius: "10px" }}>
            {[3, 6, 12].map(m => (
              <button key={m} onClick={() => setMonths(m)} style={{ padding: "7px 16px", borderRadius: "7px", border: "none", background: months === m ? "#fff" : "transparent", color: months === m ? BURG : "#6B7280", fontSize: "13px", fontWeight: months === m ? 600 : 400, cursor: "pointer", fontFamily: "inherit", boxShadow: months === m ? "0 1px 4px rgba(0,0,0,.08)" : "none" }}>
                {m}mo
              </button>
            ))}
          </div>
        </div>

        {/* Totals row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "20px" }}>
          {loading
            ? Array(2).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: "90px", borderRadius: "14px" }} />)
            : [
                { label: `Revenue (${months}mo)`, value: `₹${(data?.totals.revenue ?? 0).toLocaleString("en-IN")}`, icon: "💹" },
                { label: `Orders (${months}mo)`,  value: String(data?.totals.orders ?? 0),                            icon: "📦" },
              ].map(s => (
                <div key={s.label} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "14px", padding: "16px 18px" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "rgba(155,0,32,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", marginBottom: "10px" }}>{s.icon}</div>
                  <div style={{ fontSize: "20px", fontWeight: 700, color: "#1F2937", fontFamily: "Georgia, serif", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "4px" }}>{s.label}</div>
                </div>
              ))
          }
        </div>

        {/* Sales trend */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "20px 22px", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#1F2937", fontFamily: "Georgia, serif", marginBottom: "4px" }}>Sales Trend</h2>
          <p style={{ fontSize: "12px", color: "#6B7280", marginBottom: "16px" }}>Revenue by month — current month highlighted</p>
          {loading
            ? <div className="skeleton" style={{ height: "160px", borderRadius: "8px" }} />
            : data && <TrendChart data={data.trend} />
          }
        </div>

        {/* Two column: status breakdown + top products/customers */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>

          {/* Order status breakdown */}
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "20px 22px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#1F2937", fontFamily: "Georgia, serif", marginBottom: "16px" }}>Order Status Breakdown</h2>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>{[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: "28px", borderRadius: "6px" }} />)}</div>
            ) : !data?.statusBreakdown.length ? (
              <p style={{ fontSize: "13px", color: "#6B7280" }}>No orders yet</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {data.statusBreakdown.sort((a, b) => b.count - a.count).map(s => {
                  const meta = statusMeta[s._id] || { color: "#374151", bg: "#F3F4F6", label: s._id };
                  const pct = totalStatusCount ? Math.round((s.count / totalStatusCount) * 100) : 0;
                  return (
                    <div key={s._id}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 500, color: "#1F2937" }}>{meta.label}</span>
                        <span style={{ fontSize: "12px", color: "#6B7280" }}>{s.count} ({pct}%)</span>
                      </div>
                      <div style={{ height: "8px", background: "#F3F4F6", borderRadius: "99px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: meta.color, borderRadius: "99px", transition: "width .4s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Top products */}
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "20px 22px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#1F2937", fontFamily: "Georgia, serif", marginBottom: "16px" }}>Top Products</h2>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>{[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: "28px", borderRadius: "6px" }} />)}</div>
            ) : !data?.topProducts.length ? (
              <p style={{ fontSize: "13px", color: "#6B7280" }}>No product sales yet</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {data.topProducts.map((p, i) => (
                  <div key={p._id}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 500, color: "#1F2937", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "180px" }}>{i + 1}. {p._id}</span>
                      <span style={{ fontSize: "12px", color: "#6B7280" }}>₹{p.revenue.toLocaleString("en-IN")}</span>
                    </div>
                    <div style={{ height: "8px", background: "#F3F4F6", borderRadius: "99px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(p.revenue / maxProductRevenue) * 100}%`, background: `linear-gradient(90deg, ${BURG}, ${BURG_DARK})`, borderRadius: "99px", transition: "width .4s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top customers */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px", overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#1F2937", fontFamily: "Georgia, serif" }}>Top Customers</h2>
            <Link href="/dashboard/customers" style={{ fontSize: "12px", color: BURG, fontWeight: 600, textDecoration: "none" }}>View all →</Link>
          </div>
          {loading ? (
            <div style={{ padding: "16px 22px" }}>{[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: "44px", borderRadius: "8px", marginBottom: "8px" }} />)}</div>
          ) : !data?.topCustomers.length ? (
            <div style={{ padding: "32px 22px", textAlign: "center" }}>
              <p style={{ fontSize: "13px", color: "#6B7280" }}>No customer data yet</p>
            </div>
          ) : (
            <div style={{ padding: "8px 0" }}>
              {data.topCustomers.map((c, i) => (
                <div key={c._id} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 22px", borderBottom: i < data.topCustomers.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(155,0,32,.08)", color: BURG, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>{c.name.charAt(0).toUpperCase()}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#1F2937" }}>{c.name}</div>
                    <div style={{ fontSize: "11px", color: "#9CA3AF" }}>{c.totalOrders} order{c.totalOrders !== 1 ? "s" : ""}</div>
                  </div>
                  <div style={{ width: "120px" }}>
                    <div style={{ height: "6px", background: "#F3F4F6", borderRadius: "99px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(c.totalRevenue / maxCustomerRevenue) * 100}%`, background: BURG, borderRadius: "99px" }} />
                    </div>
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#1F2937", flexShrink: 0, width: "90px", textAlign: "right" }}>₹{c.totalRevenue.toLocaleString("en-IN")}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashPageWrapper>
  );
}
