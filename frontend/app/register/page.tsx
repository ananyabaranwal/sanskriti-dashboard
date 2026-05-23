"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

const steps = ["Personal Info", "Business Details", "Done"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
    businessName: "", gstNumber: "", city: "", state: "",
    agreeTerms: false, agreeDisclaimer: false,
  });

  const update = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.phone || !form.password) { setError("All fields are required"); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(form.phone.replace(/\s/g, ""))) { setError("Enter a valid 10-digit Indian mobile number"); return; }
    setStep(1);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.agreeTerms || !form.agreeDisclaimer) { setError("Please accept the Terms of Service and Disclaimer to continue"); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        name: form.name,
        email: form.email,
        phone: form.phone.replace(/\s/g, ""),
        password: form.password,
      }, { withCredentials: true });
      localStorage.setItem("accessToken", res.data.accessToken);
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: "8px",
    border: "1.5px solid #E8D5A3", fontSize: "14px",
    color: "#2C1810", background: "#FBF7F0", outline: "none", fontFamily: "inherit",
  };

  const labelStyle = {
    fontSize: "12px", fontWeight: "600" as const, color: "#6B4F12",
    display: "block" as const, marginBottom: "5px", letterSpacing: ".03em",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Segoe UI', sans-serif", paddingTop: "72px" }}>

      {/* Left panel */}
      <div style={{ width: "42%", background: "linear-gradient(160deg, #1A0F0A 0%, #2C1810 50%, #3D2B1F 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 40px", position: "relative", overflow: "hidden" }} className="hide-mobile">
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(201,168,76,.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ position: "relative", textAlign: "center", maxWidth: "340px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "linear-gradient(135deg, #C9A84C, #8B6914)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "28px", fontWeight: "700", color: "#3D2B1F", fontFamily: "Georgia, serif" }}>S</div>
          <div style={{ color: "#C9A84C", fontSize: "20px", fontWeight: "700", fontFamily: "Georgia, serif", letterSpacing: ".06em", marginBottom: "4px" }}>SANSKRITI</div>
          <div style={{ color: "#A08060", fontSize: "10px", letterSpacing: ".22em", marginBottom: "32px" }}>THE ANTIQUE</div>
          <h2 style={{ fontSize: "26px", fontFamily: "Georgia, serif", color: "#F5E6C8", lineHeight: "1.3", marginBottom: "16px", fontWeight: "400" }}>Join India's Premier Antique Marketplace</h2>
          <p style={{ fontSize: "14px", color: "rgba(245,230,200,.58)", lineHeight: "1.75", marginBottom: "32px" }}>Register as a verified seller and reach thousands of collectors across India and internationally.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {["✓ Free to register", "✓ KYC verified badge", "✓ GST invoice generation", "✓ Wallet & payment system", "✓ Training video access", "✓ Dedicated seller support"].map((b) => (
              <div key={b} style={{ fontSize: "13px", color: "rgba(245,230,200,.7)", textAlign: "left", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#C9A84C", fontWeight: "700" }}>{b.split(" ")[0]}</span>
                <span>{b.split(" ").slice(1).join(" ")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, background: "#FBF7F0", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: "460px" }}>

          {/* Step indicator */}
          {step < 2 && (
            <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "32px" }}>
              {steps.map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: i <= step ? "linear-gradient(135deg, #C9A84C, #8B6914)" : "#E8D5A3", display: "flex", alignItems: "center", justifyContent: "center", color: i <= step ? "#3D2B1F" : "#A08060", fontSize: "12px", fontWeight: "700", flexShrink: 0 }}>
                      {i < step ? "✓" : i + 1}
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: i === step ? "600" : "400", color: i === step ? "#2C1810" : "#A08060", whiteSpace: "nowrap" }}>{s}</span>
                  </div>
                  {i < steps.length - 1 && <div style={{ flex: 1, height: "1px", background: i < step ? "#C9A84C" : "#E8D5A3", margin: "0 10px" }} />}
                </div>
              ))}
            </div>
          )}

          {/* Step 1 — Personal Info */}
          {step === 0 && (
            <>
              <div style={{ marginBottom: "28px" }}>
                <h1 style={{ fontSize: "24px", fontFamily: "Georgia, serif", color: "#2C1810", marginBottom: "6px" }}>Create Your Account</h1>
                <p style={{ fontSize: "14px", color: "#A08060" }}>Start with your personal information</p>
              </div>

              {error && <div style={{ padding: "11px 14px", borderRadius: "8px", background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: "13px", marginBottom: "16px" }}>⚠️ {error}</div>}

              <form onSubmit={handleStep1} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your full name" required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input value={form.email} onChange={(e) => update("email", e.target.value)} type="email" placeholder="your@email.com" required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Mobile Number *</label>
                  <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="10-digit mobile number" required style={inputStyle} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={labelStyle}>Password *</label>
                    <input value={form.password} onChange={(e) => update("password", e.target.value)} type="password" placeholder="Min 8 characters" required style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Confirm Password *</label>
                    <input value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} type="password" placeholder="Repeat password" required style={inputStyle} />
                  </div>
                </div>
                <button type="submit" style={{ padding: "13px", borderRadius: "8px", background: "linear-gradient(135deg, #C9A84C, #8B6914)", color: "#3D2B1F", border: "none", fontSize: "15px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", letterSpacing: ".02em", marginTop: "4px" }}>
                  Continue →
                </button>
              </form>

              <p style={{ textAlign: "center", fontSize: "13px", color: "#A08060", marginTop: "20px" }}>
                Already a seller?{" "}
                <Link href="/login" style={{ color: "#8B6914", fontWeight: "600", textDecoration: "none" }}>Sign In</Link>
              </p>
            </>
          )}

          {/* Step 2 — Business Details */}
          {step === 1 && (
            <>
              <div style={{ marginBottom: "28px" }}>
                <h1 style={{ fontSize: "24px", fontFamily: "Georgia, serif", color: "#2C1810", marginBottom: "6px" }}>Business Details</h1>
                <p style={{ fontSize: "14px", color: "#A08060" }}>Optional now — complete during KYC verification</p>
              </div>

              {error && <div style={{ padding: "11px 14px", borderRadius: "8px", background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: "13px", marginBottom: "16px" }}>⚠️ {error}</div>}

              <form onSubmit={handleStep2} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={labelStyle}>Business Name (optional)</label>
                  <input value={form.businessName} onChange={(e) => update("businessName", e.target.value)} placeholder="Your shop or business name" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>GST Number (optional)</label>
                  <input value={form.gstNumber} onChange={(e) => update("gstNumber", e.target.value)} placeholder="15-digit GST number" style={inputStyle} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={labelStyle}>City</label>
                    <input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="City" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>State</label>
                    <select value={form.state} onChange={(e) => update("state", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                      <option value="">Select state</option>
                      {["Andhra Pradesh","Assam","Bihar","Delhi","Gujarat","Haryana","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Odisha","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","Uttarakhand","West Bengal"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Agreements */}
                <div style={{ background: "#F5E6C8", borderRadius: "10px", padding: "16px", border: "1px solid #E8D5A3" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "10px" }}>
                    <input type="checkbox" id="terms" checked={form.agreeTerms} onChange={(e) => update("agreeTerms", e.target.checked)} style={{ marginTop: "2px", accentColor: "#8B6914", flexShrink: 0 }} />
                    <label htmlFor="terms" style={{ fontSize: "13px", color: "#2C1810", lineHeight: "1.5", cursor: "pointer" }}>
                      I agree to the <Link href="/privacy" target="_blank" style={{ color: "#8B6914", fontWeight: "600" }}>Privacy Policy</Link> and Terms of Service *
                    </label>
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <input type="checkbox" id="disclaimer" checked={form.agreeDisclaimer} onChange={(e) => update("agreeDisclaimer", e.target.checked)} style={{ marginTop: "2px", accentColor: "#8B6914", flexShrink: 0 }} />
                    <label htmlFor="disclaimer" style={{ fontSize: "13px", color: "#2C1810", lineHeight: "1.5", cursor: "pointer" }}>
                      I have read and understood the <Link href="/disclaimer" target="_blank" style={{ color: "#8B6914", fontWeight: "600" }}>Disclaimer</Link> including loss and damage policy *
                    </label>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                  <button type="button" onClick={() => { setStep(0); setError(""); }} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1.5px solid #E8D5A3", background: "transparent", color: "#6B4F12", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>← Back</button>
                  <button type="submit" disabled={loading} style={{ flex: 2, padding: "12px", borderRadius: "8px", background: loading ? "#E8D5A3" : "linear-gradient(135deg, #C9A84C, #8B6914)", color: loading ? "#A08060" : "#3D2B1F", border: "none", fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", letterSpacing: ".02em" }}>
                    {loading ? "Creating Account..." : "Create Account →"}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Step 3 — Success */}
          {step === 2 && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "linear-gradient(135deg, #C9A84C, #8B6914)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "32px", boxShadow: "0 8px 24px rgba(139,105,20,.3)" }}>🎉</div>
              <h2 style={{ fontSize: "26px", fontFamily: "Georgia, serif", color: "#2C1810", marginBottom: "10px" }}>Welcome to Sanskriti!</h2>
              <p style={{ fontSize: "15px", color: "#A08060", lineHeight: "1.75", marginBottom: "12px" }}>
                Your seller account has been created successfully. Complete your KYC verification to start selling.
              </p>
              <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "10px", padding: "14px 16px", marginBottom: "28px", fontSize: "13px", color: "#854d0e", textAlign: "left" }}>
                <strong>Next step:</strong> Complete your KYC verification in the dashboard to get your verified seller badge and start listing antiques.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button onClick={() => router.push("/dashboard")} style={{ padding: "13px", borderRadius: "8px", background: "linear-gradient(135deg, #C9A84C, #8B6914)", color: "#3D2B1F", border: "none", fontSize: "15px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>
                  Go to Dashboard →
                </button>
                <button onClick={() => router.push("/dashboard/kyc")} style={{ padding: "12px", borderRadius: "8px", border: "1.5px solid #E8D5A3", color: "#6B4F12", background: "transparent", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}>
                  Complete KYC Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        input:focus, select:focus, textarea:focus { border-color: #C9A84C !important; }
        input::placeholder, textarea::placeholder { color: #C4A882; }
        @media (max-width: 768px) { .hide-mobile { display: none !important; } }
      `}</style>
    </div>
  );
}
