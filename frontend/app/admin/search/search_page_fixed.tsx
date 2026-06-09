"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function AdminSearchPage() {
  const [query, setQuery]     = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  let debounceTimer: ReturnType<typeof setTimeout>;
  const handleChange = (val: string) => {
    setQuery(val);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => search(val), 350);
  };

  const search = async (q: string) => {
    if (!q || q.trim().length < 2) { setResults(null); return; }
    setLoading(true);
    try {
      const res = await api.get(`/admin/search?q=${encodeURIComponent(q)}&limit=5`);
      setResults(res.data.results);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const sections = [
    { key: "orders",   label: "Orders",   icon: "📦" },
    { key: "bills",    label: "Bills",    icon: "🧾" },
    { key: "clients",  label: "Clients",  icon: "👥" },
    { key: "products", label: "Products", icon: "📋" },
  ];

  const totalResults: number = results
    ? (Object.values(results) as any[]).reduce((s: number, v: any) => s + (v?.count || 0), 0)
    : 0;

  const navMap: Record<string, string> = {
    orders: "/admin/orders", bills: "/admin/billing",
    clients: "/admin/clients", products: "/admin/inventory",
  };

  return (
    <div style={{ maxWidth: "800px" }}>
      <div style={{ marginBottom: "28px" }}>
        <p style={{ fontSize: "12px", color: "#A08060", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "4px" }}>Admin</p>
        <h1 style={{ fontSize: "26px", fontFamily: "Georgia,serif", color: "#2C1810", fontWeight: 400 }}>Global Search</h1>
      </div>

      <div style={{ position: "relative", marginBottom: "24px" }}>
        <span style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", fontSize: "18px" }}>🔍</span>
        <input value={query} onChange={e => handleChange(e.target.value)} placeholder="Search orders, clients, invoices, products, phone numbers..." autoFocus
          style={{ width: "100%", padding: "16px 18px 16px 50px", borderRadius: "14px", border: "2px solid #E8D5A3", fontSize: "15px", color: "#2C1810", background: "#FFFDF9", outline: "none", fontFamily: "inherit" }} />
        {loading && <div style={{ position: "absolute", right: "18px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", color: "#A08060" }}>Searching...</div>}
      </div>

      {results && (
        <div>
          <div style={{ fontSize: "13px", color: "#A08060", marginBottom: "16px" }}>{String(totalResults)} results for &quot;{query}&quot;</div>
          {sections.map(s => {
            const data = (results[s.key]?.data || []) as any[];
            if (!data.length) return null;
            return (
              <div key={s.key} style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#A08060", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: "8px" }}>
                  {s.icon} {s.label} ({results[s.key]?.count})
                </div>
                <div style={{ background: "#FFFDF9", border: "1px solid #E8D5A3", borderRadius: "12px", overflow: "hidden" }}>
                  {data.map((item: any, i: number) => (
                    <div key={item._id || i} onClick={() => router.push(navMap[s.key])}
                      style={{ padding: "12px 16px", borderBottom: i < data.length - 1 ? "1px solid #F5EDE0" : "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#F5E6C8"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                    >
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#2C1810" }}>{item.orderNumber || item.invoiceNumber || item.name || "—"}</div>
                        <div style={{ fontSize: "11px", color: "#A08060" }}>
                          {item.buyer?.name || item.phone || item.sku || ""}
                          {item.buyer?.phone ? ` · ${item.buyer.phone}` : ""}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        {(item.total || item.grandTotal || item.totalRevenue || item.sellingPrice) ? (
                          <div style={{ fontSize: "13px", fontWeight: 700, color: "#8B6914" }}>
                            ₹{Number(item.total || item.grandTotal || item.totalRevenue || item.sellingPrice).toLocaleString("en-IN")}
                          </div>
                        ) : null}
                        <div style={{ fontSize: "10px", color: "#A08060" }}>{item.status || item.paymentStatus || item.stockStatus || ""}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!results && !loading && !query && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
          <p style={{ fontSize: "16px", fontWeight: 500, color: "#2C1810", marginBottom: "8px" }}>Search anything</p>
          <p style={{ fontSize: "13px", color: "#A08060" }}>Client names · Order numbers · Invoice numbers · Phone numbers · Product names</p>
        </div>
      )}

      <style>{`input::placeholder{color:#C4A882}input:focus{border-color:#C9A84C!important}`}</style>
    </div>
  );
}
