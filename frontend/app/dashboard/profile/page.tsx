"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import DashPageWrapper from "../DashPageWrapper";

type Seller = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  businessName?: string;
  gstNumber?: string;
  kycStatus?: string;
  address?: { street?: string; city?: string; state?: string; pincode?: string };
  bankDetails?: { accountNumber?: string; ifsc?: string; bankName?: string; accountHolder?: string };
  createdAt?: string;
};

function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 9999, padding: "13px 18px", borderRadius: "12px", background: type === "success" ? "#F0FDF4" : "#FEF2F2", border: `1px solid ${type === "success" ? "#BBF7D0" : "#FECACA"}`, color: type === "success" ? "#15803d" : "#dc2626", fontSize: "13px", fontWeight: "500", boxShadow: "0 4px 16px rgba(0,0,0,.1)", display: "flex", alignItems: "center", gap: "10px", animation: "slideDown .3s ease", maxWidth: "340px" }}>
      <span>{type === "success" ? "✅" : "❌"}</span>
      <span style={{ flex: 1 }}>{msg}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "inherit", padding: 0 }}>×</button>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: "8px",
  border: "1.5px solid #E8D5A3", fontSize: "14px", color: "#2C1810",
  background: "#FBF7F0", outline: "none", fontFamily: "inherit", transition: "border-color .2s",
};
const labelStyle: React.CSSProperties = {
  fontSize: "12px", fontWeight: 600, color: "#6B4F12",
  display: "block", marginBottom: "5px", letterSpacing: ".04em", textTransform: "uppercase",
};

const stateList = ["Andhra Pradesh","Assam","Bihar","Delhi","Gujarat","Haryana","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Odisha","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","Uttarakhand","West Bengal"];

