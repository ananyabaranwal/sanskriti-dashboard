"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

const ADMIN_SECRET_SLUG = "sanskriti-admin-panel";

const navGroups = [
  {
    label: "Overview",
    items: [
      { label:"Dashboard",  href:"/admin",                icon:"📊", exact:true  },
    ]
  },
  {
    label: "Commerce",
    items: [
      { label:"Sellers",    href:"/admin/sellers",         icon:"👥", exact:false },
      { label:"Orders",     href:"/admin/orders",          icon:"📦", exact:false },
      { label:"Payouts",    href:"/admin/payouts",         icon:"💸", exact:false },
      { label:"Gallery",    href:"/admin/gallery",         icon:"🏺", exact:false },
      { label:"Returns",    href:"/admin/returns",         icon:"↩️", exact:false },
    ]
  },
  {
    label: "Platform",
    items: [
      { label:"Content",    href:"/admin/content",         icon:"🎬", exact:false },
      { label:"Settings",   href:"/admin/settings",        icon:"⚙️", exact:false },
    ]
  }
];

const allNavItems = navGroups.flatMap(g => g.items);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const [mounted, setMounted]         = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [adminName, setAdminName]     = useState("Admin");
  const [adminEmail, setAdminEmail]   = useState("");
  const [notifications]               = useState(3);
  const [showNotif, setShowNotif]     = useState(false);
  const notifRef                      = useRef<HTMLDivElement>(null);

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
    <aside style={{ width:mobile?"280px":sidebarOpen?"260px":"72px", background:"#111827", height:"100vh", display:"flex", flexDirection:"column", transition:"width .25s ease", overflow:"hidden", flexShrink:0, boxShadow:mobile?"none":"2px 0 0 rgba(255,255,255,.06)", position:mobile?"relative":"sticky", top:0, zIndex:mobile?"auto":10 }}>

      {/* Logo */}
      <div style={{ padding:"20px 16px", borderBottom:"1px solid rgba(255,255,255,.07)", display:"flex", alignItems:"center", justifyContent:"space-between", minHeight:"72px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", overflow:"hidden" }}>
          <div style={{ width:"36px", height:"36px", borderRadius:"9px", background:"linear-gradient(135deg,#C9A84C,#8B6914)", display:"flex", alignItems:"center", justifyContent:"center", color:"#111827", fontSize:"17px", fontWeight:800, fontFamily:"Georgia,serif", flexShrink:0 }}>S</div>
          {(sidebarOpen||mobile) && (
            <div style={{ overflow:"hidden" }}>
              <div style={{ color:"#fff", fontSize:"14px", fontWeight:700, letterSpacing:".02em", whiteSpace:"nowrap" }}>Sanskriti Admin</div>
              <div style={{ color:"rgba(255,255,255,.35)", fontSize:"11px", marginTop:"1px" }}>Management Console</div>
            </div>
          )}
        </div>
        {!mobile && (
          <button onClick={()=>setSidebarOpen(!sidebarOpen)} style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", borderRadius:"6px", width:"26px", height:"26px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"rgba(255,255,255,.5)", fontSize:"10px", flexShrink:0 }}>
            {sidebarOpen?"◀":"▶"}
          </button>
        )}
      </div>

      {/* Nav groups */}
      <nav style={{ flex:1, padding:"12px 8px", overflowY:"auto", overflowX:"hidden" }}>
        {navGroups.map((group, gi) => (
          <div key={group.label} style={{ marginBottom:"6px" }}>
            {(sidebarOpen||mobile) && (
              <div style={{ fontSize:"10px", fontWeight:700, color:"rgba(255,255,255,.25)", letterSpacing:".12em", textTransform:"uppercase", padding:"8px 10px 4px", marginTop:gi>0?"8px":0 }}>
                {group.label}
              </div>
            )}
            {group.items.map(item => {
              const active = isActive(item);
              return (
                <Link key={item.href} href={item.href} onClick={()=>setMobileOpen(false)} title={!sidebarOpen&&!mobile?item.label:undefined} style={{ display:"flex", alignItems:"center", gap:"10px", padding:sidebarOpen||mobile?"9px 12px":"9px", justifyContent:sidebarOpen||mobile?"flex-start":"center", borderRadius:"8px", textDecoration:"none", marginBottom:"2px", background:active?"rgba(201,168,76,.15)":"transparent", transition:"all .15s", overflow:"hidden", position:"relative" }}>
                  {active && <div style={{ position:"absolute", left:0, top:"25%", bottom:"25%", width:"3px", borderRadius:"0 2px 2px 0", background:"#C9A84C" }}/>}
                  <span style={{ fontSize:"16px", flexShrink:0, opacity:active?1:.6 }}>{item.icon}</span>
                  {(sidebarOpen||mobile) && <span style={{ fontSize:"13px", fontWeight:active?600:400, color:active?"#C9A84C":"rgba(255,255,255,.65)", whiteSpace:"nowrap" }}>{item.label}</span>}
                  {active&&(sidebarOpen||mobile) && <div style={{ marginLeft:"auto", width:"5px", height:"5px", borderRadius:"50%", background:"#C9A84C", flexShrink:0 }}/>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Admin profile */}
      <div style={{ padding:"12px 8px", borderTop:"1px solid rgba(255,255,255,.07)" }}>
        {(sidebarOpen||mobile) && (
          <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 12px", borderRadius:"8px", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.07)", marginBottom:"8px" }}>
            <div style={{ width:"32px", height:"32px", borderRadius:"50%", background:"linear-gradient(135deg,#C9A84C,#8B6914)", display:"flex", alignItems:"center", justifyContent:"center", color:"#111827", fontSize:"13px", fontWeight:700, flexShrink:0 }}>{adminName.charAt(0).toUpperCase()}</div>
            <div style={{ overflow:"hidden", flex:1 }}>
              <div style={{ fontSize:"12px", fontWeight:600, color:"#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{adminName}</div>
              <div style={{ fontSize:"10px", color:"rgba(255,255,255,.35)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{adminEmail}</div>
            </div>
          </div>
        )}
        <button onClick={handleLogout} title={!sidebarOpen&&!mobile?"Sign Out":undefined} style={{ width:"100%", padding:sidebarOpen||mobile?"8px 12px":"8px", borderRadius:"7px", background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.2)", color:"#f87171", fontSize:"12px", fontWeight:600, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:sidebarOpen||mobile?"flex-start":"center", gap:"7px", transition:"all .2s" }}>
          <span>🚪</span>{(sidebarOpen||mobile)&&"Sign Out"}
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#F8F7F4", fontFamily:"'Segoe UI',sans-serif" }}>
      <div className="hide-mobile"><Sidebar /></div>
      {mobileOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:1000 }}>
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.7)", backdropFilter:"blur(4px)" }} onClick={()=>setMobileOpen(false)}/>
          <div style={{ position:"absolute", left:0, top:0, bottom:0, zIndex:1, animation:"slideRight .25s ease" }}><Sidebar mobile/></div>
        </div>
      )}

      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>

        {/* Top bar */}
        <header style={{ background:"#fff", borderBottom:"1px solid #e5e7eb", padding:"0 24px", height:"60px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50, boxShadow:"0 1px 3px rgba(0,0,0,.06)" }}>

          <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
            <button className="hide-desktop" onClick={()=>setMobileOpen(true)} style={{ background:"none", border:"none", cursor:"pointer", padding:"5px", display:"flex", flexDirection:"column", gap:"4px" }}>
              {[0,1,2].map(i=><span key={i} style={{ display:"block", width:"18px", height:"2px", background:"#374151", borderRadius:"1px" }}/>)}
            </button>
            {/* Breadcrumb */}
            <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
              <span style={{ fontSize:"13px", color:"#9ca3af" }}>Admin</span>
              <span style={{ color:"#d1d5db", fontSize:"13px" }}>/</span>
              <span style={{ fontSize:"14px", fontWeight:600, color:"#111827" }}>{currentPage?.label||"Dashboard"}</span>
            </div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            {/* Live status */}
            <div style={{ display:"flex", alignItems:"center", gap:"6px", padding:"5px 12px", borderRadius:"99px", background:"#f0fdf4", border:"1px solid #bbf7d0" }}>
              <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 6px #22c55e", animation:"pulse 2s infinite" }}/>
              <span style={{ fontSize:"11px", color:"#15803d", fontWeight:600 }}>Live</span>
            </div>

            {/* Notifications */}
            <div ref={notifRef} style={{ position:"relative" }}>
              <button onClick={()=>setShowNotif(!showNotif)} style={{ position:"relative", width:"36px", height:"36px", borderRadius:"9px", background:showNotif?"#f3f4f6":"#fff", border:"1px solid #e5e7eb", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:"16px", transition:"all .2s" }}>
                🔔
                {notifications>0&&<span style={{ position:"absolute", top:"4px", right:"4px", width:"14px", height:"14px", borderRadius:"50%", background:"#ef4444", color:"#fff", fontSize:"9px", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid #fff" }}>{notifications}</span>}
              </button>
              {showNotif && (
                <div style={{ position:"absolute", top:"calc(100% + 8px)", right:0, width:"320px", background:"#fff", border:"1px solid #e5e7eb", borderRadius:"12px", boxShadow:"0 10px 40px rgba(0,0,0,.1)", zIndex:200, overflow:"hidden", animation:"fadeDown .2s ease" }}>
                  <div style={{ padding:"13px 16px", borderBottom:"1px solid #f3f4f6", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:"14px", fontWeight:600, color:"#111827" }}>Notifications</span>
                    <span style={{ fontSize:"11px", color:"#C9A84C", fontWeight:600, cursor:"pointer" }}>Mark all read</span>
                  </div>
                  {[
                    { icon:"👥", title:"New seller registered",        sub:"Ananya Seller joined today",           time:"2h ago",  unread:true  },
                    { icon:"💸", title:"Payout request received",      sub:"₹2,400 — Ananya Seller",               time:"5h ago",  unread:true  },
                    { icon:"📦", title:"New order placed",             sub:"SNK-2605-0004 — ₹9,440",               time:"1d ago",  unread:true  },
                    { icon:"🧾", title:"Invoice generated",            sub:"INV-2605-0001 — Rahul Sharma",         time:"2d ago",  unread:false },
                  ].map((n,i)=>(
                    <div key={i} style={{ display:"flex", gap:"12px", padding:"11px 16px", borderBottom:"1px solid #f9fafb", background:n.unread?"#fffbeb":"#fff", cursor:"pointer", transition:"background .15s" }}>
                      <div style={{ width:"34px", height:"34px", borderRadius:"8px", background:n.unread?"rgba(201,168,76,.1)":"#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px", flexShrink:0 }}>{n.icon}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:"13px", fontWeight:n.unread?600:400, color:"#111827" }}>{n.title}</div>
                        <div style={{ fontSize:"11px", color:"#6b7280", marginTop:"1px" }}>{n.sub}</div>
                      </div>
                      <div style={{ fontSize:"10px", color:"#9ca3af", flexShrink:0 }}>{n.time}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Admin avatar */}
            <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"5px 10px", borderRadius:"9px", background:"#f9fafb", border:"1px solid #e5e7eb", cursor:"pointer" }}>
              <div style={{ width:"28px", height:"28px", borderRadius:"50%", background:"linear-gradient(135deg,#C9A84C,#8B6914)", display:"flex", alignItems:"center", justifyContent:"center", color:"#111827", fontSize:"12px", fontWeight:700 }}>{adminName.charAt(0).toUpperCase()}</div>
              <span style={{ fontSize:"13px", fontWeight:500, color:"#374151" }}>{adminName.split(" ")[0]}</span>
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
        @keyframes fadeDown  {from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideDown {from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideRight{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
        @keyframes scaleIn   {from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
        @keyframes slideLeft {from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
        @keyframes spin      {to{transform:rotate(360deg)}}
        @keyframes shimmer   {0%{background-position:-200% 0}100%{background-position:200% 0}}
        .skeleton{background:linear-gradient(90deg,#e5e7eb 0%,#f3f4f6 50%,#e5e7eb 100%);background-size:200% 100%;animation:shimmer 1.6s infinite;border-radius:8px}
      `}</style>
    </div>
  );
}
