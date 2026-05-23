"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import DashPageWrapper from "./DashPageWrapper";

// ── Revenue Bar Chart ─────────────────────────────────────────
function RevenueChart({ orders }: { orders: any[] }) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const now = new Date();

  // Build last 6 months data from orders
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
                      ? "linear-gradient(180deg, #C9A84C, #8B6914)"
                      : d.revenue > 0
                      ? "rgba(201,168,76,.35)"
                      : "#F0E4C0",
                    transition: "height .4s ease",
                    cursor: "default",
                  }}
                />
              </div>
              <div style={{ fontSize: "10px", color: d.isCurrent ? "#8B6914" : "#A08060", fontWeight: d.isCurrent ? "700" : "400", whiteSpace: "nowrap" }}>{d.month}</div>
            </div>
          );
        })}
      </div>
      {/* Y-axis hint */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", paddingTop: "8px", borderTop: "1px solid #F0E4C0" }}>
        <span style={{ fontSize: "11px", color: "#A08060" }}>Last 6 months</span>
        <span style={{ fontSize: "11px", color: "#8B6914", fontWeight: "600" }}>Peak: ₹{maxRevenue.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color, href }: { icon: string; label: string; value: string; sub?: string; color: string; href?: string }) {
  const [hovered, setHovered] = useState(false);
  const content = (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: "#FFFDF9", border: `1px solid ${hovered ? "rgba(201,168,76,.5)" : "#E8D5A3"}`, borderRadius: "16px", padding: "20px 22px", transition: "all .22s ease", transform: hovered ? "translateY(-2px)" : "none", boxShadow: hovered ? "0 8px 24px rgba(61,43,31,.1)" : "0 2px 8px rgba(61,43,31,.04)", cursor: href ? "pointer" : "default" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{icon}</div>
        {href && <span style={{ fontSize: "12px", color: "#C9A84C", fontWeight: "600" }}>View →</span>}
      </div>
      <div style={{ fontSize: "26px", fontWeight: "700", color: "#2C1810", fontFamily: "Georgia, serif", lineHeight: 1, marginBottom: "5px" }}>{value}</div>
      <div style={{ fontSize: "13px", fontWeight: "500", color: "#6B4F12", marginBottom: sub ? "3px" : 0 }}>{label}</div>
      {sub && <div style={{ fontSize: "11px", color: "#A08060" }}>{sub}</div>}
    </div>
  );
  return href ? <Link href={href} style={{ textDecoration: "none", display: "block" }}>{content}</Link> : content;
}

// ── Quick Action ──────────────────────────────────────────────
function QuickAction({ icon, label, desc, href, color }: { icon: string; label: string; desc: string; href: string; color: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: "#FFFDF9", border: `1px solid ${hovered ? "rgba(201,168,76,.4)" : "#E8D5A3"}`, borderRadius: "14px", padding: "16px 18px", display: "flex", alignItems: "center", gap: "14px", transition: "all .22s", transform: hovered ? "translateY(-2px)" : "none", boxShadow: hovered ? "0 8px 20px rgba(61,43,31,.08)" : "none", cursor: "pointer" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>{icon}</div>
        <div>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#2C1810", marginBottom: "2px" }}>{label}</div>
          <div style={{ fontSize: "12px", color: "#A08060" }}>{desc}</div>
        </div>
        <span style={{ marginLeft: "auto", color: "#C9A84C", fontSize: "16px", opacity: hovered ? 1 : 0.4, transition: "opacity .2s" }}>→</span>
      </div>
    </Link>
  );
}