export default function ProfilePage() {
  const [seller, setSeller]     = useState<Seller | null>(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "business" | "bank" | "security">("personal");
  const [toast, setToast]       = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const [personal, setPersonal] = useState({ name: "", email: "", phone: "" });
  const [business, setBusiness] = useState({ businessName: "", gstNumber: "", street: "", city: "", state: "", pincode: "" });
  const [bank, setBank]         = useState({ accountHolder: "", bankName: "", accountNumber: "", ifsc: "" });
  const [password, setPassword] = useState({ current: "", newPw: "", confirm: "" });
  const [pwError, setPwError]   = useState("");

  const showToast = (msg: string, type: "success" | "error" = "success") => setToast({ msg, type });

  useEffect(() => {
    api.get("/seller/profile").then((r) => {
      const s: Seller = r.data.seller;
      setSeller(s);
      setPersonal({ name: s.name || "", email: s.email || "", phone: s.phone || "" });
      setBusiness({ businessName: s.businessName || "", gstNumber: s.gstNumber || "", street: s.address?.street || "", city: s.address?.city || "", state: s.address?.state || "", pincode: s.address?.pincode || "" });
      setBank({ accountHolder: s.bankDetails?.accountHolder || "", bankName: s.bankDetails?.bankName || "", accountNumber: s.bankDetails?.accountNumber || "", ifsc: s.bankDetails?.ifsc || "" });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const savePersonal = async () => {
    if (!personal.name || !personal.phone) { showToast("Name and phone are required", "error"); return; }
    setSaving(true);
    try {
      await api.patch("/seller/profile", { name: personal.name, phone: personal.phone });
      showToast("Personal details updated successfully!");
    } catch (e: any) { showToast(e.response?.data?.message || "Update failed", "error"); }
    finally { setSaving(false); }
  };

  const saveBusiness = async () => {
    setSaving(true);
    try {
      await api.patch("/seller/profile", { businessName: business.businessName, gstNumber: business.gstNumber, address: { street: business.street, city: business.city, state: business.state, pincode: business.pincode } });
      showToast("Business details updated successfully!");
    } catch (e: any) { showToast(e.response?.data?.message || "Update failed", "error"); }
    finally { setSaving(false); }
  };

  const saveBank = async () => {
    if (!bank.bankName || !bank.accountNumber || !bank.ifsc) { showToast("Please fill all bank details", "error"); return; }
    setSaving(true);
    try {
      await api.patch("/seller/profile", { bankDetails: bank });
      showToast("Bank details updated successfully!");
    } catch (e: any) { showToast(e.response?.data?.message || "Update failed", "error"); }
    finally { setSaving(false); }
  };

  const changePassword = async () => {
    setPwError("");
    if (!password.current) { setPwError("Current password is required"); return; }
    if (password.newPw.length < 8) { setPwError("New password must be at least 8 characters"); return; }
    if (password.newPw !== password.confirm) { setPwError("New passwords do not match"); return; }
    setSavingPw(true);
    try {
      await api.patch("/seller/change-password", { currentPassword: password.current, newPassword: password.newPw });
      showToast("Password changed successfully!");
      setPassword({ current: "", newPw: "", confirm: "" });
    } catch (e: any) { setPwError(e.response?.data?.message || "Password change failed"); }
    finally { setSavingPw(false); }
  };

  const kycBadge = () => {
    const s = seller?.kycStatus || "not_submitted";
    const map: Record<string, { label: string; bg: string; color: string; border: string }> = {
      approved:      { label: "✓ KYC Verified",     bg: "#F0FDF4", color: "#15803d", border: "#BBF7D0" },
      pending:       { label: "⏳ Under Review",      bg: "#EFF6FF", color: "#1d4ed8", border: "#BFDBFE" },
      rejected:      { label: "✗ KYC Rejected",      bg: "#FEF2F2", color: "#dc2626", border: "#FECACA" },
      not_submitted: { label: "⚠️ KYC Pending",       bg: "#FFFBEB", color: "#854d0e", border: "#FDE68A" },
    };
    return map[s] || map.not_submitted;
  };

  const tabs = [
    { id: "personal",  label: "Personal",  icon: "👤" },
    { id: "business",  label: "Business",  icon: "🏢" },
    { id: "bank",      label: "Bank",      icon: "🏦" },
    { id: "security",  label: "Security",  icon: "🔒" },
  ] as const;

  if (loading) {
    return (
      <div style={{ maxWidth: "800px" }}>
        <div className="skeleton" style={{ height: "120px", borderRadius: "16px", marginBottom: "20px" }} />
        <div className="skeleton" style={{ height: "400px", borderRadius: "16px" }} />
      </div>
    );
  }

  return (
    <DashPageWrapper>
    <div style={{ maxWidth: "800px" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Header ── */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{ fontSize: "12px", color: "#A08060", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "4px" }}>Account</p>
        <h1 style={{ fontSize: "26px", fontFamily: "Georgia, serif", color: "#2C1810", fontWeight: "400" }}>Profile Settings</h1>
      </div>

      {/* ── Seller summary card ── */}
      <div style={{ background: "linear-gradient(135deg, #1A0F0A 0%, #2C1810 50%, #3D2B1F 100%)", borderRadius: "16px", padding: "24px 28px", marginBottom: "24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(201,168,76,.04) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, #C9A84C, #8B6914)", display: "flex", alignItems: "center", justifyContent: "center", color: "#2C1810", fontSize: "24px", fontWeight: "700", fontFamily: "Georgia, serif", flexShrink: 0, boxShadow: "0 4px 16px rgba(201,168,76,.3)" }}>
            {seller?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "20px", fontWeight: "600", color: "#F5E6C8", fontFamily: "Georgia, serif" }}>{seller?.name}</div>
            <div style={{ fontSize: "13px", color: "rgba(245,230,200,.55)", marginTop: "2px" }}>{seller?.email}</div>
            <div style={{ fontSize: "12px", color: "rgba(245,230,200,.4)", marginTop: "2px" }}>
              Member since {seller?.createdAt ? new Date(seller.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "—"}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
            <span style={{ padding: "5px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: "700", background: kycBadge().bg, color: kycBadge().color, border: `1px solid ${kycBadge().border}` }}>{kycBadge().label}</span>
            {seller?.kycStatus !== "approved" && (
              <a href="/dashboard/kyc" style={{ fontSize: "12px", color: "#C9A84C", textDecoration: "none", fontWeight: "600" }}>Complete KYC →</a>
            )}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: "4px", background: "#F5EDE0", padding: "4px", borderRadius: "10px", marginBottom: "20px" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex: 1, padding: "9px 12px", borderRadius: "7px", border: "none", background: activeTab === t.id ? "#FFFDF9" : "transparent", color: activeTab === t.id ? "#2C1810" : "#A08060", fontSize: "13px", fontWeight: activeTab === t.id ? "600" : "400", cursor: "pointer", fontFamily: "inherit", boxShadow: activeTab === t.id ? "0 1px 4px rgba(61,43,31,.1)" : "none", transition: "all .18s", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <span>{t.icon}</span><span className="hide-mobile">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <div style={{ background: "#FFFDF9", border: "1px solid #E8D5A3", borderRadius: "16px", padding: "28px 28px 24px" }}>

        {/* Personal Info */}
        {activeTab === "personal" && (
          <div>
            <h2 style={{ fontSize: "17px", fontFamily: "Georgia, serif", color: "#2C1810", marginBottom: "6px" }}>Personal Information</h2>
            <p style={{ fontSize: "13px", color: "#A08060", marginBottom: "24px" }}>Your basic account details</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input value={personal.name} onChange={(e) => setPersonal({ ...personal, name: e.target.value })} placeholder="Your full name" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input value={personal.email} disabled placeholder="Email address" style={{ ...inputStyle, background: "#F0E8D8", color: "#A08060", cursor: "not-allowed" }} />
                <p style={{ fontSize: "11px", color: "#A08060", marginTop: "4px" }}>Email cannot be changed. Contact support if needed.</p>
              </div>
              <div>
                <label style={labelStyle}>Mobile Number *</label>
                <input value={personal.phone} onChange={(e) => setPersonal({ ...personal, phone: e.target.value })} placeholder="10-digit mobile number" style={inputStyle} />
              </div>
              <button onClick={savePersonal} disabled={saving} style={{ padding: "12px 28px", borderRadius: "8px", background: saving ? "#E8D5A3" : "linear-gradient(135deg, #C9A84C, #8B6914)", color: saving ? "#A08060" : "#2C1810", border: "none", fontSize: "14px", fontWeight: "700", cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit", alignSelf: "flex-start", letterSpacing: ".02em" }}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {/* Business Details */}
        {activeTab === "business" && (
          <div>
            <h2 style={{ fontSize: "17px", fontFamily: "Georgia, serif", color: "#2C1810", marginBottom: "6px" }}>Business Details</h2>
            <p style={{ fontSize: "13px", color: "#A08060", marginBottom: "24px" }}>Your shop and GST information</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={labelStyle}>Business Name</label>
                  <input value={business.businessName} onChange={(e) => setBusiness({ ...business, businessName: e.target.value })} placeholder="Your shop name" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>GST Number</label>
                  <input value={business.gstNumber} onChange={(e) => setBusiness({ ...business, gstNumber: e.target.value })} placeholder="15-digit GST number" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Street Address</label>
                <input value={business.street} onChange={(e) => setBusiness({ ...business, street: e.target.value })} placeholder="Shop / office address" style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={labelStyle}>City</label>
                  <input value={business.city} onChange={(e) => setBusiness({ ...business, city: e.target.value })} placeholder="City" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>State</label>
                  <select value={business.state} onChange={(e) => setBusiness({ ...business, state: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="">Select state</option>
                    {stateList.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ maxWidth: "200px" }}>
                <label style={labelStyle}>Pincode</label>
                <input value={business.pincode} onChange={(e) => setBusiness({ ...business, pincode: e.target.value })} placeholder="6-digit pincode" maxLength={6} style={inputStyle} />
              </div>
              <button onClick={saveBusiness} disabled={saving} style={{ padding: "12px 28px", borderRadius: "8px", background: saving ? "#E8D5A3" : "linear-gradient(135deg, #C9A84C, #8B6914)", color: saving ? "#A08060" : "#2C1810", border: "none", fontSize: "14px", fontWeight: "700", cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit", alignSelf: "flex-start", letterSpacing: ".02em" }}>
                {saving ? "Saving..." : "Save Business Details"}
              </button>
            </div>
          </div>
        )}

        {/* Bank Details */}
        {activeTab === "bank" && (
          <div>
            <h2 style={{ fontSize: "17px", fontFamily: "Georgia, serif", color: "#2C1810", marginBottom: "6px" }}>Bank Account</h2>
            <p style={{ fontSize: "13px", color: "#A08060", marginBottom: "4px" }}>Used for payout withdrawals</p>
            <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "8px", padding: "10px 14px", marginBottom: "20px", fontSize: "12px", color: "#854d0e" }}>
              🔒 Your bank details are encrypted and used only for payout processing.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { key: "accountHolder", label: "Account Holder Name *", placeholder: "Exactly as per bank records" },
                { key: "bankName",      label: "Bank Name *",            placeholder: "e.g. State Bank of India"   },
                { key: "accountNumber", label: "Account Number *",       placeholder: "12 to 16 digit number"       },
                { key: "ifsc",          label: "IFSC Code *",            placeholder: "e.g. SBIN0001234"            },
              ].map((f) => (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  <input value={bank[f.key as keyof typeof bank]} onChange={(e) => setBank({ ...bank, [f.key]: e.target.value })} placeholder={f.placeholder} style={inputStyle} />
                </div>
              ))}
              <button onClick={saveBank} disabled={saving} style={{ padding: "12px 28px", borderRadius: "8px", background: saving ? "#E8D5A3" : "linear-gradient(135deg, #C9A84C, #8B6914)", color: saving ? "#A08060" : "#2C1810", border: "none", fontSize: "14px", fontWeight: "700", cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit", alignSelf: "flex-start", letterSpacing: ".02em" }}>
                {saving ? "Saving..." : "Save Bank Details"}
              </button>
            </div>
          </div>
        )}

        {/* Security */}
        {activeTab === "security" && (
          <div>
            <h2 style={{ fontSize: "17px", fontFamily: "Georgia, serif", color: "#2C1810", marginBottom: "6px" }}>Change Password</h2>
            <p style={{ fontSize: "13px", color: "#A08060", marginBottom: "24px" }}>Use a strong password with at least 8 characters</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "420px" }}>
              {[
                { key: "current", label: "Current Password *", placeholder: "Your current password" },
                { key: "newPw",   label: "New Password *",     placeholder: "At least 8 characters"  },
                { key: "confirm", label: "Confirm New Password *", placeholder: "Repeat new password" },
              ].map((f) => (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  <input type="password" value={password[f.key as keyof typeof password]} onChange={(e) => setPassword({ ...password, [f.key]: e.target.value })} placeholder={f.placeholder} style={inputStyle} />
                </div>
              ))}
              {pwError && (
                <div style={{ padding: "10px 14px", borderRadius: "8px", background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: "13px" }}>⚠️ {pwError}</div>
              )}
              <button onClick={changePassword} disabled={savingPw} style={{ padding: "12px 28px", borderRadius: "8px", background: savingPw ? "#E8D5A3" : "linear-gradient(135deg, #C9A84C, #8B6914)", color: savingPw ? "#A08060" : "#2C1810", border: "none", fontSize: "14px", fontWeight: "700", cursor: savingPw ? "not-allowed" : "pointer", fontFamily: "inherit", alignSelf: "flex-start", letterSpacing: ".02em" }}>
                {savingPw ? "Changing..." : "Change Password"}
              </button>
            </div>

            {/* Account danger zone */}
            <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1px solid #F0E4C0" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#DC2626", marginBottom: "8px" }}>Danger Zone</h3>
              <p style={{ fontSize: "13px", color: "#A08060", marginBottom: "14px" }}>These actions are irreversible. Please be careful.</p>
              <button style={{ padding: "10px 20px", borderRadius: "8px", background: "transparent", border: "1.5px solid #FECACA", color: "#DC2626", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        input:focus, select:focus { border-color: #C9A84C !important; }
        input::placeholder { color: #C4A882; }
      `}</style>
    </div>
    </DashPageWrapper>
  );
}
