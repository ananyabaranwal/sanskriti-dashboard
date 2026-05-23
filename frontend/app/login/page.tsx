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
      background: "linear-gradient(145deg, #1A0F0A 0%, #2C1810 35%, #3D2B1F 65%, #5C3A1E 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Segoe UI', sans-serif",
    }}>

      {/* Background decorations */}
      <div style={{ position: "absolute", top: "-150px", left: "-150px", width: "500px", height: "500px", borderRadius: "50%", border: "1px solid rgba(201,168,76,.06)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "-80px", left: "-80px", width: "320px", height: "320px", borderRadius: "50%", border: "1px solid rgba(201,168,76,.04)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-120px", right: "-120px", width: "440px", height: "440px", borderRadius: "50%", border: "1px solid rgba(201,168,76,.05)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-60px", right: "-60px", width: "260px", height: "260px", borderRadius: "50%", border: "1px solid rgba(201,168,76,.07)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", left: "8%", width: "120px", height: "120px", borderRadius: "50%", border: "1px solid rgba(201,168,76,.04)", transform: "translateY(-50%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "20%", right: "10%", width: "80px", height: "80px", borderRadius: "50%", border: "1px solid rgba(201,168,76,.05)", pointerEvents: "none" }} />

      {/* Dot pattern */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(201,168,76,.03) 1px, transparent 1px)", backgroundSize: "36px 36px", pointerEvents: "none" }} />

      {/* Card */}
      <div style={{
        width: "100%",
        maxWidth: "480px",
        position: "relative",
        zIndex: 1,
      }}>

        {/* Top logo area */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-block" }}>
            <div style={{
              width: "68px", height: "68px", borderRadius: "50%",
              background: "linear-gradient(135deg, #C9A84C 0%, #E8C86A 40%, #8B6914 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: "26px", fontWeight: "700", color: "#2C1810",
              fontFamily: "Georgia, serif",
              boxShadow: "0 8px 32px rgba(201,168,76,.35), 0 0 0 1px rgba(201,168,76,.2)",
            }}>S</div>
          </Link>
          <div style={{ color: "#C9A84C", fontSize: "20px", fontWeight: "700", fontFamily: "Georgia, serif", letterSpacing: ".08em" }}>SANSKRITI</div>
          <div style={{ color: "#A08060", fontSize: "10px", letterSpacing: ".24em", marginTop: "3px" }}>THE ANTIQUE</div>
        </div>

        {/* Glass card */}
        <div style={{
          background: "rgba(255,253,249,.04)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(201,168,76,.15)",
          borderRadius: "24px",
          padding: "40px 40px 36px",
          boxShadow: "0 24px 64px rgba(0,0,0,.4), inset 0 1px 0 rgba(201,168,76,.1)",
        }}>

          {/* Heading */}
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{ fontSize: "26px", fontFamily: "Georgia, serif", color: "#F5E6C8", fontWeight: "400", marginBottom: "6px", lineHeight: 1.2 }}>
              Welcome back
            </h1>
            <p style={{ fontSize: "14px", color: "rgba(245,230,200,.45)", lineHeight: 1.5 }}>
              Sign in to your seller account
            </p>
          </div>

          {/* Server error */}
          {serverError && (
            <div style={{
              padding: "12px 16px",
              borderRadius: "10px",
              background: "rgba(239,68,68,.1)",
              border: "1px solid rgba(239,68,68,.25)",
              color: "#fca5a5",
              fontSize: "13px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              <span style={{ flexShrink: 0 }}>⚠️</span>
              {serverError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

            {/* Email */}
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(201,168,76,.8)", display: "block", marginBottom: "8px", letterSpacing: ".06em", textTransform: "uppercase" }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", pointerEvents: "none", opacity: .6 }}>✉️</span>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  style={{
                    width: "100%",
                    padding: "13px 14px 13px 42px",
                    borderRadius: "10px",
                    border: `1px solid ${errors.email ? "rgba(239,68,68,.5)" : "rgba(201,168,76,.2)"}`,
                    background: "rgba(255,253,249,.05)",
                    color: "#F5E6C8",
                    fontSize: "14px",
                    outline: "none",
                    fontFamily: "inherit",
                    transition: "border-color .2s",
                  }}
                />
              </div>
              {errors.email && <p style={{ fontSize: "12px", color: "#fca5a5", marginTop: "5px", paddingLeft: "2px" }}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(201,168,76,.8)", letterSpacing: ".06em", textTransform: "uppercase" }}>
                  Password
                </label>
                <Link href="/forgot-password" style={{ fontSize: "12px", color: "rgba(201,168,76,.6)", textDecoration: "none", fontWeight: "500", transition: "color .2s" }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", pointerEvents: "none", opacity: .6 }}>🔑</span>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  style={{
                    width: "100%",
                    padding: "13px 44px 13px 42px",
                    borderRadius: "10px",
                    border: `1px solid ${errors.password ? "rgba(239,68,68,.5)" : "rgba(201,168,76,.2)"}`,
                    background: "rgba(255,253,249,.05)",
                    color: "#F5E6C8",
                    fontSize: "14px",
                    outline: "none",
                    fontFamily: "inherit",
                    transition: "border-color .2s",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "15px", opacity: .5, padding: 0 }}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
              {errors.password && <p style={{ fontSize: "12px", color: "#fca5a5", marginTop: "5px", paddingLeft: "2px" }}>{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "10px",
                background: loading
                  ? "rgba(201,168,76,.3)"
                  : "linear-gradient(135deg, #C9A84C 0%, #E8C86A 50%, #8B6914 100%)",
                color: loading ? "rgba(245,230,200,.4)" : "#2C1810",
                border: "none",
                fontSize: "15px",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                letterSpacing: ".04em",
                marginTop: "6px",
                transition: "all .2s",
                boxShadow: loading ? "none" : "0 6px 24px rgba(201,168,76,.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {loading ? (
                <>
                  <span style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid rgba(245,230,200,.3)", borderTop: "2px solid rgba(245,230,200,.7)", animation: "spin .7s linear infinite", display: "inline-block" }} />
                  Signing in...
                </>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", margin: "24px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(201,168,76,.1)" }} />
            <span style={{ fontSize: "12px", color: "rgba(201,168,76,.35)", letterSpacing: ".06em" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(201,168,76,.1)" }} />
          </div>

          {/* Register link */}
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "14px", color: "rgba(245,230,200,.4)", marginBottom: "12px" }}>
              Don&apos;t have a seller account?
            </p>
            <Link href="/register" style={{
              display: "block",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid rgba(201,168,76,.2)",
              color: "#C9A84C",
              fontSize: "14px",
              fontWeight: "600",
              textDecoration: "none",
              transition: "all .2s",
              letterSpacing: ".02em",
              background: "rgba(201,168,76,.04)",
            }}>
              Register as a Seller
            </Link>
          </div>
        </div>

        {/* Bottom links */}
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "24px" }}>
          {[
            { label: "Home",    href: "/" },
            { label: "Privacy", href: "/privacy" },
            { label: "FAQ",     href: "/faq" },
            { label: "Contact", href: "/contact" },
          ].map((l) => (
            <Link key={l.href} href={l.href} style={{ fontSize: "12px", color: "rgba(201,168,76,.35)", textDecoration: "none", letterSpacing: ".04em", transition: "color .2s" }}>
              {l.label}
            </Link>
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: "11px", color: "rgba(201,168,76,.2)", marginTop: "16px", letterSpacing: ".06em" }}>
          © 2026 SANSKRITI THE ANTIQUE
        </p>
      </div>

      <style>{`
        input::placeholder { color: rgba(245,230,200,.2) !important; }
        input:focus { border-color: rgba(201,168,76,.5) !important; box-shadow: 0 0 0 3px rgba(201,168,76,.08); }
        @keyframes spin { to { transform: rotate(360deg); } }
        a:hover { color: rgba(201,168,76,.9) !important; }
      `}</style>
    </div>
  );
}
