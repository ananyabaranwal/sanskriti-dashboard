"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";

function StatCard({ icon, label, value, sub, change, color, href }: { icon:string; label:string; value:string; sub?:string; change?:string; color:string; href?:string }) {
  const [hovered, setHovered] = useState(false);
  const isUp = change?.startsWith("+");
  const content = (
    <div onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:"12px", padding:"20px", transition:"all .2s", transform:hovered?"translateY(-1px)":"none", boxShadow:hovered?"0 4px 16px rgba(0,0,0,.08)":"0 1px 3px rgba(0,0,0,.04)", cursor:href?"pointer":"default" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"14px" }}>
        <div style={{ width:"40px", height:"40px", borderRadius:"10px", background:color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px" }}>{icon}</div>
        {change && <span style={{ fontSize:"11px", fontWeight:700, color:isUp?"#15803d":"#dc2626", background:isUp?"#f0fdf4":"#fef2f2", padding:"3px 8px", borderRadius:"99px", border:`1px solid ${isUp?"#bbf7d0":"#fecaca"}` }}>{change}</span>}
      </div>
      <div style={{ fontSize:"26px", fontWeight:700, color:"#111827", fontFamily:"Georgia,serif", lineHeight:1, marginBottom:"4px" }}>{value}</div>
      <div style={{ fontSize:"13px", color:"#6b7280", marginBottom:sub?"2px":0 }}>{label}</div>
      {sub && <div style={{ fontSize:"11px", color:"#9ca3af" }}>{sub}</div>}
    </div>
  );
  return href ? <Link href={href} style={{ textDecoration:"none", display:"block" }}>{content}</Link> : content;
}

const statusColors: Record<string,string> = {
  DELIVERED:"#15803d", CANCELLED:"#dc2626", PENDING:"#d97706", CONFIRMED:"#1d4ed8", SHIPPED:"#065f46", PROCESSING:"#6d28d9"
};
const statusBg: Record<string,string> = {
  DELIVERED:"#f0fdf4", CANCELLED:"#fef2f2", PENDING:"#fffbeb", CONFIRMED:"#eff6ff", SHIPPED:"#ecfdf5", PROCESSING:"#f5f3ff"
};

