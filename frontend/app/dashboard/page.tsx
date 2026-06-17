"use client";

// ── DESTINATION: frontend/app/dashboard/page.tsx
// (this comment is just a label — safe to delete)

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import DashPageWrapper from "./DashPageWrapper";

const BURG      = "#9B0020";
const BURG_DARK = "#7A0018";

// ── Revenue Bar Chart ─────────────────────────────────────────
function RevenueChart({ orders }: { orders: any[] }) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const now = new Date();

  const data = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const month = months[d.getMonth()];
    const revenue = orders
      .filter((o) => {
        const od = new Date(o.createdAt);
        return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear() && o.status !== "CANCELLED";
      })
      .reduce((sum, o) => sum + (o.total || 0), 0);
    return { month, revenue, isCurrent: i === 5 };
  });

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "120px", padding: "0 4px" }}>
        {data.map((d) => {
          const pct = Math.max((d.revenue / maxRevenue) * 100, d.revenue > 0 ? 8 : 4);
          return (
            <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%" }}>
              <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                <div
                  title={`₹${d.revenue.toLocaleString("en-IN")}`}
                  style={{
                    width: "100%",
                    height: `${pct}%`,
                    minHeight: "4px",
                    borderRadius: "4px 4px 0 0",
                    background: d.isCurrent
                      ? `linear-gradient(180deg, ${BURG}, ${BURG_DARK})`
                      : d.revenue > 0
                      ? "rgba(155,0,32,.25)"
                      : "#F3F4F6",
                    transition: "height .4s ease",
                    cursor: "default",
                  }}
                />
              </div>
              <div style={{ fontSize: "10px", color: d.isCurrent ? BURG : "#9CA3AF", fontWeight: d.isCurrent ? "700" : "400", whiteSpace: "nowrap" }}>{d.month}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", paddingTop: "8px", borderTop: "1px solid #F3F4F6" }}>
        <span style={{ fontSize: "11px", color: "#9CA3AF" }}>Last 6 months</span>
        <span style={{ fontSize: "11px", color: BURG, fontWeight: "600" }}>Peak: ₹{maxRevenue.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color, href }: {
  icon: string; label: string; value: string; sub?: string; color: string; href?: string;
}) {
  const inner = (
    <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "8px", transition: "box-shadow .2s, transform .2s", cursor: href ? "pointer" : "default" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>{icon}</div>
        {href && <span style={{ color: BURG, fontSize: "14px", opacity: 0.5 }}>→</span>}
      </div>
      <div style={{ fontSize: "22px", fontWeight: "700", color: "#1F2937", fontFamily: "Georgia, serif" }}>{value}</div>
      <div style={{ fontSize: "12px", color: "#6B7280" }}>{label}</div>
      {sub && <div style={{ fontSize: "11px", color: "#9CA3AF" }}>{sub}</div>}
    </div>
  );
  if (href) return <Link href={href} style={{ textDecoration: "none" }}>{inner}</Link>;
  return inner;
}

// ── Main Dashboard Page ───────────────────────────────────────
export default function DashboardPage() {
  const [seller, setSeller]       = useState<any>(null);
  const [wallet, setWallet]       = useState<any>(null);
  const [orders, setOrders]       = useState<any>(null);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [bills, setBills]         = useState<any>(null);
  const [transactions, setTx]     = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [greeting, setGreeting]   = useState("Good day");

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Good morning");
    else if (h < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const load = async () => {
      try {
        const [sellerRes, walletRes, ordersRes, billsRes, txRes, allOrdersRes] = await Promise.allSettled([
          api.get("/seller/profile"),
          api.get("/wallet/balance"),
          api.get("/orders?limit=5"),
          api.get("/bills?limit=5"),
          api.get("/wallet/transactions?page=1&limit=5"),
          api.get("/orders?limit=100"),
        ]);
        if (sellerRes.status    === "fulfilled") setSeller(sellerRes.value.data.seller);
        if (walletRes.status    === "fulfilled") setWallet(walletRes.value.data);
        if (ordersRes.status    === "fulfilled") setOrders(ordersRes.value.data);
        if (billsRes.status     === "fulfilled") setBills(billsRes.value.data);
        if (txRes.status        === "fulfilled") setTx(txRes.value.data.transactions ?? []);
        if (allOrdersRes.status === "fulfilled") setAllOrders(allOrdersRes.value.data.orders ?? []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Derived stats ──
  const walletBalance = wallet?.balance ?? 0;
  const totalBills    = bills?.pagination?.total ?? 0;
  const pendingOrders = orders?.stats?.find((s: any) => s._id === "PENDING")?.count ?? 0;
  const totalRevenue  = orders?.stats?.reduce((sum: number, s: any) => s._id !== "CANCELLED" ? sum + s.revenue : sum, 0) ?? 0;

  const now = new Date();
  const thisMonthOrders = allOrders.filter((o) => {
    const d = new Date(o.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthRevenue = thisMonthOrders
    .filter(o => o.status !== "CANCELLED")
    .reduce((s, o) => s + (o.total || 0), 0);

  return (
    <DashPageWrapper>
      <div style={{ maxWidth: "1100px" }}>

        {/* ── Greeting ── */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
            <div>
              {loading
                ? <div className="skeleton" style={{ width: "240px", height: "32px", marginBottom: "8px", borderRadius: "8px" }} />
                : <h1 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontFamily: "Georgia, serif", color: "#1F2937", fontWeight: "400", lineHeight: 1.2 }}>
                    {greeting}, <span style={{ color: BURG, fontWeight: 600 }}>{seller?.name?.split(" ")[0] || "Seller"}</span> 👋
                  </h1>
              }
              <p style={{ fontSize: "14px", color: "#6B7280", marginTop: "5px" }}>Here's what's happening with your store today</p>
            </div>
            <Link href="/dashboard/orders" style={{ padding: "10px 20px", borderRadius: "8px", background: BURG, color: "#fff", fontSize: "13px", fontWeight: "700", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 4px 14px rgba(155,0,32,.25)" }}>+ New Order</Link>
          </div>
        </div>

        {/* ── KYC Banner ── */}
        {!loading && seller?.kycStatus !== "approved" && (
          <div style={{ background: "#FFF5F5", border: "1px solid #FED7D7", borderLeft: `4px solid ${BURG}`, borderRadius: "12px", padding: "14px 18px", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "20px" }}>⚠️</span>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: BURG }}>KYC Verification Pending</div>
                <div style={{ fontSize: "12px", color: "#9B4444" }}>Complete KYC to unlock selling, payouts, and your verified badge</div>
              </div>
            </div>
            <Link href="/dashboard/kyc" style={{ padding: "8px 18px", borderRadius: "8px", background: BURG, color: "#fff", fontSize: "13px", fontWeight: "700", textDecoration: "none", whiteSpace: "nowrap" }}>Complete KYC →</Link>
          </div>
        )}

        {/* ── Stats: 4 cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
          {loading
            ? Array(4).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: "130px", borderRadius: "16px" }} />)
            : <>
                <StatCard icon="💰" label="Wallet Balance"     value={`₹${walletBalance.toLocaleString("en-IN")}`}       sub="Available to use"                                        color="rgba(155,0,32,.08)"  href="/dashboard/wallet"  />
                <StatCard icon="📦" label="Orders This Month"  value={String(thisMonthOrders.length)}                     sub={`${pendingOrders} pending`}                              color="rgba(155,0,32,.08)"  href="/dashboard/orders"  />
                <StatCard icon="💹" label="Revenue This Month" value={`₹${thisMonthRevenue.toLocaleString("en-IN")}`}     sub={`₹${totalRevenue.toLocaleString("en-IN")} all time`}     color="rgba(155,0,32,.08)"  href="/dashboard/orders"  />
                <StatCard icon="🧾" label="Invoices"           value={String(totalBills)}                                 sub="GST invoices"                                            color="rgba(155,0,32,.08)"  href="/dashboard/bills"   />
              </>
          }
        </div>

        {/* ── Revenue chart (full width) ── */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "20px 22px", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#1F2937", fontFamily: "Georgia, serif" }}>Revenue Overview</h2>
              <p style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px" }}>Last 6 months — current month highlighted</p>
            </div>
            <div style={{ padding: "4px 10px", borderRadius: "99px", background: "rgba(155,0,32,.08)", border: "1px solid rgba(155,0,32,.2)", fontSize: "11px", color: BURG, fontWeight: "600" }}>
              This month: ₹{thisMonthRevenue.toLocaleString("en-IN")}
            </div>
          </div>
          {loading
            ? <div className="skeleton" style={{ height: "140px", borderRadius: "8px" }} />
            : <RevenueChart orders={allOrders} />
          }
        </div>

        {/* ── Recent transactions ── */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px", overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#1F2937", fontFamily: "Georgia, serif" }}>Recent Transactions</h3>
            <Link href="/dashboard/wallet" style={{ fontSize: "11px", color: BURG, fontWeight: "600", textDecoration: "none" }}>View all →</Link>
          </div>

          {loading ? (
            <div style={{ padding: "14px 18px" }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: "44px", borderRadius: "8px", marginBottom: "8px" }} />)}
            </div>
          ) : transactions.length === 0 ? (
            <div style={{ padding: "24px 18px", textAlign: "center" }}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>💳</div>
              <p style={{ fontSize: "12px", color: "#6B7280" }}>No transactions yet</p>
            </div>
          ) : (
            <div style={{ padding: "8px 0" }}>
              {transactions.map((tx, i) => (
                <div key={tx._id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 18px", borderBottom: i < transactions.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: tx.type === "CREDIT" ? "rgba(16,185,129,.1)" : "rgba(239,68,68,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>
                    {tx.type === "CREDIT" ? "⬆️" : "⬇️"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "12px", fontWeight: "500", color: "#1F2937", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tx.description}</div>
                    <div style={{ fontSize: "11px", color: "#9CA3AF" }}>{new Date(tx.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: tx.type === "CREDIT" ? "#15803d" : "#dc2626", flexShrink: 0 }}>
                    {tx.type === "CREDIT" ? "+" : "-"}₹{tx.amount?.toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <style>{`
          @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>
    </DashPageWrapper>
  );
}
