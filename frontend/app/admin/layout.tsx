"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

const ADMIN_SECRET_SLUG = "sanskriti-admin-panel";
const BURG = "#9B0020";

const navGroups = [
  {
    label: "Overview",
    items: [
      { label:"Dashboard",    href:"/admin",                  icon:"📊", exact:true  },
      { label:"Search",       href:"/admin/search",           icon:"🔍", exact:false },
    ]
  },
  {
    label: "Commerce",
    items: [
      { label:"Sellers",      href:"/admin/sellers",          icon:"👥", exact:false },
      { label:"Orders",       href:"/admin/orders",           icon:"📦", exact:false },
      { label:"Clients",      href:"/admin/clients",          icon:"🤝", exact:false },
      { label:"Payouts",      href:"/admin/payouts",          icon:"💸", exact:false },
      { label:"Returns",      href:"/admin/returns",          icon:"↩️", exact:false },
    ]
  },
  {
    label: "Finance",
    items: [
      { label:"Billing",      href:"/admin/billing",          icon:"🧾", exact:false },
      { label:"Reports",      href:"/admin/reports",          icon:"📈", exact:false },
      { label:"Export Center",href:"/admin/export",           icon:"⬇️", exact:false },
    ]
  },
  {
    label: "Inventory",
    items: [
      { label:"Inventory",    href:"/admin/inventory",        icon:"📋", exact:false },
    ]
  },
  {
    label: "Platform",
    items: [
      { label:"Content",      href:"/admin/content",          icon:"🎬", exact:false },
      { label:"Gallery",      href:"/admin/gallery",          icon:"🏺", exact:false },
      { label:"Categories",   href:"/admin/categories",       icon:"🗂️", exact:false },
      { label:"Settings",     href:"/admin/settings",         icon:"⚙️", exact:false },
      { label:"Activity Log", href:"/admin/activity",         icon:"🕐", exact:false },
      { label:"Notifications",href:"/admin/notifications",    icon:"📢", exact:false },
    ]
  },
];

