"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

const BURG      = "#9B0020";
const BURG_DARK = "#7A0018";

// ── Deep-red line icons (no extra npm install needed) ─────────
function IconDashboard({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="2.5" width="6.5" height="6.5" rx="1.4" /><rect x="11" y="2.5" width="6.5" height="6.5" rx="1.4" />
      <rect x="2.5" y="11" width="6.5" height="6.5" rx="1.4" /><rect x="11" y="11" width="6.5" height="6.5" rx="1.4" />
    </svg>
  );
}
function IconAnalytics({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="17" x2="17" y2="17" />
      <rect x="4.3" y="11" width="3" height="6" rx="0.8" fill="currentColor" stroke="none" />
      <rect x="8.5" y="7" width="3" height="10" rx="0.8" fill="currentColor" stroke="none" />
      <rect x="12.7" y="3" width="3" height="14" rx="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconWallet({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="5.5" width="15" height="11" rx="2" />
      <path d="M2.5 8.5h15" />
      <circle cx="14" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconOrders({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6.5 10 3l7 3.5v7L10 17l-7-3.5z" /><path d="M3 6.5 10 10l7-3.5" /><path d="M10 10v7" />
    </svg>
  );
}
function IconCustomers({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="6.5" r="2.5" /><path d="M2.5 16c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5" />
      <circle cx="14" cy="7" r="2" /><path d="M12.5 11.2c2.1.3 3.5 1.7 3.5 3.8" />
    </svg>
  );
}
function IconBills({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 2.5h10v14l-1.7-1.2-1.6 1.2-1.7-1.2-1.6 1.2-1.7-1.2-1.7 1.2z" />
      <line x1="7" y1="6.5" x2="13" y2="6.5" /><line x1="7" y1="9.5" x2="13" y2="9.5" />
    </svg>
  );
}
function IconGallery({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
      <circle cx="7" cy="8" r="1.4" fill="currentColor" stroke="none" />
      <path d="M3.5 14.5l4-4 3 3 2.5-3 3.5 4.2" />
    </svg>
  );
}
function IconVideos({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="5.5" width="15" height="11" rx="2" />
      <path d="M2.5 5.5l2-3h2.3l-1.6 3" /><path d="M7.8 5.5l2-3h2.3l-1.6 3" /><path d="M13.1 5.5l2-3h1.4l-1.2 3" />
      <path d="M8.3 9.3l4 2.4-4 2.4z" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconProfile({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="6.5" r="3.2" /><path d="M3.5 17c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
    </svg>
  );
}
function IconSettings({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="5" x2="17" y2="5" /><line x1="3" y1="10" x2="17" y2="10" /><line x1="3" y1="15" x2="17" y2="15" />
      <circle cx="7" cy="5" r="1.7" fill="currentColor" stroke="none" /><circle cx="13" cy="10" r="1.7" fill="currentColor" stroke="none" /><circle cx="8" cy="15" r="1.7" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconAlertTriangle({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3.5 17.5 16h-15z" /><line x1="10" y1="8" x2="10" y2="11.5" /><circle cx="10" cy="14" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconLogOut({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H4.5a1.5 1.5 0 0 0-1.5 1.5v11A1.5 1.5 0 0 0 4.5 17H8" />
      <line x1="9" y1="10" x2="17" y2="10" /><path d="M13.5 6.5 17 10l-3.5 3.5" />
    </svg>
  );
}

const navItems = [
  { label: "Dashboard",  href: "/dashboard",            Icon: IconDashboard, exact: true  },
  { label: "Analytics",  href: "/dashboard/analytics",  Icon: IconAnalytics, exact: false },
  { label: "Wallet",     href: "/dashboard/wallet",     Icon: IconWallet,    exact: false },
  { label: "Orders",     href: "/dashboard/orders",     Icon: IconOrders,    exact: false },
  { label: "Customers",  href: "/dashboard/customers",  Icon: IconCustomers, exact: false },
  { label: "Bills",      href: "/dashboard/bills",      Icon: IconBills,     exact: false },
  { label: "Gallery",    href: "/dashboard/gallery",    Icon: IconGallery,   exact: false },
  { label: "Videos",     href: "/dashboard/videos",     Icon: IconVideos,    exact: false },
  { label: "Profile",    href: "/dashboard/profile",    Icon: IconProfile,   exact: false },
  { label: "Settings",   href: "/dashboard/settings",   Icon: IconSettings,  exact: false },
];

type NotifItem = {
  _id: string;
  icon: string;
  title: string;
  desc: string;
  link?: string | null;
  read: boolean;
  createdAt: string;
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins   = Math.floor(diffMs / 60000);
  if (mins < 1)   return "Just now";
  if (mins < 60)  return `${mins} min${mins > 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7)   return `${days} day${days > 1 ? "s" : ""} ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname    = usePathname();
  const router      = useRouter();
  const [seller, setSeller]           = useState<any>(null);
  const [walletBal, setWalletBal]     = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [mounted, setMounted]         = useState(false);
  const [showNotif, setShowNotif]     = useState(false);
  const [notifications, setNotifications] = useState<NotifItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = () => {
    api.get("/notifications?limit=10")
      .then(r => {
        setNotifications(r.data.notifications ?? []);
        setUnreadCount(r.data.unread ?? 0);
      })
      .catch(() => {});
  };

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
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    try { await api.patch("/notifications/read-all"); } catch {}
  };

  const markRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    try { await api.patch(`/notifications/${id}/read`); } catch {}
  };

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
    <aside style={{ width: mobile ? "100%" : sidebarOpen ? "260px" : "72px", background: "#FFFFFF", height: mobile ? "100%" : "100vh", display: "flex", flexDirection: "column", transition: "width .25s ease", overflow: "hidden", flexShrink: 0, borderRight: mobile ? "none" : "1px solid #E5E7EB", boxShadow: mobile ? "none" : "2px 0 16px rgba(0,0,0,.04)", position: mobile ? "relative" : "sticky", top: 0, zIndex: mobile ? "auto" : 10 }}>

      {/* Logo */}
      <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", minHeight: "72px" }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px", overflow: "hidden" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: BURG, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "17px", fontWeight: "700", fontFamily: "Georgia, serif", flexShrink: 0, boxShadow: "0 4px 12px rgba(155,0,32,.25)" }}>S</div>
          {(sidebarOpen || mobile) && (
            <div style={{ overflow: "hidden" }}>
              <div style={{ color: BURG, fontSize: "14px", fontWeight: "700", fontFamily: "Georgia, serif", letterSpacing: ".06em", whiteSpace: "nowrap" }}>SANSKRITI</div>
              <div style={{ color: "#9CA3AF", fontSize: "9px", letterSpacing: ".18em", marginTop: "1px" }}>THE ANTIQUE</div>
            </div>
          )}
        </Link>
        {!mobile && (
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "6px", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6B7280", fontSize: "11px", flexShrink: 0 }}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto", overflowX: "hidden" }}>
        {(sidebarOpen || mobile) && <div style={{ fontSize: "10px", fontWeight: 600, color: "#9CA3AF", letterSpacing: ".12em", textTransform: "uppercase", padding: "8px 10px 6px", marginBottom: "4px" }}>Navigation</div>}
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} title={!sidebarOpen && !mobile ? item.label : undefined} style={{ display: "flex", alignItems: "center", gap: "12px", padding: sidebarOpen || mobile ? "11px 12px" : "11px", justifyContent: sidebarOpen || mobile ? "flex-start" : "center", borderRadius: "10px", textDecoration: "none", marginBottom: "3px", background: active ? "rgba(155,0,32,.07)" : "transparent", borderLeft: active ? `3px solid ${BURG}` : "3px solid transparent", transition: "all .18s", overflow: "hidden" }}>
              <span style={{ color: BURG, opacity: active ? 1 : 0.62, flexShrink: 0, display: "flex" }}><item.Icon size={18} /></span>
              {(sidebarOpen || mobile) && <span style={{ fontSize: "14px", fontWeight: active ? 600 : 400, color: active ? BURG : "#374151", whiteSpace: "nowrap" }}>{item.label}</span>}
              {active && (sidebarOpen || mobile) && <div style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", background: BURG, flexShrink: 0 }} />}
            </Link>
          );
        })}
      </nav>

      {/* KYC warning */}
      {seller?.kycStatus !== "approved" && (sidebarOpen || mobile) && (
        <div style={{ margin: "0 10px 12px", padding: "12px", borderRadius: "10px", background: "rgba(155,0,32,.05)", border: "1px solid rgba(155,0,32,.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 600, color: BURG, marginBottom: "4px" }}><IconAlertTriangle size={14} /> KYC Pending</div>
          <p style={{ fontSize: "11px", color: "#6B7280", lineHeight: "1.4", marginBottom: "8px" }}>Complete verification to unlock all features</p>
          <Link href="/dashboard/kyc" onClick={() => setMobileOpen(false)} style={{ fontSize: "11px", fontWeight: 600, color: "#fff", textDecoration: "none", padding: "4px 10px", borderRadius: "6px", background: BURG, display: "inline-block" }}>Complete KYC →</Link>
        </div>
      )}

      {/* Seller info + logout */}
      <div style={{ padding: "12px 10px", borderTop: "1px solid #F3F4F6" }}>
        {(sidebarOpen || mobile) ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 4px", marginBottom: "8px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: BURG, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "14px", fontWeight: 700, flexShrink: 0 }}>
              {seller?.name?.charAt(0).toUpperCase() || "S"}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#1F2937", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{seller?.name || "Seller"}</div>
              <div style={{ fontSize: "11px", color: "#6B7280" }}>Seller Account</div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: BURG, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "14px", fontWeight: 700 }}>
              {seller?.name?.charAt(0).toUpperCase() || "S"}
            </div>
          </div>
        )}
        <button onClick={handleLogout} title={!sidebarOpen && !mobile ? "Sign Out" : undefined} style={{ width: "100%", padding: sidebarOpen || mobile ? "9px 12px" : "9px", borderRadius: "8px", background: "#FFF1F2", border: "1px solid #FEE2E2", color: BURG, fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: sidebarOpen || mobile ? "flex-start" : "center", gap: "8px" }}>
          <IconLogOut size={15} />{(sidebarOpen || mobile) && "Sign Out"}
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F9FAFB", fontFamily: "'Segoe UI', sans-serif" }}>

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
        <header style={{ background: "rgba(255,255,255,.95)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderBottom: "1px solid #E5E7EB", padding: "0 24px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 12px rgba(0,0,0,.04)" }}>

          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <button className="hide-desktop" onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", display: "flex", flexDirection: "column", gap: "4px" }}>
              {[0,1,2].map(i => <span key={i} style={{ display: "block", width: "20px", height: "2px", background: "#1F2937", borderRadius: "1px" }} />)}
            </button>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "#1F2937", fontFamily: "Georgia, serif", lineHeight: 1.2 }}>{navItems.find(n => isActive(n))?.label || "Dashboard"}</div>
              <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "1px" }}>{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</div>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

            {/* Notification bell */}
            <div ref={notifRef} style={{ position: "relative" }}>
              <button onClick={() => { setShowNotif(!showNotif); if (!showNotif) fetchNotifications(); }} style={{ position: "relative", width: "38px", height: "38px", borderRadius: "10px", background: showNotif ? "rgba(155,0,32,.08)" : "#F9FAFB", border: `1px solid ${showNotif ? BURG : "#E5E7EB"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "17px", transition: "all .2s" }}>
                🔔
                {unreadCount > 0 && (
                  <span style={{ position: "absolute", top: "5px", right: "5px", width: "16px", height: "16px", borderRadius: "50%", background: BURG, color: "#fff", fontSize: "9px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              {showNotif && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: "360px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px", boxShadow: "0 12px 40px rgba(0,0,0,.12)", zIndex: 200, overflow: "hidden", animation: "slideDown .2s ease" }}>

                  {/* Dropdown header */}
                  <div style={{ padding: "14px 18px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "15px", fontWeight: 600, color: "#1F2937", fontFamily: "Georgia, serif" }}>Notifications</div>
                      {unreadCount > 0 && <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "1px" }}>{unreadCount} unread</div>}
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} style={{ fontSize: "12px", color: BURG, fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>Mark all read</button>
                    )}
                  </div>

                  {/* Notification list */}
                  <div style={{ maxHeight: "380px", overflowY: "auto" }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: "32px 18px", textAlign: "center" }}>
                        <div style={{ fontSize: "28px", marginBottom: "8px" }}>🔔</div>
                        <p style={{ fontSize: "12px", color: "#6B7280" }}>No notifications yet</p>
                      </div>
                    ) : notifications.map((n, i) => {
                      const row = (
                        <div onClick={() => !n.read && markRead(n._id)} style={{ display: "flex", gap: "12px", padding: "12px 18px", borderBottom: i < notifications.length - 1 ? "1px solid #F3F4F6" : "none", background: n.read ? "#fff" : "rgba(155,0,32,.04)", cursor: "pointer", transition: "background .15s" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: n.read ? "#F3F4F6" : "rgba(155,0,32,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>{n.icon}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "13px", fontWeight: n.read ? 400 : 600, color: "#1F2937", lineHeight: 1.3, marginBottom: "2px" }}>{n.title}</div>
                            <div style={{ fontSize: "11px", color: "#6B7280", lineHeight: 1.4, marginBottom: "3px" }}>{n.desc}</div>
                            <div style={{ fontSize: "10px", color: "#9CA3AF" }}>{timeAgo(n.createdAt)}</div>
                          </div>
                          {!n.read && <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: BURG, flexShrink: 0, marginTop: "4px" }} />}
                        </div>
                      );
                      return n.link ? (
                        <Link key={n._id} href={n.link} onClick={() => { setShowNotif(false); if (!n.read) markRead(n._id); }} style={{ textDecoration: "none", display: "block" }}>{row}</Link>
                      ) : <div key={n._id}>{row}</div>;
                    })}
                  </div>

                  {/* Footer */}
                  <div style={{ padding: "12px 18px", borderTop: "1px solid #F3F4F6", textAlign: "center" }}>
                    <Link href="/dashboard/notifications" onClick={() => setShowNotif(false)} style={{ fontSize: "12px", color: BURG, fontWeight: 600, textDecoration: "none" }}>View all notifications →</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Wallet quick view */}
            <Link href="/dashboard/wallet" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 14px", borderRadius: "10px", background: "rgba(155,0,32,.06)", border: "1px solid rgba(155,0,32,.18)", textDecoration: "none" }}>
              <span style={{ fontSize: "14px" }}>💰</span>
              <div>
                <div style={{ fontSize: "10px", color: "#6B7280", lineHeight: 1 }}>Wallet</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#1F2937", lineHeight: 1.2 }}>₹{walletBal.toLocaleString("en-IN")}</div>
              </div>
            </Link>

            {/* Avatar */}
            <Link href="/dashboard/profile" style={{ width: "38px", height: "38px", borderRadius: "50%", background: BURG, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "15px", fontWeight: 700, boxShadow: "0 2px 8px rgba(155,0,32,.3)", textDecoration: "none" }}>
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
