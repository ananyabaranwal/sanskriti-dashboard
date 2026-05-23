"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import DashPageWrapper from "../DashPageWrapper";

function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 9999, padding: "13px 18px", borderRadius: "12px", background: type === "success" ? "#F0FDF4" : "#FEF2F2", border: `1px solid ${type === "success" ? "#BBF7D0" : "#FECACA"}`, color: type === "success" ? "#15803d" : "#dc2626", fontSize: "13px", fontWeight: 500, boxShadow: "0 4px 16px rgba(0,0,0,.1)", display: "flex", alignItems: "center", gap: "10px", maxWidth: "340px" }}>
      <span>{type === "success" ? "✅" : "❌"}</span>
      <span style={{ flex: 1 }}>{msg}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "inherit", padding: 0 }}>×</button>
    </div>
  );
}

const inp: React.CSSProperties = { width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #E8D5A3", fontSize: "14px", color: "#2C1810", background: "#FBF7F0", outline: "none", fontFamily: "inherit", transition: "border-color .2s" };
const lbl: React.CSSProperties = { fontSize: "12px", fontWeight: 600, color: "#6B4F12", display: "block", marginBottom: "5px", letterSpacing: ".04em", textTransform: "uppercase" };

function Toggle({ checked, onChange, label, desc }: { checked: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #F0E4C0" }}>
      <div>
        <div style={{ fontSize: "14px", fontWeight: 500, color: "#2C1810" }}>{label}</div>
        {desc && <div style={{ fontSize: "12px", color: "#A08060", marginTop: "2px" }}>{desc}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{ width: "44px", height: "24px", borderRadius: "99px", background: checked ? "linear-gradient(135deg, #C9A84C, #8B6914)" : "#E8D5A3", border: "none", cursor: "pointer", position: "relative", transition: "background .2s", flexShrink: 0 }}
      >
        <span style={{ position: "absolute", top: "2px", left: checked ? "22px" : "2px", width: "20px", height: "20px", borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,.15)", transition: "left .2s" }} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"password" | "notifications" | "preferences">("password");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const showToast = (msg: string, type: "success" | "error" = "success") => setToast({ msg, type });

  // Password
  const [pw, setPw] = useState({ current: "", newPw: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });

  // Email preferences
  const [prefs, setPrefs] = useState({
    orderUpdates: true,
    walletAlerts: true,
    payoutStatus: true,
    kycUpdates: true,
    promotions: false,
    weeklyReport: true,
    newFeatures: false,
    securityAlerts: true,
  });
  const [savingPrefs, setSavingPrefs] = useState(false);

  // App preferences
  const [appPrefs, setAppPrefs] = useState({
    compactMode: false,
    showBalanceOnDashboard: true,
    autoGenerateInvoice: false,
    defaultPaymentMethod: "CASH",
  });

  const changePassword = async () => {
    setPwError("");
    if (!pw.current) { setPwError("Current password is required"); return; }
    if (pw.newPw.length < 8) { setPwError("New password must be at least 8 characters"); return; }
    if (pw.newPw !== pw.confirm) { setPwError("Passwords do not match"); return; }
    if (pw.newPw === pw.current) { setPwError("New password must be different from current password"); return; }
    setPwLoading(true);
    try {
      await api.patch("/seller/change-password", { currentPassword: pw.current, newPassword: pw.newPw });
      showToast("Password changed successfully!");
      setPw({ current: "", newPw: "", confirm: "" });
    } catch (e: any) {
      setPwError(e.response?.data?.message || "Incorrect current password");
    } finally { setPwLoading(false); }
  };

  const savePrefs = async () => {
    setSavingPrefs(true);
    await new Promise(r => setTimeout(r, 800)); // mock save
    showToast("Preferences saved successfully!");
    setSavingPrefs(false);
  };

  const strength = (p: string) => {
    if (!p) return { score: 0, label: "", color: "#E8D5A3" };
    let s = 0;
    if (p.length >= 8) s++;
    if (p.length >= 12) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    const map = [
      { label: "", color: "#E8D5A3" },
      { label: "Weak", color: "#dc2626" },
      { label: "Fair", color: "#f59e0b" },
      { label: "Good", color: "#3b82f6" },
      { label: "Strong", color: "#10b981" },
      { label: "Very Strong", color: "#059669" },
    ];
    return { score: s, ...map[Math.min(s, 5)] };
  };

  const pwStrength = strength(pw.newPw);

  const tabs = [
    { id: "password", label: "Password", icon: "🔒" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "preferences", label: "Preferences", icon: "⚙️" },
  ] as const;

  return (
    <DashPageWrapper>
    <div style={{ maxWidth: "700px" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ marginBottom: "24px" }}>
        <p style={{ fontSize: "12px", color: "#A08060", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "4px" }}>Account</p>
        <h1 style={{ fontSize: "26px", fontFamily: "Georgia, serif", color: "#2C1810", fontWeight: 400 }}>Settings</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", background: "#F5EDE0", padding: "4px", borderRadius: "10px", marginBottom: "20px" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex: 1, padding: "9px 12px", borderRadius: "7px", border: "none", background: activeTab === t.id ? "#FFFDF9" : "transparent", color: activeTab === t.id ? "#2C1810" : "#A08060", fontSize: "13px", fontWeight: activeTab === t.id ? 600 : 400, cursor: "pointer", fontFamily: "inherit", boxShadow: activeTab === t.id ? "0 1px 4px rgba(61,43,31,.1)" : "none", transition: "all .18s", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <span>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Password Tab */}
      {activeTab === "password" && (
        <div style={{ background: "#FFFDF9", border: "1px solid #E8D5A3", borderRadius: "16px", padding: "28px" }}>
          <h2 style={{ fontSize: "17px", fontFamily: "Georgia, serif", color: "#2C1810", marginBottom: "6px" }}>Change Password</h2>
          <p style={{ fontSize: "13px", color: "#A08060", marginBottom: "24px" }}>Choose a strong password with at least 8 characters</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "440px" }}>
            {/* Current password */}
            <div>
              <label style={lbl}>Current Password *</label>
              <div style={{ position: "relative" }}>
                <input type={showPw.current ? "text" : "password"} value={pw.current} onChange={e => setPw({ ...pw, current: e.target.value })} placeholder="Your current password" style={inp} />
                <button type="button" onClick={() => setShowPw(p => ({ ...p, current: !p.current }))} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#A08060", padding: 0 }}>{showPw.current ? "🙈" : "👁"}</button>
              </div>
            </div>

            {/* New password */}
            <div>
              <label style={lbl}>New Password *</label>
              <div style={{ position: "relative" }}>
                <input type={showPw.newPw ? "text" : "password"} value={pw.newPw} onChange={e => setPw({ ...pw, newPw: e.target.value })} placeholder="At least 8 characters" style={inp} />
                <button type="button" onClick={() => setShowPw(p => ({ ...p, newPw: !p.newPw }))} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#A08060", padding: 0 }}>{showPw.newPw ? "🙈" : "👁"}</button>
              </div>
              {/* Strength meter */}
              {pw.newPw && (
                <div style={{ marginTop: "8px" }}>
                  <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} style={{ flex: 1, height: "3px", borderRadius: "2px", background: i <= pwStrength.score ? pwStrength.color : "#E8D5A3", transition: "background .3s" }} />
                    ))}
                  </div>
                  {pwStrength.label && <div style={{ fontSize: "11px", color: pwStrength.color, fontWeight: 600 }}>{pwStrength.label}</div>}
                </div>
              )}
              {/* Requirements */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", marginTop: "10px" }}>
                {[
                  { rule: pw.newPw.length >= 8, label: "8+ characters" },
                  { rule: /[A-Z]/.test(pw.newPw), label: "Uppercase letter" },
                  { rule: /[0-9]/.test(pw.newPw), label: "Number" },
                  { rule: /[^A-Za-z0-9]/.test(pw.newPw), label: "Special character" },
                ].map(r => (
                  <div key={r.label} style={{ fontSize: "11px", color: r.rule ? "#15803d" : "#A08060", display: "flex", alignItems: "center", gap: "5px" }}>
                    <span>{r.rule ? "✓" : "○"}</span>{r.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label style={lbl}>Confirm New Password *</label>
              <div style={{ position: "relative" }}>
                <input type={showPw.confirm ? "text" : "password"} value={pw.confirm} onChange={e => setPw({ ...pw, confirm: e.target.value })} placeholder="Repeat new password" style={{ ...inp, borderColor: pw.confirm && pw.confirm !== pw.newPw ? "#FECACA" : "#E8D5A3" }} />
                <button type="button" onClick={() => setShowPw(p => ({ ...p, confirm: !p.confirm }))} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#A08060", padding: 0 }}>{showPw.confirm ? "🙈" : "👁"}</button>
              </div>
              {pw.confirm && pw.confirm !== pw.newPw && <div style={{ fontSize: "12px", color: "#dc2626", marginTop: "4px" }}>Passwords do not match</div>}
              {pw.confirm && pw.confirm === pw.newPw && pw.newPw && <div style={{ fontSize: "12px", color: "#15803d", marginTop: "4px" }}>✓ Passwords match</div>}
            </div>

            {pwError && <div style={{ padding: "10px 14px", borderRadius: "8px", background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: "13px" }}>⚠️ {pwError}</div>}

            <button onClick={changePassword} disabled={pwLoading} style={{ padding: "12px 28px", borderRadius: "8px", background: pwLoading ? "#E8D5A3" : "linear-gradient(135deg, #C9A84C, #8B6914)", color: pwLoading ? "#A08060" : "#2C1810", border: "none", fontSize: "14px", fontWeight: 700, cursor: pwLoading ? "not-allowed" : "pointer", fontFamily: "inherit", alignSelf: "flex-start", letterSpacing: ".02em" }}>
              {pwLoading ? "Changing..." : "Change Password"}
            </button>
          </div>

          {/* Tips */}
          <div style={{ marginTop: "28px", paddingTop: "24px", borderTop: "1px solid #F0E4C0" }}>
            <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#6B4F12", marginBottom: "10px" }}>Password Security Tips</h3>
            {["Use a mix of uppercase, lowercase, numbers, and symbols", "Don't reuse passwords from other websites", "Consider using a password manager", "Never share your password with anyone"].map(tip => (
              <div key={tip} style={{ fontSize: "12px", color: "#A08060", marginBottom: "6px", display: "flex", gap: "8px" }}>
                <span style={{ color: "#C9A84C" }}>•</span>{tip}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div style={{ background: "#FFFDF9", border: "1px solid #E8D5A3", borderRadius: "16px", padding: "28px" }}>
          <h2 style={{ fontSize: "17px", fontFamily: "Georgia, serif", color: "#2C1810", marginBottom: "6px" }}>Email Notifications</h2>
          <p style={{ fontSize: "13px", color: "#A08060", marginBottom: "24px" }}>Choose which emails you'd like to receive</p>

          {[
            { key: "orderUpdates",    label: "Order Updates",       desc: "Status changes for your orders (confirmed, shipped, delivered)" },
            { key: "walletAlerts",    label: "Wallet Alerts",       desc: "Credits, debits, and low balance warnings" },
            { key: "payoutStatus",    label: "Payout Status",       desc: "Payout approval, rejection, and payment notifications" },
            { key: "kycUpdates",      label: "KYC Updates",         desc: "Verification status changes and document requests" },
            { key: "securityAlerts",  label: "Security Alerts",     desc: "Login from new device, password changes (recommended)" },
            { key: "weeklyReport",    label: "Weekly Report",       desc: "Summary of your orders, revenue, and activity" },
            { key: "promotions",      label: "Promotions & Offers", desc: "Special offers and platform announcements" },
            { key: "newFeatures",     label: "New Features",        desc: "Updates about new platform features and improvements" },
          ].map(item => (
            <Toggle
              key={item.key}
              checked={prefs[item.key as keyof typeof prefs]}
              onChange={v => setPrefs(p => ({ ...p, [item.key]: v }))}
              label={item.label}
              desc={item.desc}
            />
          ))}

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button onClick={savePrefs} disabled={savingPrefs} style={{ padding: "11px 24px", borderRadius: "8px", background: savingPrefs ? "#E8D5A3" : "linear-gradient(135deg, #C9A84C, #8B6914)", color: savingPrefs ? "#A08060" : "#2C1810", border: "none", fontSize: "14px", fontWeight: 700, cursor: savingPrefs ? "not-allowed" : "pointer", fontFamily: "inherit", letterSpacing: ".02em" }}>
              {savingPrefs ? "Saving..." : "Save Preferences"}
            </button>
            <button onClick={() => setPrefs({ orderUpdates: false, walletAlerts: false, payoutStatus: false, kycUpdates: false, promotions: false, weeklyReport: false, newFeatures: false, securityAlerts: false })} style={{ padding: "11px 20px", borderRadius: "8px", border: "1.5px solid #E8D5A3", background: "transparent", color: "#A08060", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
              Unsubscribe All
            </button>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === "preferences" && (
        <div style={{ background: "#FFFDF9", border: "1px solid #E8D5A3", borderRadius: "16px", padding: "28px" }}>
          <h2 style={{ fontSize: "17px", fontFamily: "Georgia, serif", color: "#2C1810", marginBottom: "6px" }}>App Preferences</h2>
          <p style={{ fontSize: "13px", color: "#A08060", marginBottom: "24px" }}>Customise your dashboard experience</p>

          <Toggle checked={appPrefs.showBalanceOnDashboard} onChange={v => setAppPrefs(p => ({ ...p, showBalanceOnDashboard: v }))} label="Show Balance on Dashboard" desc="Display wallet balance on the main dashboard overview" />
          <Toggle checked={appPrefs.autoGenerateInvoice} onChange={v => setAppPrefs(p => ({ ...p, autoGenerateInvoice: v }))} label="Auto-generate Invoices" desc="Automatically create GST invoices when an order is confirmed" />
          <Toggle checked={appPrefs.compactMode} onChange={v => setAppPrefs(p => ({ ...p, compactMode: v }))} label="Compact Table View" desc="Show more rows in order and bill tables with reduced spacing" />

          <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #F0E4C0" }}>
            <label style={lbl}>Default Payment Method</label>
            <select value={appPrefs.defaultPaymentMethod} onChange={e => setAppPrefs(p => ({ ...p, defaultPaymentMethod: e.target.value }))} style={{ ...inp, maxWidth: "260px", cursor: "pointer" }}>
              {["CASH", "ONLINE", "WALLET", "OTHER"].map(m => <option key={m}>{m}</option>)}
            </select>
            <p style={{ fontSize: "12px", color: "#A08060", marginTop: "5px" }}>Pre-selected when creating new orders</p>
          </div>

          <button onClick={savePrefs} disabled={savingPrefs} style={{ marginTop: "20px", padding: "11px 24px", borderRadius: "8px", background: savingPrefs ? "#E8D5A3" : "linear-gradient(135deg, #C9A84C, #8B6914)", color: savingPrefs ? "#A08060" : "#2C1810", border: "none", fontSize: "14px", fontWeight: 700, cursor: savingPrefs ? "not-allowed" : "pointer", fontFamily: "inherit", letterSpacing: ".02em" }}>
            {savingPrefs ? "Saving..." : "Save Preferences"}
          </button>

          {/* Danger zone */}
          <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #F0E4C0" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#DC2626", marginBottom: "8px" }}>Danger Zone</h3>
            <p style={{ fontSize: "13px", color: "#A08060", marginBottom: "14px" }}>These actions are permanent and cannot be undone.</p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button style={{ padding: "9px 18px", borderRadius: "8px", background: "transparent", border: "1.5px solid #FDE68A", color: "#854d0e", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Clear All Data</button>
              <button style={{ padding: "9px 18px", borderRadius: "8px", background: "transparent", border: "1.5px solid #FECACA", color: "#DC2626", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Delete Account</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        input:focus, select:focus { border-color: #C9A84C !important; }
        input::placeholder { color: #C4A882; }
      `}</style>
    </div>
    </DashPageWrapper>
  );
}