// ── Main Dashboard Page ───────────────────────────────────────
export default function DashboardPage() {
  const [seller, setSeller]         = useState<any>(null);
  const [wallet, setWallet]         = useState<any>(null);
  const [orders, setOrders]         = useState<any>(null);
  const [allOrders, setAllOrders]   = useState<any[]>([]);
  const [bills, setBills]           = useState<any>(null);
  const [transactions, setTx]       = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [greeting, setGreeting]     = useState("Good day");

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
  const walletBalance  = wallet?.balance ?? 0;
  const totalOrders    = orders?.pagination?.total ?? 0;
  const totalBills     = bills?.pagination?.total ?? 0;
  const pendingOrders  = orders?.stats?.find((s: any) => s._id === "PENDING")?.count ?? 0;
  const totalRevenue   = orders?.stats?.reduce((sum: number, s: any) => s._id !== "CANCELLED" ? sum + s.revenue : sum, 0) ?? 0;

  // This month orders
  const now = new Date();
  const thisMonthOrders = allOrders.filter((o) => {
    const d = new Date(o.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthRevenue = thisMonthOrders.filter(o => o.status !== "CANCELLED").reduce((s, o) => s + (o.total || 0), 0);

  const statusColor = (s: string) => ({
    PENDING:    { bg: "#FFFBEB", color: "#854d0e"  },
    CONFIRMED:  { bg: "#EFF6FF", color: "#1d4ed8"  },
    PROCESSING: { bg: "#F5F3FF", color: "#6d28d9"  },
    SHIPPED:    { bg: "#ECFDF5", color: "#065f46"  },
    DELIVERED:  { bg: "#F0FDF4", color: "#15803d"  },
    CANCELLED:  { bg: "#FEF2F2", color: "#dc2626"  },
  }[s] || { bg: "#F5E6C8", color: "#6B4F12" });

  return (
    <DashPageWrapper>
    <div style={{ maxWidth: "1100px" }}>

      {/* ── Greeting ── */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
          <div>
            {loading
              ? <div className="skeleton" style={{ width: "240px", height: "32px", marginBottom: "8px", borderRadius: "8px" }} />
              : <h1 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontFamily: "Georgia, serif", color: "#2C1810", fontWeight: "400", lineHeight: 1.2 }}>
                  {greeting}, <span style={{ background: "linear-gradient(135deg, #C9A84C, #8B6914)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{seller?.name?.split(" ")[0] || "Seller"}</span> 👋
                </h1>
            }
            <p style={{ fontSize: "14px", color: "#A08060", marginTop: "5px" }}>Here's what's happening with your store today</p>
          </div>
          <Link href="/dashboard/orders" style={{ padding: "10px 20px", borderRadius: "8px", background: "linear-gradient(135deg, #C9A84C, #8B6914)", color: "#2C1810", fontSize: "13px", fontWeight: "700", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>+ New Order</Link>
        </div>
      </div>

      {/* ── KYC Banner ── */}
      {!loading && seller?.kycStatus !== "approved" && (
        <div style={{ background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)", border: "1px solid #FDE68A", borderLeft: "4px solid #F59E0B", borderRadius: "12px", padding: "14px 18px", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "20px" }}>⚠️</span>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#92400E" }}>KYC Verification Pending</div>
              <div style={{ fontSize: "12px", color: "#B45309" }}>Complete KYC to unlock selling, payouts, and your verified badge</div>
            </div>
          </div>
          <Link href="/dashboard/kyc" style={{ padding: "8px 18px", borderRadius: "8px", background: "#F59E0B", color: "#2C1810", fontSize: "13px", fontWeight: "700", textDecoration: "none", whiteSpace: "nowrap" }}>Complete KYC →</Link>
        </div>
      )}

      {/* ── Stats: 4 cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        {loading ? Array(4).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: "130px", borderRadius: "16px" }} />) : (
          <>
            <StatCard icon="💰" label="Wallet Balance"     value={`₹${walletBalance.toLocaleString("en-IN")}`}        sub="Available to use"              color="rgba(201,168,76,.15)"  href="/dashboard/wallet"  />
            <StatCard icon="📦" label="Orders This Month"  value={String(thisMonthOrders.length)}                     sub={`${pendingOrders} pending`}    color="rgba(59,130,246,.12)"  href="/dashboard/orders"  />
            <StatCard icon="💹" label="Revenue This Month" value={`₹${thisMonthRevenue.toLocaleString("en-IN")}`}     sub={`₹${totalRevenue.toLocaleString("en-IN")} all time`} color="rgba(16,185,129,.12)" href="/dashboard/orders" />
            <StatCard icon="🧾" label="Invoices"           value={String(totalBills)}                                 sub="GST invoices"                  color="rgba(139,92,246,.12)"  href="/dashboard/bills"   />
          </>
        )}
      </div>

      {/* ── Two column layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px", alignItems: "start" }}>

        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Revenue bar chart */}
          <div style={{ background: "#FFFDF9", border: "1px solid #E8D5A3", borderRadius: "16px", padding: "20px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#2C1810", fontFamily: "Georgia, serif" }}>Revenue Overview</h2>
                <p style={{ fontSize: "12px", color: "#A08060", marginTop: "2px" }}>Last 6 months — current month highlighted</p>
              </div>
              <div style={{ padding: "4px 10px", borderRadius: "99px", background: "rgba(201,168,76,.1)", border: "1px solid rgba(201,168,76,.25)", fontSize: "11px", color: "#8B6914", fontWeight: "600" }}>
                This month: ₹{thisMonthRevenue.toLocaleString("en-IN")}
              </div>
            </div>
            {loading
              ? <div className="skeleton" style={{ height: "140px", borderRadius: "8px" }} />
              : <RevenueChart orders={allOrders} />
            }
          </div>

          {/* Recent orders table */}
          <div style={{ background: "#FFFDF9", border: "1px solid #E8D5A3", borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ padding: "16px 22px", borderBottom: "1px solid #F0E4C0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#2C1810", fontFamily: "Georgia, serif" }}>Recent Orders</h2>
                <p style={{ fontSize: "12px", color: "#A08060", marginTop: "2px" }}>Your latest 5 orders</p>
              </div>
              <Link href="/dashboard/orders" style={{ fontSize: "12px", color: "#8B6914", fontWeight: "600", textDecoration: "none" }}>View all →</Link>
            </div>

            {loading ? (
              <div style={{ padding: "16px 22px" }}>
                {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: "52px", borderRadius: "8px", marginBottom: "10px" }} />)}
              </div>
            ) : (orders?.orders || []).length === 0 ? (
              <div style={{ padding: "40px 22px", textAlign: "center" }}>
                <div style={{ fontSize: "36px", marginBottom: "10px" }}>📦</div>
                <p style={{ fontSize: "14px", color: "#A08060", marginBottom: "14px" }}>No orders yet</p>
                <Link href="/dashboard/orders" style={{ padding: "8px 20px", borderRadius: "8px", background: "linear-gradient(135deg, #C9A84C, #8B6914)", color: "#2C1810", fontSize: "13px", fontWeight: "700", textDecoration: "none" }}>Create First Order</Link>
              </div>
            ) : (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 100px 90px", padding: "10px 22px", background: "#FBF7F0", borderBottom: "1px solid #F0E4C0" }}>
                  {["Order", "Buyer", "Amount", "Status"].map(h => (
                    <div key={h} style={{ fontSize: "11px", fontWeight: "600", color: "#A08060", letterSpacing: ".05em", textTransform: "uppercase" }}>{h}</div>
                  ))}
                </div>
                {(orders?.orders || []).map((o: any, i: number) => {
                  const sc = statusColor(o.status);
                  return (
                    <div key={o._id} style={{ display: "grid", gridTemplateColumns: "1fr 120px 100px 90px", padding: "14px 22px", borderBottom: i < (orders?.orders?.length - 1) ? "1px solid #F5EDE0" : "none", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: "600", color: "#2C1810" }}>{o.orderNumber}</div>
                        <div style={{ fontSize: "11px", color: "#A08060" }}>{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                      </div>
                      <div style={{ fontSize: "13px", color: "#2C1810", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.buyer?.name}</div>
                      <div style={{ fontSize: "13px", fontWeight: "600", color: "#2C1810" }}>₹{o.total?.toLocaleString("en-IN")}</div>
                      <span style={{ display: "inline-block", padding: "3px 8px", borderRadius: "99px", fontSize: "10px", fontWeight: "700", background: sc.bg, color: sc.color, letterSpacing: ".03em" }}>{o.status}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Wallet card */}
          <div style={{ background: "linear-gradient(135deg, #2C1810, #3D2B1F)", borderRadius: "16px", padding: "22px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "100px", height: "100px", borderRadius: "50%", border: "1px solid rgba(201,168,76,.1)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-20px", left: "-20px", width: "70px", height: "70px", borderRadius: "50%", border: "1px solid rgba(201,168,76,.08)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: "11px", fontWeight: "600", color: "rgba(201,168,76,.6)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "10px" }}>Wallet Balance</div>
              {loading
                ? <div className="skeleton" style={{ width: "140px", height: "38px", marginBottom: "8px", borderRadius: "6px" }} />
                : <div style={{ fontSize: "34px", fontWeight: "700", color: "#C9A84C", fontFamily: "Georgia, serif", lineHeight: 1, marginBottom: "6px" }}>₹{walletBalance.toLocaleString("en-IN")}</div>
              }
              <div style={{ fontSize: "12px", color: "rgba(245,230,200,.4)", marginBottom: "18px" }}>Available balance</div>
              <div style={{ display: "flex", gap: "8px" }}>
                <Link href="/dashboard/wallet" style={{ flex: 1, padding: "8px", borderRadius: "8px", background: "linear-gradient(135deg, #C9A84C, #8B6914)", color: "#2C1810", fontSize: "12px", fontWeight: "700", textDecoration: "none", textAlign: "center" }}>+ Add Money</Link>
                <Link href="/dashboard/wallet" style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "1px solid rgba(201,168,76,.25)", color: "#C9A84C", fontSize: "12px", fontWeight: "600", textDecoration: "none", textAlign: "center" }}>Withdraw</Link>
              </div>
            </div>
          </div>

          {/* Recent activity feed — last 5 transactions */}
          <div style={{ background: "#FFFDF9", border: "1px solid #E8D5A3", borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #F0E4C0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#2C1810", fontFamily: "Georgia, serif" }}>Recent Activity</h3>
              <Link href="/dashboard/wallet" style={{ fontSize: "11px", color: "#8B6914", fontWeight: "600", textDecoration: "none" }}>View all →</Link>
            </div>
            {loading ? (
              <div style={{ padding: "12px 18px" }}>
                {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: "44px", borderRadius: "8px", marginBottom: "8px" }} />)}
              </div>
            ) : transactions.length === 0 ? (
              <div style={{ padding: "24px 18px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>💳</div>
                <p style={{ fontSize: "13px", color: "#A08060" }}>No transactions yet</p>
                <Link href="/dashboard/wallet" style={{ display: "inline-block", marginTop: "10px", fontSize: "12px", fontWeight: "700", color: "#8B6914", textDecoration: "none" }}>+ Add Money</Link>
              </div>
            ) : (
              <div>
                {transactions.map((tx: any, i: number) => (
                  <div key={tx._id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 18px", borderBottom: i < transactions.length - 1 ? "1px solid #F5EDE0" : "none" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: tx.type === "CREDIT" ? "rgba(16,185,129,.1)" : "rgba(239,68,68,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>
                      {tx.type === "CREDIT" ? "⬆️" : "⬇️"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "12px", fontWeight: "500", color: "#2C1810", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tx.description}</div>
                      <div style={{ fontSize: "11px", color: "#A08060" }}>{new Date(tx.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: tx.type === "CREDIT" ? "#15803d" : "#dc2626", flexShrink: 0 }}>
                      {tx.type === "CREDIT" ? "+" : "-"}₹{tx.amount?.toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div style={{ background: "#FFFDF9", border: "1px solid #E8D5A3", borderRadius: "16px", padding: "16px 18px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#2C1810", fontFamily: "Georgia, serif", marginBottom: "12px" }}>Quick Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <QuickAction icon="💰" label="Add Money"        desc="Top up wallet"            href="/dashboard/wallet"  color="rgba(201,168,76,.15)"  />
              <QuickAction icon="📦" label="New Order"        desc="Create a new order"       href="/dashboard/orders"  color="rgba(59,130,246,.12)"  />
              <QuickAction icon="🧾" label="Generate Bill"    desc="Create GST invoice"       href="/dashboard/bills"   color="rgba(139,92,246,.12)"  />
              <QuickAction icon="🎬" label="Training Videos"  desc="Access learning content"  href="/dashboard/videos"  color="rgba(16,185,129,.12)"  />
            </div>
          </div>
        </div>
      </div>
    </div>
    </DashPageWrapper>
  );
}
