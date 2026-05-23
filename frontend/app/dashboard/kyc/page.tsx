"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import DashPageWrapper from "../DashPageWrapper";

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

const steps = [
  { id: 1, title: "Identity Proof",  icon: "🪪", desc: "PAN Card or Aadhaar Card" },
  { id: 2, title: "Business Proof",  icon: "🏢", desc: "GST certificate or trade licence" },
  { id: 3, title: "Bank Proof",      icon: "🏦", desc: "Cancelled cheque or bank statement" },
  { id: 4, title: "Selfie / Photo",  icon: "📸", desc: "Live selfie with identity document" },
];

export default function KycPage() {
  const [seller, setSeller]   = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]     = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [files, setFiles]     = useState<Record<number, File | null>>({ 1: null, 2: null, 3: null, 4: null });
  const [previews, setPreviews] = useState<Record<number, string>>({});

  const showToast = (msg: string, type: "success" | "error" = "success") => setToast({ msg, type });

  useEffect(() => {
    api.get("/seller/profile")
      .then((r) => setSeller(r.data.seller))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleFile = (stepId: number, file: File | null) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowed.includes(file.type)) { showToast("Only JPG, PNG, or PDF files are allowed", "error"); return; }
    if (file.size > 5 * 1024 * 1024) { showToast("File size must be under 5MB", "error"); return; }
    setFiles((prev) => ({ ...prev, [stepId]: file }));
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviews((prev) => ({ ...prev, [stepId]: e.target?.result as string }));
      reader.readAsDataURL(file);
    } else {
      setPreviews((prev) => ({ ...prev, [stepId]: "pdf" }));
    }
  };

  const handleSubmit = async () => {
    if (!files[1]) { showToast("Identity proof document is required", "error"); return; }
    setSubmitting(true);
    try {
      // Upload files via KYC endpoint
      const formData = new FormData();
      Object.entries(files).forEach(([key, file]) => {
        if (file) formData.append(`document_${key}`, file);
      });
      // Mock submission — replace with real API when KYC upload endpoint is ready
      await new Promise((r) => setTimeout(r, 1500));
      await api.patch("/seller/profile", { kycStatus: "pending" });
      setSeller((prev: any) => ({ ...prev, kycStatus: "pending" }));
      showToast("KYC documents submitted successfully! We'll review within 2–3 business days.");
    } catch (e: any) {
      showToast(e.response?.data?.message || "Submission failed. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const statusInfo = () => {
    const s = seller?.kycStatus || "not_submitted";
    return {
      not_submitted: { label: "Not Submitted",  color: "#854d0e",  bg: "#FFFBEB", border: "#FDE68A",  icon: "⚠️" },
      pending:       { label: "Under Review",    color: "#1d4ed8",  bg: "#EFF6FF", border: "#BFDBFE",  icon: "⏳" },
      approved:      { label: "KYC Verified ✓",  color: "#15803d",  bg: "#F0FDF4", border: "#BBF7D0",  icon: "✅" },
      rejected:      { label: "KYC Rejected",    color: "#dc2626",  bg: "#FEF2F2", border: "#FECACA",  icon: "❌" },
    }[s] || { label: "Not Submitted", color: "#854d0e", bg: "#FFFBEB", border: "#FDE68A", icon: "⚠️" };
  };

  if (loading) return <div className="skeleton" style={{ height: "400px", borderRadius: "16px", maxWidth: "700px" }} />;

  const status = statusInfo();
  const isVerified = seller?.kycStatus === "approved";
  const isPending  = seller?.kycStatus === "pending";

  return (
    <DashPageWrapper>
    <div style={{ maxWidth: "700px" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{ fontSize: "12px", color: "#A08060", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "4px" }}>Account</p>
        <h1 style={{ fontSize: "26px", fontFamily: "Georgia, serif", color: "#2C1810", fontWeight: "400" }}>KYC Verification</h1>
      </div>

      {/* Status banner */}
      <div style={{ background: status.bg, border: `1px solid ${status.border}`, borderLeft: `4px solid ${status.color}`, borderRadius: "12px", padding: "16px 20px", marginBottom: "28px", display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "24px" }}>{status.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "15px", fontWeight: "600", color: status.color }}>
            Status: {status.label}
          </div>
          <div style={{ fontSize: "13px", color: status.color, opacity: .75, marginTop: "2px" }}>
            {isVerified  && "Your identity has been verified. You can now access all seller features."}
            {isPending   && "Your documents are under review. We'll notify you within 2–3 business days."}
            {!isVerified && !isPending && "Complete KYC verification to unlock selling, payouts, and your verified badge."}
          </div>
        </div>
        {isVerified && <span style={{ padding: "5px 14px", borderRadius: "99px", background: "#15803d", color: "#fff", fontSize: "12px", fontWeight: "700" }}>✓ Verified</span>}
      </div>

      {/* Why KYC */}
      {!isVerified && (
        <div style={{ background: "#FFFDF9", border: "1px solid #E8D5A3", borderRadius: "14px", padding: "18px 22px", marginBottom: "24px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#2C1810", marginBottom: "12px", fontFamily: "Georgia, serif" }}>Why is KYC required?</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {[
              { icon: "💸", text: "Enable wallet payouts" },
              { icon: "🏷️", text: "Get verified seller badge" },
              { icon: "🛡️", text: "Build buyer trust" },
              { icon: "📋", text: "Regulatory compliance" },
            ].map((b) => (
              <div key={b.text} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#6B4F12" }}>
                <span>{b.icon}</span><span>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload steps */}
      {!isVerified && !isPending && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
            {steps.map((step) => {
              const hasFile = !!files[step.id];
              const preview = previews[step.id];
              return (
                <div key={step.id} style={{ background: "#FFFDF9", border: `1px solid ${hasFile ? "rgba(201,168,76,.5)" : "#E8D5A3"}`, borderRadius: "14px", padding: "18px 20px", transition: "border-color .2s" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                    {/* Step number + icon */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: hasFile ? "rgba(16,185,129,.1)" : "rgba(201,168,76,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                        {hasFile ? "✅" : step.icon}
                      </div>
                      <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: hasFile ? "#15803d" : "#E8D5A3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: hasFile ? "#fff" : "#A08060", fontWeight: "700" }}>{step.id}</div>
                    </div>
                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#2C1810", marginBottom: "2px" }}>{step.title}</div>
                      <div style={{ fontSize: "12px", color: "#A08060", marginBottom: "12px" }}>{step.desc}</div>

                      {/* Preview */}
                      {preview && (
                        <div style={{ marginBottom: "10px" }}>
                          {preview === "pdf" ? (
                            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "8px", background: "#F5E6C8", border: "1px solid #E8D5A3", fontSize: "12px", color: "#6B4F12", fontWeight: "500" }}>
                              📄 {files[step.id]?.name}
                            </div>
                          ) : (
                            <img src={preview} alt="Preview" style={{ width: "120px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "1px solid #E8D5A3" }} />
                          )}
                        </div>
                      )}

                      {/* Upload button */}
                      <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "8px", background: hasFile ? "rgba(16,185,129,.08)" : "rgba(201,168,76,.08)", border: `1px solid ${hasFile ? "rgba(16,185,129,.3)" : "rgba(201,168,76,.3)"}`, color: hasFile ? "#15803d" : "#8B6914", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                        <span>{hasFile ? "✓ Uploaded — Click to change" : "📁 Upload Document"}</span>
                        <input type="file" accept="image/jpeg,image/png,image/jpg,application/pdf" onChange={(e) => handleFile(step.id, e.target.files?.[0] || null)} style={{ display: "none" }} />
                      </label>
                      <p style={{ fontSize: "11px", color: "#A08060", marginTop: "6px" }}>Accepted: JPG, PNG, PDF · Max 5MB</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit */}
          <div style={{ background: "#FBF7F0", border: "1px solid #E8D5A3", borderRadius: "12px", padding: "16px 20px", marginBottom: "16px", fontSize: "12px", color: "#A08060", lineHeight: "1.6" }}>
            <strong style={{ color: "#6B4F12" }}>Important:</strong> Upload clear, legible documents. Blurry or incomplete documents will delay verification. Your data is encrypted and shared only with our verification team.
          </div>

          <button onClick={handleSubmit} disabled={submitting || !files[1]} style={{ width: "100%", padding: "14px", borderRadius: "10px", background: submitting || !files[1] ? "#E8D5A3" : "linear-gradient(135deg, #C9A84C, #8B6914)", color: submitting || !files[1] ? "#A08060" : "#2C1810", border: "none", fontSize: "15px", fontWeight: "700", cursor: submitting || !files[1] ? "not-allowed" : "pointer", fontFamily: "inherit", letterSpacing: ".02em", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            {submitting ? <><span style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid rgba(44,24,16,.3)", borderTop: "2px solid #2C1810", animation: "spin .7s linear infinite", display: "inline-block" }} />Submitting...</> : "Submit KYC Documents →"}
          </button>
        </>
      )}

      {/* Already submitted / verified */}
      {(isVerified || isPending) && (
        <div style={{ background: "#FFFDF9", border: "1px solid #E8D5A3", borderRadius: "14px", padding: "32px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>{isVerified ? "🏆" : "⏳"}</div>
          <h3 style={{ fontSize: "20px", fontFamily: "Georgia, serif", color: "#2C1810", marginBottom: "10px" }}>
            {isVerified ? "KYC Verified!" : "Documents Under Review"}
          </h3>
          <p style={{ fontSize: "14px", color: "#A08060", lineHeight: "1.7", marginBottom: "24px", maxWidth: "400px", margin: "0 auto 24px" }}>
            {isVerified
              ? "Your identity has been verified. All seller features are now unlocked. Start selling and grow your antique business!"
              : "Your documents have been submitted and are being reviewed by our team. This usually takes 2–3 business days."}
          </p>
          <Link href="/dashboard" style={{ display: "inline-block", padding: "12px 28px", borderRadius: "8px", background: "linear-gradient(135deg, #C9A84C, #8B6914)", color: "#2C1810", fontSize: "14px", fontWeight: "700", textDecoration: "none" }}>
            Back to Dashboard →
          </Link>
        </div>
      )}

      <style>{`
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>
    </div>
    </DashPageWrapper>
  );
}
