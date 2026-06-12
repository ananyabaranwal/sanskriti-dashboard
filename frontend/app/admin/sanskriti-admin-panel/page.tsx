"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("adminToken");
    if (token) router.push("/admin");
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Email and password are required"); return; }
    setLoading(true); setError("");
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      const token   = res.data.accessToken;
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role !== "admin") {
        setError("Access denied. This portal is for administrators only.");
        setLoading(false);
        return;
      }
      localStorage.setItem("accessToken", token);
      localStorage.setItem("adminToken",  token);
      router.push("/admin");
    } catch (e: any) {
      setError(e.response?.data?.message || "Invalid credentials");
    } finally { setLoading(false); }
  };

  if (!mounted) return null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F8F4F0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'Segoe UI', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Subtle background texture */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(139,26,26,.04) 1px, transparent 1px)", backgroundSize:"28px 28px", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", top:"-160px", right:"-160px", width:"400px", height:"400px", borderRadius:"50%", background:"rgba(139,26,26,.04)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:"-120px", left:"-120px", width:"320px", height:"320px", borderRadius:"50%", background:"rgba(139,26,26,.03)", pointerEvents:"none" }}/>

      <div style={{ width:"100%", maxWidth:"420px", position:"relative", zIndex:1 }}>

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:"32px" }}>
          <img
            src="/logo.png"
            alt="Sanskriti The Antique"
            style={{ height:"110px", width:"auto", objectFit:"contain", margin:"0 auto", display:"block", mixBlendMode:"multiply" }}
          />
          <div style={{ marginTop:"8px", fontSize:"11px", letterSpacing:".18em", color:"#8B1A1A", textTransform:"uppercase", fontWeight:600 }}>Admin Panel</div>
        </div>

        {/* Glass card with deep red outline */}
        <div style={{
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1.5px solid #8B1A1A",
          borderRadius: "20px",
          padding: "36px 36px 32px",
          boxShadow: "0 8px 40px rgba(139,26,26,.10), 0 1px 0 rgba(255,255,255,.8) inset",
        }}>

          <h1 style={{ fontSize:"22px", fontFamily:"Georgia,serif", color:"#1a0a0a", fontWeight:400, marginBottom:"5px" }}>Admin Sign In</h1>
          <p style={{ fontSize:"13px", color:"#9a7070", marginBottom:"28px" }}>Restricted access — authorised personnel only</p>

          {error && (
            <div style={{ padding:"11px 14px", borderRadius:"9px", background:"rgba(139,26,26,.07)", border:"1px solid rgba(139,26,26,.25)", color:"#8B1A1A", fontSize:"13px", marginBottom:"18px", display:"flex", gap:"8px", alignItems:"flex-start" }}>
              <span style={{ flexShrink:0 }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display:"flex", flexDirection:"column", gap:"16px" }}>

            {/* Email */}
            <div>
              <label style={{ fontSize:"11px", fontWeight:700, color:"#8B1A1A", display:"block", marginBottom:"7px", letterSpacing:".07em", textTransform:"uppercase" }}>Email Address</label>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:"13px", top:"50%", transform:"translateY(-50%)", fontSize:"15px", pointerEvents:"none", opacity:.5 }}>✉️</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@sanskriti.com"
                  autoComplete="email"
                  style={{ width:"100%", padding:"12px 14px 12px 40px", borderRadius:"9px", border:"1px solid rgba(139,26,26,.25)", background:"rgba(255,255,255,0.7)", color:"#1a0a0a", fontSize:"14px", outline:"none", fontFamily:"inherit", transition:"border-color .2s", boxSizing:"border-box" }}
                  onFocus={e => { e.target.style.borderColor="#8B1A1A"; e.target.style.boxShadow="0 0 0 3px rgba(139,26,26,.08)"; }}
                  onBlur={e  => { e.target.style.borderColor="rgba(139,26,26,.25)"; e.target.style.boxShadow="none"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize:"11px", fontWeight:700, color:"#8B1A1A", display:"block", marginBottom:"7px", letterSpacing:".07em", textTransform:"uppercase" }}>Password</label>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:"13px", top:"50%", transform:"translateY(-50%)", fontSize:"15px", pointerEvents:"none", opacity:.5 }}>🔑</span>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  style={{ width:"100%", padding:"12px 42px 12px 40px", borderRadius:"9px", border:"1px solid rgba(139,26,26,.25)", background:"rgba(255,255,255,0.7)", color:"#1a0a0a", fontSize:"14px", outline:"none", fontFamily:"inherit", transition:"border-color .2s", boxSizing:"border-box" }}
                  onFocus={e => { e.target.style.borderColor="#8B1A1A"; e.target.style.boxShadow="0 0 0 3px rgba(139,26,26,.08)"; }}
                  onBlur={e  => { e.target.style.borderColor="rgba(139,26,26,.25)"; e.target.style.boxShadow="none"; }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position:"absolute", right:"13px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:"15px", color:"#8B1A1A", opacity:.5, padding:0 }}>
                  {showPw ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "13px",
                borderRadius: "9px",
                background: loading ? "rgba(139,26,26,.25)" : "#8B1A1A",
                color: loading ? "rgba(139,26,26,.4)" : "#fff",
                border: "none",
                fontSize: "14px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                letterSpacing: ".03em",
                marginTop: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: loading ? "none" : "0 6px 20px rgba(139,26,26,.25)",
                transition: "all .2s",
              }}
            >
              {loading ? (
                <><span style={{ width:"14px", height:"14px", borderRadius:"50%", border:"2px solid rgba(139,26,26,.2)", borderTopColor:"#8B1A1A", animation:"spin .7s linear infinite", display:"inline-block" }}/>Verifying...</>
              ) : (
                "Sign In to Admin →"
              )}
            </button>

          </form>
        </div>

        <p style={{ textAlign:"center", fontSize:"11px", color:"rgba(139,26,26,.3)", marginTop:"20px", letterSpacing:".05em" }}>
          © 2026 Sanskriti The Antique · Admin Portal
        </p>
      </div>

      <style>{`
        input::placeholder { color: rgba(26,10,10,.25) !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
