"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // If already logged in as admin, skip login
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

      // ── Role check ──────────────────────────────────────────
      // Decode JWT to read the role claim
      const token   = res.data.accessToken;
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (payload.role !== "admin") {
        setError("Access denied. This portal is for administrators only.");
        setLoading(false);
        return;
      }
      // ────────────────────────────────────────────────────────

      localStorage.setItem("accessToken", token);
      localStorage.setItem("adminToken",  token);
      router.push("/admin");

    } catch (e: any) {
      setError(e.response?.data?.message || "Invalid credentials");
    } finally { setLoading(false); }
  };

  if (!mounted) return null;

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(145deg,#0F0A07 0%,#1A0F0A 40%,#2C1810 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px", fontFamily:"'Segoe UI',sans-serif", position:"relative", overflow:"hidden" }}>

      {/* Decorative rings */}
      <div style={{ position:"absolute", top:"-120px", left:"-120px", width:"380px", height:"380px", borderRadius:"50%", border:"1px solid rgba(201,168,76,.05)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", top:"-60px", left:"-60px", width:"220px", height:"220px", borderRadius:"50%", border:"1px solid rgba(201,168,76,.03)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:"-100px", right:"-100px", width:"320px", height:"320px", borderRadius:"50%", border:"1px solid rgba(201,168,76,.04)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(201,168,76,.03) 1px,transparent 1px)", backgroundSize:"30px 30px", pointerEvents:"none" }}/>

      <div style={{ width:"100%", maxWidth:"420px", position:"relative", zIndex:1 }}>

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:"36px" }}>
          <div style={{ width:"60px", height:"60px", borderRadius:"14px", background:"linear-gradient(135deg,#C9A84C,#8B6914)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px", fontSize:"24px", fontWeight:700, color:"#2C1810", fontFamily:"Georgia,serif", boxShadow:"0 8px 28px rgba(201,168,76,.35)" }}>S</div>
          <div style={{ color:"#C9A84C", fontSize:"18px", fontWeight:700, fontFamily:"Georgia,serif", letterSpacing:".08em" }}>SANSKRITI</div>
          <div style={{ color:"rgba(201,168,76,.4)", fontSize:"10px", letterSpacing:".22em", marginTop:"2px" }}>ADMIN PANEL</div>
        </div>

        {/* Card */}
        <div style={{ background:"rgba(255,253,249,.04)", backdropFilter:"blur(20px)", border:"1px solid rgba(201,168,76,.14)", borderRadius:"20px", padding:"36px 36px 32px", boxShadow:"0 24px 60px rgba(0,0,0,.4), inset 0 1px 0 rgba(201,168,76,.08)" }}>

          <h1 style={{ fontSize:"22px", fontFamily:"Georgia,serif", color:"#F5E6C8", fontWeight:400, marginBottom:"5px" }}>Admin Sign In</h1>
          <p style={{ fontSize:"13px", color:"rgba(245,230,200,.4)", marginBottom:"28px" }}>Restricted access — authorised personnel only</p>

          {error && (
            <div style={{ padding:"11px 14px", borderRadius:"9px", background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.25)", color:"#fca5a5", fontSize:"13px", marginBottom:"18px", display:"flex", gap:"8px", alignItems:"flex-start" }}>
              <span style={{ flexShrink:0 }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display:"flex", flexDirection:"column", gap:"16px" }}>

            {/* Email */}
            <div>
              <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(201,168,76,.7)", display:"block", marginBottom:"7px", letterSpacing:".07em", textTransform:"uppercase" }}>Email Address</label>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:"13px", top:"50%", transform:"translateY(-50%)", fontSize:"15px", pointerEvents:"none", opacity:.5 }}>✉️</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@sanskriti.com"
                  autoComplete="email"
                  style={{ width:"100%", padding:"12px 14px 12px 40px", borderRadius:"9px", border:"1px solid rgba(201,168,76,.18)", background:"rgba(255,253,249,.05)", color:"#F5E6C8", fontSize:"14px", outline:"none", fontFamily:"inherit", transition:"border-color .2s" }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(201,168,76,.7)", display:"block", marginBottom:"7px", letterSpacing:".07em", textTransform:"uppercase" }}>Password</label>
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:"13px", top:"50%", transform:"translateY(-50%)", fontSize:"15px", pointerEvents:"none", opacity:.5 }}>🔑</span>
                <input
                  type={showPw?"text":"password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  style={{ width:"100%", padding:"12px 42px 12px 40px", borderRadius:"9px", border:"1px solid rgba(201,168,76,.18)", background:"rgba(255,253,249,.05)", color:"#F5E6C8", fontSize:"14px", outline:"none", fontFamily:"inherit", transition:"border-color .2s" }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position:"absolute", right:"13px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:"15px", color:"rgba(201,168,76,.5)", padding:0 }}>
                  {showPw ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{ padding:"13px", borderRadius:"9px", background:loading?"rgba(201,168,76,.25)":"linear-gradient(135deg,#C9A84C,#8B6914)", color:loading?"rgba(245,230,200,.35)":"#2C1810", border:"none", fontSize:"14px", fontWeight:700, cursor:loading?"not-allowed":"pointer", fontFamily:"inherit", letterSpacing:".03em", marginTop:"4px", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", boxShadow:loading?"none":"0 6px 20px rgba(201,168,76,.25)", transition:"all .2s" }}
            >
              {loading ? (
                <><span style={{ width:"14px", height:"14px", borderRadius:"50%", border:"2px solid rgba(44,24,16,.3)", borderTopColor:"#2C1810", animation:"spin .7s linear infinite", display:"inline-block" }}/>Verifying...</>
              ) : (
                "Sign In to Admin →"
              )}
            </button>

          </form>
        </div>

        {/* How to get access */}
        <div style={{ marginTop:"16px", padding:"12px 16px", borderRadius:"10px", background:"rgba(201,168,76,.05)", border:"1px solid rgba(201,168,76,.1)", fontSize:"12px", color:"rgba(201,168,76,.45)", lineHeight:1.6 }}>
          💡 Admin access requires <strong style={{ color:"rgba(201,168,76,.7)" }}>role: "admin"</strong> set in MongoDB Atlas on your seller account.
        </div>

        <p style={{ textAlign:"center", fontSize:"11px", color:"rgba(201,168,76,.2)", marginTop:"16px", letterSpacing:".05em" }}>
          © 2026 Sanskriti The Antique · Admin Portal
        </p>
      </div>

      <style>{`
        input::placeholder { color:rgba(245,230,200,.2)!important; }
        input:focus { border-color:rgba(201,168,76,.5)!important; box-shadow:0 0 0 3px rgba(201,168,76,.07); }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