const allNavItems = navGroups.flatMap(g => g.items);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const [mounted,     setMounted]     = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [adminName,   setAdminName]   = useState("Admin");
  const [adminEmail,  setAdminEmail]  = useState("");
  const [notifications]               = useState(3);
  const [showNotif,   setShowNotif]   = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const isLoginPage = pathname.includes(ADMIN_SECRET_SLUG);
    if (isLoginPage) return;
    const token = localStorage.getItem("adminToken");
    if (!token) { router.push(`/admin/${ADMIN_SECRET_SLUG}`); return; }
    api.get("/seller/profile").then(r => {
      setAdminName(r.data.seller?.name || "Admin");
      setAdminEmail(r.data.seller?.email || "");
    }).catch(() => {});
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (item: typeof allNavItems[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const currentPage = allNavItems.find(n => isActive(n));

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("accessToken");
    router.push(`/admin/${ADMIN_SECRET_SLUG}`);
  };

  if (!mounted) return null;
  const isLoginPage = pathname.includes(ADMIN_SECRET_SLUG);
  if (isLoginPage) return <>{children}</>;

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside style={{
      width: mobile ? "270px" : sidebarOpen ? "240px" : "64px",
      background: "#fff",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      transition: "width .25s ease",
      overflow: "hidden",
      flexShrink: 0,
      borderRight: "1px solid #f0f0f0",
      position: mobile ? "relative" : "sticky",
      top: 0,
      zIndex: mobile ? "auto" : 10,
    }}>

      {/* Logo */}
      <div style={{ padding:"18px 14px", borderBottom:"1px solid #f5f5f5", display:"flex", alignItems:"center", justifyContent:"space-between", minHeight:"68px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px", overflow:"hidden" }}>
          <div style={{ width:"34px", height:"34px", borderRadius:"8px", background:BURG, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"16px", fontWeight:800, fontFamily:"Georgia,serif", flexShrink:0 }}>S</div>
          {(sidebarOpen||mobile) && (
            <div style={{ overflow:"hidden" }}>
              <div style={{ color:"#111", fontSize:"14px", fontWeight:700, letterSpacing:".02em", whiteSpace:"nowrap", fontFamily:"Georgia,serif" }}>Sanskriti</div>
              <div style={{ color:"#aaa", fontSize:"10px", marginTop:"1px", letterSpacing:".08em", textTransform:"uppercase" }}>Admin Panel</div>
            </div>
          )}
        </div>
        {!mobile && (
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background:"#f9f9f9", border:"1px solid #eee", borderRadius:"6px", width:"24px", height:"24px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#aaa", fontSize:"9px", flexShrink:0 }}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"10px 8px", overflowY:"auto", overflowX:"hidden" }}>
        {navGroups.map((group, gi) => (
          <div key={group.label} style={{ marginBottom:"4px" }}>
            {(sidebarOpen||mobile) && (
              <div style={{ fontSize:"9px", fontWeight:700, color:"#ccc", letterSpacing:".14em", textTransform:"uppercase", padding:"8px 8px 3px", marginTop:gi>0?"6px":0, fontFamily:"'Segoe UI',sans-serif" }}>
                {group.label}
              </div>
            )}
            {group.items.map(item => {
              const active = isActive(item);
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                  title={!sidebarOpen && !mobile ? item.label : undefined}
                  style={{
                    display:"flex", alignItems:"center", gap:"9px",
                    padding: sidebarOpen||mobile ? "8px 10px" : "8px",
                    justifyContent: sidebarOpen||mobile ? "flex-start" : "center",
                    borderRadius:"8px", textDecoration:"none", marginBottom:"1px",
                    background: active ? `rgba(155,0,32,.08)` : "transparent",
                    transition:"all .15s",
                  }}>
                  <span style={{ fontSize:"15px", flexShrink:0, opacity:active?1:.55 }}>{item.icon}</span>
                  {(sidebarOpen||mobile) && (
                    <span style={{ fontSize:"13px", fontWeight:active?600:400, color:active?BURG:"#555", whiteSpace:"nowrap" }}>
                      {item.label}
                    </span>
                  )}
                  {active && (sidebarOpen||mobile) && (
                    <div style={{ marginLeft:"auto", width:"5px", height:"5px", borderRadius:"50%", background:BURG, flexShrink:0 }} />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Profile */}
      <div style={{ padding:"10px 8px", borderTop:"1px solid #f5f5f5" }}>
        {(sidebarOpen||mobile) && (
          <div style={{ display:"flex", alignItems:"center", gap:"9px", padding:"9px 10px", borderRadius:"8px", background:"#fafafa", border:"1px solid #f0f0f0", marginBottom:"7px" }}>
            <div style={{ width:"30px", height:"30px", borderRadius:"50%", background:BURG, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"12px", fontWeight:700, flexShrink:0 }}>{adminName.charAt(0).toUpperCase()}</div>
            <div style={{ overflow:"hidden", flex:1 }}>
              <div style={{ fontSize:"12px", fontWeight:600, color:"#111", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{adminName}</div>
              <div style={{ fontSize:"10px", color:"#aaa", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{adminEmail}</div>
            </div>
          </div>
        )}
        <button onClick={handleLogout} title={!sidebarOpen&&!mobile?"Sign Out":undefined}
          style={{ width:"100%", padding:sidebarOpen||mobile?"8px 10px":"8px", borderRadius:"7px", background:`rgba(155,0,32,.06)`, border:`1px solid rgba(155,0,32,.15)`, color:BURG, fontSize:"12px", fontWeight:600, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:sidebarOpen||mobile?"flex-start":"center", gap:"7px" }}>
          <span style={{ fontSize:"14px" }}>🚪</span>{(sidebarOpen||mobile) && "Sign Out"}
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#f9f9f9", fontFamily:"'Segoe UI',sans-serif" }}>
      <div className="hide-mobile"><Sidebar /></div>

      {mobileOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:1000 }}>
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.4)", backdropFilter:"blur(4px)" }} onClick={() => setMobileOpen(false)} />
          <div style={{ position:"absolute", left:0, top:0, bottom:0, zIndex:1, animation:"slideRight .25s ease" }}><Sidebar mobile /></div>
        </div>
      )}

      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>

        {/* Top bar */}
        <header style={{ background:"#fff", borderBottom:"1px solid #f0f0f0", padding:"0 24px", height:"58px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50, boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>

          <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
            <button className="hide-desktop" onClick={() => setMobileOpen(true)} style={{ background:"none", border:"none", cursor:"pointer", padding:"5px", display:"flex", flexDirection:"column", gap:"4px" }}>
              {[0,1,2].map(i => <span key={i} style={{ display:"block", width:"18px", height:"2px", background:"#333", borderRadius:"1px" }} />)}
            </button>
            <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
              <span style={{ fontSize:"13px", color:"#bbb" }}>Admin</span>
              <span style={{ color:"#e5e5e5", fontSize:"13px" }}>/</span>
              <span style={{ fontSize:"14px", fontWeight:600, color:"#111" }}>{currentPage?.label || "Dashboard"}</span>
            </div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            {/* Live */}
            <div style={{ display:"flex", alignItems:"center", gap:"6px", padding:"4px 12px", borderRadius:"99px", background:"#f0fdf4", border:"1px solid #bbf7d0" }}>
              <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 5px #22c55e", animation:"pulse 2s infinite" }} />
              <span style={{ fontSize:"11px", color:"#15803d", fontWeight:600 }}>Live</span>
            </div>

            {/* Notifications */}
            <div ref={notifRef} style={{ position:"relative" }}>
              <button onClick={() => setShowNotif(!showNotif)} style={{ position:"relative", width:"34px", height:"34px", borderRadius:"8px", background:showNotif?"#f5f5f5":"#fff", border:"1px solid #eee", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:"15px" }}>
                🔔
                {notifications > 0 && <span style={{ position:"absolute", top:"4px", right:"4px", width:"13px", height:"13px", borderRadius:"50%", background:BURG, color:"#fff", fontSize:"8px", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #fff" }}>{notifications}</span>}
              </button>
              {showNotif && (
                <div style={{ position:"absolute", top:"calc(100% + 8px)", right:0, width:"300px", background:"#fff", border:"1px solid #f0f0f0", borderRadius:"12px", boxShadow:"0 8px 32px rgba(0,0,0,.1)", zIndex:200, overflow:"hidden" }}>
                  <div style={{ padding:"12px 16px", borderBottom:"1px solid #f5f5f5", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:"14px", fontWeight:600, color:"#111" }}>Notifications</span>
                    <span style={{ fontSize:"11px", color:BURG, fontWeight:600, cursor:"pointer" }}>Mark all read</span>
                  </div>
                  {[
                    { icon:"👥", title:"New seller registered",   sub:"Ananya Seller joined today",   time:"2h ago",  unread:true  },
                    { icon:"💸", title:"Payout request received", sub:"₹2,400 — Ananya Seller",       time:"5h ago",  unread:true  },
                    { icon:"📦", title:"New order placed",        sub:"SNK-2605-0004 — ₹9,440",       time:"1d ago",  unread:true  },
                    { icon:"🧾", title:"Invoice generated",       sub:"INV-2605-0001 — Rahul Sharma", time:"2d ago",  unread:false },
                  ].map((n, i) => (
                    <div key={i} style={{ display:"flex", gap:"10px", padding:"10px 14px", borderBottom:"1px solid #f9f9f9", background:n.unread?"#fff8f8":"#fff", cursor:"pointer" }}>
                      <div style={{ width:"32px", height:"32px", borderRadius:"8px", background:n.unread?`rgba(155,0,32,.08)`:"#f5f5f5", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", flexShrink:0 }}>{n.icon}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:"12px", fontWeight:n.unread?600:400, color:"#111" }}>{n.title}</div>
                        <div style={{ fontSize:"11px", color:"#888", marginTop:"1px" }}>{n.sub}</div>
                      </div>
                      <div style={{ fontSize:"10px", color:"#bbb", flexShrink:0 }}>{n.time}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Admin avatar */}
            <div style={{ display:"flex", alignItems:"center", gap:"7px", padding:"4px 10px", borderRadius:"8px", background:"#f9f9f9", border:"1px solid #eee", cursor:"pointer" }}>
              <div style={{ width:"26px", height:"26px", borderRadius:"50%", background:BURG, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"11px", fontWeight:700 }}>{adminName.charAt(0).toUpperCase()}</div>
              <span style={{ fontSize:"13px", fontWeight:500, color:"#333" }}>{adminName.split(" ")[0]}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div style={{ flex:1, padding:"24px", overflowY:"auto" }}>{children}</div>
      </div>

      <style>{`
        @media(max-width:768px){.hide-mobile{display:none!important}}
        @media(min-width:769px){.hide-desktop{display:none!important}}
        @keyframes pulse     {0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes slideRight{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes spin      {to{transform:rotate(360deg)}}
        @keyframes shimmer   {0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes scaleIn   {from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
        @keyframes fadeDown  {from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideDown {from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideLeft {from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
        nav::-webkit-scrollbar{width:3px}
        nav::-webkit-scrollbar-thumb{background:#eee;border-radius:2px}
        .skeleton{background:linear-gradient(90deg,#f0f0f0 0%,#f8f8f8 50%,#f0f0f0 100%);background-size:200% 100%;animation:shimmer 1.6s infinite;border-radius:8px}
      `}</style>
    </div>
  );
}
