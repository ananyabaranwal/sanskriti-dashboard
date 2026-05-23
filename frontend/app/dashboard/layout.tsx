"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

const navItems = [
  { label: "Dashboard", href: "/dashboard",          icon: "🏛️", exact: true  },
  { label: "Wallet",    href: "/dashboard/wallet",    icon: "💰", exact: false },
  { label: "Orders",    href: "/dashboard/orders",    icon: "📦", exact: false },
  { label: "Bills",     href: "/dashboard/bills",     icon: "🧾", exact: false },
  { label: "Videos",    href: "/dashboard/videos",    icon: "🎬", exact: false },
  { label: "Profile",   href: "/dashboard/profile",   icon: "👤", exact: false },
  { label: "Settings",  href: "/dashboard/settings",  icon: "⚙️", exact: false },
  { label: "Gallery", href: "/dashboard/gallery", icon: "🏺", exact: false },
];

const MOCK_NOTIFICATIONS = [
  { id: "1", icon: "📦", title: "Order SNK-2605-0004 delivered",        desc: "Rahul Sharma's order has been delivered",          time: "2 hours ago",   read: false },
  { id: "2", icon: "💰", title: "Wallet credited ₹500",                 desc: "Mock payment successful via Razorpay",             time: "5 hours ago",   read: false },
  { id: "3", icon: "🧾", title: "Invoice INV-2605-0001 generated",       desc: "GST invoice generated for order SNK-2605-0004",   time: "6 hours ago",   read: false },
  { id: "4", icon: "⚠️", title: "KYC verification pending",              desc: "Complete your KYC to unlock all seller features", time: "1 day ago",     read: true  },
  { id: "5", icon: "📦", title: "New order placed",                       desc: "Order SNK-2605-0003 received from Priya Mehta",   time: "2 days ago",    read: true  },
  { id: "6", icon: "💸", title: "Payout request received",               desc: "Your payout of ₹1,000 is under review",           time: "3 days ago",    read: true  },
  { id: "7", icon: "✅", title: "Profile updated",                        desc: "Your business details have been saved",           time: "4 days ago",    read: true  },
  { id: "8", icon: "🎬", title: "New training video added",              desc: "Photography Tips for Antique Listings is live",   time: "5 days ago",    read: true  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname    = usePathname();
  const router      = useRouter();
  const [seller, setSeller]           = useState<any>(null);
  const [walletBal, setWalletBal]     = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [mounted, setMounted]         = useState(false);
  const [showNotif, setShowNotif]     = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close notif dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("accessToken");
    if (!token) { router.push("/login"); return; }
    Promise.allSettled([
      api.get("/seller/profile"),
      api.get("/wallet/balance"),
    ]).then(([selRes, walRes]) => {
      if (selRes.status === "fulfilled") setSeller(selRes.value.data.seller);
      if (walRes.status === "fulfilled") {
        const d = walRes.value.data;
        setWalletBal(typeof d.balance === "number" ? d.balance : d.wallet?.balance ?? 0);
      }
    }).catch(() => { localStorage.removeItem("accessToken"); router.push("/login"); });
  }, []);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead    = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const isActive = (item: typeof navItems[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } finally {
      localStorage.removeItem("accessToken");
      router.push("/login");
    }
  };

  if (!mounted) return null;

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside style={{ width: mobile ? "100%" : sidebarOpen ? "260px" : "72px", background: "linear-gradient(180deg, #1A0F0A 0%, #2C1810 60%, #3D2B1F 100%)", height: mobile ? "100%" : "100vh", display: "flex", flexDirection: "column", transition: "width .25s ease", overflow: "hidden", flexShrink: 0, boxShadow: mobile ? "none" : "2px 0 20px rgba(0,0,0,.3)", position: mobile ? "relative" : "sticky", top: 0, zIndex: mobile ? "auto" : 10 }}>

      {/* Logo */}
      <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid rgba(201,168,76,.1)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", minHeight: "72px" }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px", overflow: "hidden" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "linear-gradient(135deg, #C9A84C, #8B6914)", display: "flex", alignItems: "center", justifyContent: "center", color: "#2C1810", fontSize: "17px", fontWeight: "700", fontFamily: "Georgia, serif", flexShrink: 0, boxShadow: "0 4px 12px rgba(201,168,76,.3)" }}>S</div>
          {(sidebarOpen || mobile) && (
            <div style={{ overflow: "hidden" }}>
              <div style={{ color: "#C9A84C", fontSize: "14px", fontWeight: "700", fontFamily: "Georgia, serif", letterSpacing: ".06em", whiteSpace: "nowrap" }}>SANSKRITI</div>
              <div style={{ color: "#A08060", fontSize: "9px", letterSpacing: ".18em", marginTop: "1px" }}>THE ANTIQUE</div>
            </div>
          )}
        </Link>
        {!mobile && (
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.15)", borderRadius: "6px", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#C9A84C", fontSize: "11px", flexShrink: 0 }}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto", overflowX: "hidden" }}>
        {(sidebarOpen || mobile) && <div style={{ fontSize: "10px", fontWeight: 600, color: "rgba(201,168,76,.35)", letterSpacing: ".12em", textTransform: "uppercase", padding: "8px 10px 6px", marginBottom: "4px" }}>Navigation</div>}
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} title={!sidebarOpen && !mobile ? item.label : undefined} style={{ display: "flex", alignItems: "center", gap: "12px", padding: sidebarOpen || mobile ? "11px 12px" : "11px", justifyContent: sidebarOpen || mobile ? "flex-start" : "center", borderRadius: "10px", textDecoration: "none", marginBottom: "3px", background: active ? "rgba(201,168,76,.14)" : "transparent", borderLeft: active ? "3px solid #C9A84C" : "3px solid transparent", transition: "all .18s", overflow: "hidden" }}>
              <span style={{ fontSize: "18px", flexShrink: 0, filter: active ? "none" : "brightness(.75)" }}>{item.icon}</span>
              {(sidebarOpen || mobile) && <span style={{ fontSize: "14px", fontWeight: active ? 600 : 400, color: active ? "#C9A84C" : "rgba(245,230,200,.6)", whiteSpace: "nowrap" }}>{item.label}</span>}
              {active && (sidebarOpen || mobile) && <div style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", background: "#C9A84C", flexShrink: 0 }} />}
            </Link>
          );
        })}
      </nav>

      {/* KYC warning */}
      {seller?.kycStatus !== "approved" && (sidebarOpen || mobile) && (
        <div style={{ margin: "0 10px 12px", padding: "12px", borderRadius: "10px", background: "rgba(234,179,8,.08)", border: "1px solid rgba(234,179,8,.2)" }}>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "#fbbf24", marginBottom: "4px" }}>⚠️ KYC Pending</div>
          <p style={{ fontSize: "11px", color: "rgba(251,191,36,.6)", lineHeight: "1.4", marginBottom: "8px" }}>Complete verification to unlock all features</p>
          <Link href="/dashboard/kyc" onClick={() => setMobileOpen(false)} style={{ fontSize: "11px", fontWeight: 600, color: "#fbbf24", textDecoration: "none", padding: "4px 10px", borderRadius: "6px", background: "rgba(234,179,8,.12)", border: "1px solid rgba(234,179,8,.25)", display: "inline-block" }}>Complete KYC →</Link>
        </div>
      )}

      {/* Seller info + logout */}
      <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(201,168,76,.1)" }}>
        {(sidebarOpen || mobile) ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #C9A84C, #8B6914)", display: "flex", alignItems: "center", justifyContent: "center", color: "#2C1810", fontSize: "14px", fontWeight: 700, flexShrink: 0 }}>{seller?.name?.charAt(0).toUpperCase() || "S"}</div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#F5E6C8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{seller?.name || "Loading..."}</div>
              <div style={{ fontSize: "11px", color: "rgba(245,230,200,.4)" }}>Seller Account</div>
            </div>
          </div>
        ) : (
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #C9A84C, #8B6914)", display: "flex", alignItems: "center", justifyContent: "center", color: "#2C1810", fontSize: "14px", fontWeight: 700, margin: "0 auto 10px" }}>{seller?.name?.charAt(0).toUpperCase() || "S"}</div>
        )}
        <button onClick={handleLogout} title={!sidebarOpen && !mobile ? "Sign Out" : undefined} style={{ width: "100%", padding: sidebarOpen || mobile ? "9px 12px" : "9px", borderRadius: "8px", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", color: "#f87171", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: sidebarOpen || mobile ? "flex-start" : "center", gap: "8px" }}>
          <span>🚪</span>{(sidebarOpen || mobile) && "Sign Out"}
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5EDE0", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Desktop sidebar */}
      <div className="hide-mobile"><Sidebar /></div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)" }} onClick={() => setMobileOpen(false)} />
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "280px", zIndex: 1 }}><Sidebar mobile /></div>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Header */}
        <header style={{ background: "rgba(251,247,240,.95)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderBottom: "1px solid #E8D5A3", padding: "0 24px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 12px rgba(61,43,31,.06)" }}>

          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <button className="hide-desktop" onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
              {[0,1,2].map(i => <span key={i} style={{ display: "block", width: "20px", height: "2px", background: "#2C1810", borderRadius: "1px" }} />)}
            </button>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "#2C1810", fontFamily: "Georgia, serif", lineHeight: 1.2 }}>{navItems.find(n => isActive(n))?.label || "Dashboard"}</div>
              <div style={{ fontSize: "11px", color: "#A08060", marginTop: "1px" }}>{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</div>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

            {/* Notification bell */}
            <div ref={notifRef} style={{ position: "relative" }}>
              <button onClick={() => setShowNotif(!showNotif)} style={{ position: "relative", width: "38px", height: "38px", borderRadius: "10px", background: showNotif ? "#F5E6C8" : "#FBF7F0", border: `1px solid ${showNotif ? "#C9A84C" : "#E8D5A3"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "17px", transition: "all .2s" }}>
                🔔
                {unreadCount > 0 && (
                  <span style={{ position: "absolute", top: "5px", right: "5px", width: "16px", height: "16px", borderRadius: "50%", background: "#EF4444", color: "#fff", fontSize: "9px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #FBF7F0" }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              {showNotif && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: "360px", background: "#FFFDF9", border: "1px solid #E8D5A3", borderRadius: "16px", boxShadow: "0 12px 40px rgba(61,43,31,.15)", zIndex: 200, overflow: "hidden", animation: "slideDown .2s ease" }}>

                  {/* Dropdown header */}
                  <div style={{ padding: "14px 18px", borderBottom: "1px solid #F0E4C0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "15px", fontWeight: 600, color: "#2C1810", fontFamily: "Georgia, serif" }}>Notifications</div>
                      {unreadCount > 0 && <div style={{ fontSize: "11px", color: "#A08060", marginTop: "1px" }}>{unreadCount} unread</div>}
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} style={{ fontSize: "12px", color: "#8B6914", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>Mark all read</button>
                    )}
                  </div>

                  {/* Notification list */}
                  <div style={{ maxHeight: "380px", overflowY: "auto" }}>
                    {notifications.slice(0, 10).map((n, i) => (
                      <div key={n.id} onClick={() => markRead(n.id)} style={{ display: "flex", gap: "12px", padding: "12px 18px", borderBottom: i < notifications.length - 1 ? "1px solid #F5EDE0" : "none", background: n.read ? "#FFFDF9" : "rgba(201,168,76,.04)", cursor: "pointer", transition: "background .15s" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: n.read ? "#F5EDE0" : "rgba(201,168,76,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>{n.icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "13px", fontWeight: n.read ? 400 : 600, color: "#2C1810", lineHeight: 1.3, marginBottom: "2px" }}>{n.title}</div>
                          <div style={{ fontSize: "11px", color: "#A08060", lineHeight: 1.4, marginBottom: "3px" }}>{n.desc}</div>
                          <div style={{ fontSize: "10px", color: "#C4A882" }}>{n.time}</div>
                        </div>
                        {!n.read && <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#C9A84C", flexShrink: 0, marginTop: "4px" }} />}
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div style={{ padding: "12px 18px", borderTop: "1px solid #F0E4C0", textAlign: "center" }}>
                    <Link href="/dashboard/settings" onClick={() => setShowNotif(false)} style={{ fontSize: "12px", color: "#8B6914", fontWeight: 600, textDecoration: "none" }}>Manage notification settings →</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Wallet quick view */}
            <Link href="/dashboard/wallet" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 14px", borderRadius: "10px", background: "linear-gradient(135deg, rgba(201,168,76,.12), rgba(139,105,20,.08))", border: "1px solid rgba(201,168,76,.25)", textDecoration: "none" }}>
              <span style={{ fontSize: "14px" }}>💰</span>
              <div>
                <div style={{ fontSize: "10px", color: "#A08060", lineHeight: 1 }}>Wallet</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#2C1810", lineHeight: 1.2 }}>₹{walletBal.toLocaleString("en-IN")}</div>
              </div>
            </Link>

            {/* Avatar */}
            <Link href="/dashboard/profile" style={{ width: "38px", height: "38px", borderRadius: "50%", background: "linear-gradient(135deg, #C9A84C, #8B6914)", display: "flex", alignItems: "center", justifyContent: "center", color: "#2C1810", fontSize: "15px", fontWeight: 700, boxShadow: "0 2px 8px rgba(201,168,76,.25)", textDecoration: "none" }}>
              {seller?.name?.charAt(0).toUpperCase() || "S"}
            </Link>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, padding: "28px 24px", overflowY: "auto" }}>{children}</div>
      </div>

      <style>{`
        @media (max-width: 768px) { .hide-mobile { display: none !important; } }
        @media (min-width: 769px) { .hide-desktop { display: none !important; } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
