"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem("accessToken")) router.push("/dashboard");
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setServerError("");
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        data,
        { withCredentials: true }
      );
      localStorage.setItem("accessToken", res.data.accessToken);
      router.push("/dashboard");
    } catch (err: any) {
      setServerError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fff",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "40px 24px 24px",
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: "460px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-block" }}>
            <img
              src="/logo.png"
              alt="Sanskriti The Antique"
              style={{ height: "90px", width: "auto", objectFit: "contain", display: "block", margin: "0 auto", mixBlendMode: "multiply" }}
            />
          </Link>
        </div>

        {/* Card with deep red border */}
        <div style={{
          background: "#fff",
          border: "1.5px solid #8B1A1A",
          borderRadius: "16px",
          padding: "36px 36px 32px",
          boxShadow: "0 4px 24px rgba(139,26,26,.08)",
        }}>
          <h1 style={{ fontSize: "24px", fontFamily: "Georgia,serif", color: "#1a0a0a", fontWeight: 400, marginBottom: "6px" }}>Welcome back</h1>
          <p style={{ fontSize: "13px", color: "#9a7070", marginBottom: "28px" }}>Sign in to your seller account</p>

          {serverError && (
            <div style={{ padding: "11px 14px", borderRadius: "8px", background: "rgba(139,26,26,.06)", border: "1px solid rgba(139,26,26,.2)", color: "#8B1A1A", fontSize: "13px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>⚠️</span>{serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

            <div>
              <label style={{ fontSize: "11px", fontWeight: 600, color: "#8B1A1A", display: "block", marginBottom: "7px", letterSpacing: ".06em", textTransform: "uppercase" }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", fontSize: "15px", pointerEvents: "none", opacity: .4 }}>✉️</span>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  style={{ width: "100%", padding: "12px 14px 12px 40px", borderRadius: "8px", border: `1px solid ${errors.email ? "#8B1A1A" : "rgba(139,26,26,.25)"}`, background: "#fafafa", color: "#1a0a0a", fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                  onFocus={e => { e.target.style.borderColor = "#8B1A1A"; e.target.style.boxShadow = "0 0 0 3px rgba(139,26,26,.07)"; }}
                  onBlur={e  => { e.target.style.borderColor = errors.email ? "#8B1A1A" : "rgba(139,26,26,.25)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
              {errors.email && <p style={{ fontSize: "12px", color: "#8B1A1A", marginTop: "4px" }}>{errors.email.message}</p>}
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }}>
                <label style={{ fontSize: "11px", fontWeight: 600, color: "#8B1A1A", letterSpacing: ".06em", textTransform: "uppercase" }}>Password</label>
                <Link href="/forgot-password" style={{ fontSize: "12px", color: "#8B1A1A", textDecoration: "none", opacity: .7 }}>Forgot password?</Link>
              </div>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", fontSize: "15px", pointerEvents: "none", opacity: .4 }}>🔑</span>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  style={{ width: "100%", padding: "12px 42px 12px 40px", borderRadius: "8px", border: `1px solid ${errors.password ? "#8B1A1A" : "rgba(139,26,26,.25)"}`, background: "#fafafa", color: "#1a0a0a", fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                  onFocus={e => { e.target.style.borderColor = "#8B1A1A"; e.target.style.boxShadow = "0 0 0 3px rgba(139,26,26,.07)"; }}
                  onBlur={e  => { e.target.style.borderColor = errors.password ? "#8B1A1A" : "rgba(139,26,26,.25)"; e.target.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "15px", color: "#8B1A1A", opacity: .5, padding: 0 }}>
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
              {errors.password && <p style={{ fontSize: "12px", color: "#8B1A1A", marginTop: "4px" }}>{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "13px", borderRadius: "8px", background: loading ? "rgba(139,26,26,.3)" : "#8B1A1A", color: loading ? "rgba(139,26,26,.4)" : "#fff", border: "none", fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", letterSpacing: ".03em", marginTop: "4px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: loading ? "none" : "0 4px 16px rgba(139,26,26,.2)" }}
            >
              {loading ? (<><span style={{ width: "14px", height: "14px", borderRadius: "50%", border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", animation: "spin .7s linear infinite", display: "inline-block" }} />Signing in...</>) : "Sign In →"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "22px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(139,26,26,.1)" }} />
            <span style={{ fontSize: "11px", color: "rgba(139,26,26,.4)", letterSpacing: ".06em" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(139,26,26,.1)" }} />
          </div>

          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "13px", color: "#9a7070", marginBottom: "10px" }}>Don&apos;t have a seller account?</p>
            <Link href="/register" style={{ display: "block", padding: "11px", borderRadius: "8px", border: "1px solid rgba(139,26,26,.3)", color: "#8B1A1A", fontSize: "14px", fontWeight: 600, textDecoration: "none", background: "rgba(139,26,26,.03)", textAlign: "center" }}>
              Register as a Seller
            </Link>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
          {[{ label: "Home", href: "/" }, { label: "Privacy", href: "/privacy" }, { label: "FAQ", href: "/faq" }, { label: "Contact", href: "/contact" }].map(l => (
            <Link key={l.href} href={l.href} style={{ fontSize: "12px", color: "rgba(139,26,26,.4)", textDecoration: "none" }}>{l.label}</Link>
          ))}
        </div>
        <p style={{ textAlign: "center", fontSize: "11px", color: "rgba(139,26,26,.25)", marginTop: "12px", letterSpacing: ".05em" }}>© 2026 SANSKRITI THE ANTIQUE</p>
      </div>

      <style>{`
        input::placeholder { color: rgba(26,10,10,.25) !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