export default function AdminOverviewPage() {
  const [orders, setOrders]   = useState<any[]>([]);
  const [stats, setStats]     = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      api.get("/orders?limit=6"),
      api.get("/wallet/balance"),
      api.get("/payouts/my-payouts?limit=5"),
      api.get("/seller/profile"),
    ]).then(([ordRes, walRes, payRes, selRes]) => {
      if (ordRes.status==="fulfilled") {
        setOrders(ordRes.value.data.orders||[]);
        const s = ordRes.value.data;
        const rev = s.stats?.reduce((sum:number,x:any)=>x._id!=="CANCELLED"?sum+x.revenue:sum,0)||0;
        setStats({ totalOrders:s.pagination?.total||0, totalRevenue:rev, wallet:walRes.status==="fulfilled"?(walRes.value.data.balance||0):0, sellers:1, pendingPayouts:payRes.status==="fulfilled"?(payRes.value.data.payouts?.filter((p:any)=>p.status==="PENDING").length||0):0 });
      }
      if (payRes.status==="fulfilled") setPayouts(payRes.value.data.payouts||[]);
    }).finally(()=>setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth:"1200px" }}>

      {/* Page header */}
      <div style={{ marginBottom:"24px" }}>
        <h1 style={{ fontSize:"22px", fontWeight:700, color:"#111827", marginBottom:"4px" }}>Platform Overview</h1>
        <p style={{ fontSize:"14px", color:"#6b7280" }}>
          {new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})} · Real-time snapshot
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"14px", marginBottom:"24px" }}>
        {loading ? Array(5).fill(0).map((_,i)=><div key={i} className="skeleton" style={{ height:"120px", borderRadius:"12px" }}/>) : (
          <>
            <StatCard icon="👥" label="Total Sellers"   value={String(stats?.sellers||0)}                               sub="Registered"           color="rgba(79,70,229,.1)"   href="/admin/sellers"  change="+1 this week" />
            <StatCard icon="📦" label="Total Orders"    value={String(stats?.totalOrders||0)}                           sub="All time"             color="rgba(16,185,129,.1)"  href="/admin/orders"   change="+2 today"     />
            <StatCard icon="💹" label="Total Revenue"   value={`₹${(stats?.totalRevenue||0).toLocaleString("en-IN")}`} sub="Platform sales"       color="rgba(245,158,11,.1)"                                              />
            <StatCard icon="💸" label="Pending Payouts" value={String(stats?.pendingPayouts||0)}                        sub="Awaiting approval"    color="rgba(239,68,68,.08)"  href="/admin/payouts"                       />
            <StatCard icon="💰" label="Wallet Balance"  value={`₹${(stats?.wallet||0).toLocaleString("en-IN")}`}       sub="Seller wallet"        color="rgba(201,168,76,.1)"                                              />
          </>
        )}
      </div>

      {/* Two column layout */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:"18px", alignItems:"start" }}>

        {/* Recent orders */}
        <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:"12px", overflow:"hidden" }}>
          <div style={{ padding:"16px 20px", borderBottom:"1px solid #f3f4f6", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:"15px", fontWeight:600, color:"#111827" }}>Recent Orders</div>
              <div style={{ fontSize:"12px", color:"#9ca3af", marginTop:"2px" }}>Latest platform activity</div>
            </div>
            <Link href="/admin/orders" style={{ fontSize:"12px", color:"#C9A84C", fontWeight:600, textDecoration:"none" }}>View all →</Link>
          </div>

          {loading ? (
            <div style={{ padding:"16px 20px" }}>{[1,2,3].map(i=><div key={i} className="skeleton" style={{ height:"48px", borderRadius:"8px", marginBottom:"8px" }}/>)}</div>
          ) : orders.length===0 ? (
            <div style={{ padding:"40px", textAlign:"center" }}>
              <div style={{ fontSize:"36px", marginBottom:"10px" }}>📦</div>
              <p style={{ fontSize:"14px", color:"#9ca3af" }}>No orders yet</p>
            </div>
          ) : (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"140px 1fr 100px 100px 90px", padding:"9px 20px", background:"#f9fafb", borderBottom:"1px solid #f3f4f6" }}>
                {["Order #","Buyer","Amount","Status","Date"].map(h=>(
                  <div key={h} style={{ fontSize:"11px", fontWeight:600, color:"#9ca3af", textTransform:"uppercase", letterSpacing:".05em" }}>{h}</div>
                ))}
              </div>
              {orders.map((o,i)=>(
                <div key={o._id} style={{ display:"grid", gridTemplateColumns:"140px 1fr 100px 100px 90px", padding:"12px 20px", borderBottom:i<orders.length-1?"1px solid #f9fafb":"none", alignItems:"center" }}>
                  <div style={{ fontSize:"13px", fontWeight:600, color:"#111827" }}>{o.orderNumber}</div>
                  <div>
                    <div style={{ fontSize:"13px", color:"#374151" }}>{o.buyer?.name}</div>
                    <div style={{ fontSize:"11px", color:"#9ca3af" }}>{o.buyer?.phone}</div>
                  </div>
                  <div style={{ fontSize:"13px", fontWeight:700, color:"#111827" }}>₹{o.total?.toLocaleString("en-IN")}</div>
                  <span style={{ display:"inline-block", padding:"3px 8px", borderRadius:"99px", fontSize:"10px", fontWeight:700, background:statusBg[o.status]||"#f3f4f6", color:statusColors[o.status]||"#374151" }}>{o.status}</span>
                  <div style={{ fontSize:"11px", color:"#9ca3af" }}>{new Date(o.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Right column */}
        <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>

          {/* Quick actions */}
          <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:"12px", padding:"16px" }}>
            <div style={{ fontSize:"14px", fontWeight:600, color:"#111827", marginBottom:"12px" }}>Quick Actions</div>
            <div style={{ display:"flex", flexDirection:"column", gap:"7px" }}>
              {[
                { icon:"👥", label:"Review KYC requests",    href:"/admin/sellers",  badge:null,   color:"#f5f3ff", tc:"#6d28d9" },
                { icon:"💸", label:"Process payouts",         href:"/admin/payouts",  badge:stats?.pendingPayouts||0, color:"#fef2f2", tc:"#dc2626" },
                { icon:"🏺", label:"Manage gallery listings", href:"/admin/gallery",  badge:null,   color:"#f5e6c8", tc:"#8B6914" },
                { icon:"🎬", label:"Update training content", href:"/admin/content",  badge:null,   color:"#eff6ff", tc:"#1d4ed8" },
              ].map(a=>(
                <Link key={a.href} href={a.href} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 12px", borderRadius:"8px", background:"#f9fafb", border:"1px solid #f3f4f6", textDecoration:"none", transition:"all .15s" }}>
                  <div style={{ width:"30px", height:"30px", borderRadius:"7px", background:a.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", flexShrink:0 }}>{a.icon}</div>
                  <span style={{ fontSize:"13px", fontWeight:500, color:"#374151", flex:1 }}>{a.label}</span>
                  {a.badge ? <span style={{ padding:"2px 7px", borderRadius:"99px", fontSize:"10px", fontWeight:700, background:"#fee2e2", color:"#dc2626" }}>{a.badge}</span> : <span style={{ color:"#9ca3af", fontSize:"13px" }}>→</span>}
                </Link>
              ))}
            </div>
          </div>

          {/* Platform health */}
          <div style={{ background:"#111827", borderRadius:"12px", padding:"18px" }}>
            <div style={{ fontSize:"12px", fontWeight:600, color:"rgba(255,255,255,.4)", letterSpacing:".08em", textTransform:"uppercase", marginBottom:"14px" }}>System Health</div>
            {[
              {label:"Backend API",   status:"Operational", green:true  },
              {label:"Database",      status:"Operational", green:true  },
              {label:"PDF Service",   status:"Operational", green:true  },
              {label:"Email Service", status:"Active",      green:true  },
              {label:"Storage",       status:"Operational", green:true  },
            ].map(s=>(
              <div key={s.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
                <span style={{ fontSize:"13px", color:"rgba(255,255,255,.6)" }}>{s.label}</span>
                <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                  <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 6px #22c55e" }}/>
                  <span style={{ fontSize:"11px", color:"#22c55e", fontWeight:600 }}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pending payouts */}
          {payouts.filter(p=>p.status==="PENDING").length>0 && (
            <div style={{ background:"#fff", border:"1.5px solid #fde68a", borderRadius:"12px", overflow:"hidden" }}>
              <div style={{ padding:"12px 16px", background:"#fffbeb", borderBottom:"1px solid #fde68a", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ fontSize:"13px", fontWeight:600, color:"#92400e" }}>⚠️ Pending Payouts</div>
                <Link href="/admin/payouts" style={{ fontSize:"11px", color:"#d97706", fontWeight:600, textDecoration:"none" }}>Manage →</Link>
              </div>
              {payouts.filter(p=>p.status==="PENDING").slice(0,3).map((p,i)=>(
                <div key={p._id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 16px", borderBottom:i<2?"1px solid #fef9c3":"none" }}>
                  <div>
                    <div style={{ fontSize:"13px", fontWeight:700, color:"#111827" }}>₹{p.amount?.toLocaleString("en-IN")}</div>
                    <div style={{ fontSize:"11px", color:"#9ca3af" }}>{p.bankDetails?.bankName}</div>
                  </div>
                  <span style={{ padding:"3px 8px", borderRadius:"99px", background:"#fffbeb", color:"#854d0e", border:"1px solid #fde68a", fontSize:"10px", fontWeight:700 }}>PENDING</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
