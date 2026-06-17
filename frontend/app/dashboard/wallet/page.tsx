"use client";

// ── DESTINATION: frontend/app/dashboard/wallet/page.tsx
// (this comment is just a label — safe to delete)

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import DashPageWrapper from "../DashPageWrapper";

const BURG      = "#9B0020";
const BURG_DARK = "#7A0018";

type Transaction = {
  _id: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  balance: number;
  description: string;
  category: string;
  createdAt: string;
};

type Payout = {
  _id: string;
  amount: number;
  status: string;
  bankDetails: { accountNumber: string; ifsc: string; bankName: string; accountHolder?: string };
  adminNote?: string;
  createdAt: string;
};

// ── Helpers ───────────────────────────────────────────────────
function groupByDate(txs: Transaction[]) {
  const groups: Record<string, Transaction[]> = {};
  txs.forEach((tx) => {
    const d = new Date(tx.createdAt);
    const today = new Date();
    const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
    let label: string;
    if (d.toDateString() === today.toDateString()) label = "Today";
    else if (d.toDateString() === yesterday.toDateString()) label = "Yesterday";
    else label = d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    if (!groups[label]) groups[label] = [];
    groups[label].push(tx);
  });
  return groups;
}

const categoryIcons: Record<string, string> = {
  Topup: "💳", topup: "💳", Order: "📦", order: "📦",
  Payout: "💸", payout: "💸", Refund: "↩️", refund: "↩️",
  Fee: "📋", fee: "📋",
};

// ── Toast ─────────────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4500); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 9999, padding: "13px 18px", borderRadius: "12px", background: type === "success" ? "#F0FDF4" : "#FEF2F2", border: `1px solid ${type === "success" ? "#BBF7D0" : "#FECACA"}`, color: type === "success" ? "#15803d" : "#dc2626", fontSize: "13px", fontWeight: 500, boxShadow: "0 8px 24px rgba(0,0,0,.12)", display: "flex", alignItems: "center", gap: "10px", maxWidth: "340px", fontFamily: "inherit", animation: "slideDown .3s ease" }}>
      <span style={{ fontSize: "16px" }}>{type === "success" ? "✅" : "❌"}</span>
      <span style={{ flex: 1, lineHeight: 1.5 }}>{msg}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "inherit", padding: 0, opacity: .6, lineHeight: 1 }}>×</button>
    </div>
  );
}

// ── Skeleton row ──────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 22px", borderBottom: "1px solid #F3F4F6" }}>
      <div className="skeleton" style={{ width: "40px", height: "40px", borderRadius: "10px", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ width: "60%", height: "14px", borderRadius: "4px", marginBottom: "6px" }} />
        <div className="skeleton" style={{ width: "35%", height: "11px", borderRadius: "4px" }} />
      </div>
      <div style={{ textAlign: "right" }}>
        <div className="skeleton" style={{ width: "72px", height: "16px", borderRadius: "4px", marginBottom: "5px" }} />
        <div className="skeleton" style={{ width: "52px", height: "11px", borderRadius: "4px" }} />
      </div>
    </div>
  );
}

// ── Top-up modal ──────────────────────────────────────────────
function TopUpModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (amt: number) => void }) {
  const [amount, setAmount] = useState("");
  const [gateway, setGateway] = useState<"razorpay" | "cashfree" | "paypal">("razorpay");
  const [step, setStep] = useState<"select" | "processing" | "success">("select");
  const [error, setError] = useState("");
  const presets = [100, 500, 1000, 2000, 5000];

  const handlePay = async () => {
    const amt = Number(amount);
    if (!amt || amt < 10)  { setError("Minimum top-up is ₹10");        return; }
    if (amt > 100000)      { setError("Maximum top-up is ₹1,00,000");  return; }
    setError(""); setStep("processing");
    try {
      await new Promise(r => setTimeout(r, 1800));
      await api.post("/wallet/credit", {
        amount: amt,
        description: `Wallet top-up via ${gateway === "razorpay" ? "Razorpay" : gateway === "cashfree" ? "Cashfree" : "PayPal"} (mock)`,
        category: "Topup",
      });
      setStep("success");
      setTimeout(() => onSuccess(amt), 1600);
    } catch (e: any) {
      setError(e.response?.data?.message || "Payment failed. Try again.");
      setStep("select");
    }
  };

  const gateways = [
    { id: "razorpay" as const, name: "Razorpay", logo: "💳", desc: "UPI · Cards · Net Banking" },
    { id: "cashfree" as const, name: "Cashfree", logo: "🏦", desc: "UPI · Wallets · Cards"     },
    { id: "paypal"   as const, name: "PayPal",   logo: "🌐", desc: "International payments"    },
  ];

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget && step !== "processing") onClose(); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "20px", backdropFilter: "blur(6px)" }}>
      <div style={{ background: "#fff", borderRadius: "22px", width: "100%", maxWidth: "460px", overflow: "hidden", boxShadow: "0 28px 72px rgba(0,0,0,.35)", animation: "scaleIn .3s ease" }}>

        {/* Dark header */}
        <div style={{ background: `linear-gradient(135deg, #1A0006, #5C0014, ${BURG_DARK})`, padding: "22px 28px 20px", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "22px 22px", pointerEvents: "none" }} />
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: "20px", fontFamily: "Georgia, serif", color: "#fff", fontWeight: 400, marginBottom: "3px" }}>Add Money to Wallet</h2>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,.6)" }}>Secured · Credited instantly</p>
            </div>
            {step !== "processing" && (
              <button onClick={onClose} style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)", color: "#fff", fontSize: "17px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>×</button>
            )}
          </div>
        </div>

        {/* Processing */}
        {step === "processing" && (
          <div style={{ padding: "52px 28px", textAlign: "center" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", border: "3px solid #E5E7EB", borderTopColor: BURG, animation: "spin .8s linear infinite", margin: "0 auto 20px" }} />
            <h3 style={{ fontSize: "18px", fontFamily: "Georgia, serif", color: "#1F2937", marginBottom: "8px" }}>Processing Payment</h3>
            <p style={{ fontSize: "13px", color: "#6B7280" }}>Please wait — do not close this window</p>
          </div>
        )}

        {/* Success */}
        {step === "success" && (
          <div style={{ padding: "52px 28px", textAlign: "center" }}>
            <div style={{ width: "66px", height: "66px", borderRadius: "50%", background: `linear-gradient(135deg, ${BURG}, ${BURG_DARK})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "28px", fontWeight: 700, color: "#fff", boxShadow: "0 8px 24px rgba(155,0,32,.35)" }}>✓</div>
            <h3 style={{ fontSize: "22px", fontFamily: "Georgia, serif", color: "#1F2937", marginBottom: "8px" }}>₹{Number(amount).toLocaleString("en-IN")} Added!</h3>
            <p style={{ fontSize: "13px", color: "#6B7280" }}>Your wallet balance has been updated</p>
          </div>
        )}

        {/* Select */}
        {step === "select" && (
          <div style={{ padding: "24px 28px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#6B7280", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: "8px" }}>Quick Amount</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "18px" }}>
              {presets.map(p => (
                <button key={p} onClick={() => setAmount(String(p))} style={{ padding: "7px 14px", borderRadius: "8px", border: `1.5px solid ${amount === String(p) ? BURG : "#E5E7EB"}`, background: amount === String(p) ? `linear-gradient(135deg, ${BURG}, ${BURG_DARK})` : "transparent", color: amount === String(p) ? "#fff" : "#374151", fontSize: "13px", fontWeight: amount === String(p) ? 700 : 500, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}>
                  ₹{p.toLocaleString("en-IN")}
                </button>
              ))}
            </div>

            <p style={{ fontSize: "11px", fontWeight: 700, color: "#6B7280", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: "6px" }}>Custom Amount</p>
            <div style={{ position: "relative", marginBottom: "18px" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", fontWeight: 700, color: BURG }}>₹</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" min={10} max={100000} style={{ width: "100%", padding: "13px 14px 13px 34px", borderRadius: "9px", border: "1.5px solid #E5E7EB", fontSize: "18px", fontWeight: 700, color: "#1F2937", background: "#F9FAFB", outline: "none", fontFamily: "inherit" }} />
            </div>

            <p style={{ fontSize: "11px", fontWeight: 700, color: "#6B7280", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: "8px" }}>Payment Gateway</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
              {gateways.map(g => (
                <button key={g.id} onClick={() => setGateway(g.id)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "11px 14px", borderRadius: "10px", border: `1.5px solid ${gateway === g.id ? BURG : "#E5E7EB"}`, background: gateway === g.id ? "rgba(155,0,32,.05)" : "transparent", cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "all .15s" }}>
                  <span style={{ fontSize: "20px" }}>{g.logo}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: gateway === g.id ? 700 : 500, color: gateway === g.id ? BURG : "#1F2937" }}>{g.name}</div>
                    <div style={{ fontSize: "11px", color: "#6B7280" }}>{g.desc}</div>
                  </div>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${gateway === g.id ? BURG : "#E5E7EB"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {gateway === g.id && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: BURG }} />}
                  </div>
                </button>
              ))}
            </div>

            {error && <div style={{ padding: "10px 14px", borderRadius: "8px", background: "#FEF2F2", border: "1px solid #FECACA", color: "#dc2626", fontSize: "13px", marginBottom: "14px" }}>⚠️ {error}</div>}

            <button onClick={handlePay} disabled={!amount || Number(amount) < 10} style={{ width: "100%", padding: "14px", borderRadius: "10px", background: !amount || Number(amount) < 10 ? "#E5E7EB" : `linear-gradient(135deg, ${BURG}, ${BURG_DARK})`, color: !amount || Number(amount) < 10 ? "#9CA3AF" : "#fff", border: "none", fontSize: "15px", fontWeight: 700, cursor: !amount || Number(amount) < 10 ? "not-allowed" : "pointer", fontFamily: "inherit", letterSpacing: ".02em", boxShadow: !amount || Number(amount) < 10 ? "none" : "0 6px 20px rgba(155,0,32,.3)", transition: "all .2s" }}>
              {amount && Number(amount) >= 10 ? `Pay ₹${Number(amount).toLocaleString("en-IN")} via ${gateways.find(g => g.id === gateway)?.name}` : "Enter an amount to continue"}
            </button>
            <p style={{ fontSize: "11px", color: "#9CA3AF", textAlign: "center", marginTop: "10px" }}>🔒 256-bit SSL encrypted</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Payout modal ──────────────────────────────────────────────
function PayoutModal({ balance, onClose, onSuccess }: { balance: number; onClose: () => void; onSuccess: () => void }) {
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState({ accountHolder: "", bankName: "", accountNumber: "", ifsc: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inp: React.CSSProperties = { width: "100%", padding: "11px 14px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: "14px", color: "#1F2937", background: "#F9FAFB", outline: "none", fontFamily: "inherit" };
  const lbl: React.CSSProperties = { fontSize: "11px", fontWeight: 700, color: "#6B7280", letterSpacing: ".06em", textTransform: "uppercase", display: "block", marginBottom: "5px" };

  const handleRequest = async () => {
    const amt = Number(amount);
    if (!amt || amt < 100)   { setError("Minimum payout is ₹100");           return; }
    if (amt > balance)       { setError("Amount exceeds available balance");  return; }
    if (!bank.accountHolder) { setError("Account holder name is required");  return; }
    if (!bank.bankName)      { setError("Bank name is required");             return; }
    if (!bank.accountNumber) { setError("Account number is required");        return; }
    if (!bank.ifsc)          { setError("IFSC code is required");             return; }
    setLoading(true); setError("");
    try {
      await api.post("/payouts/request", { amount: amt, bankDetails: bank });
      onSuccess();
    } catch (e: any) {
      setError(e.response?.data?.message || "Request failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "20px", backdropFilter: "blur(6px)" }}>
      <div style={{ background: "#fff", borderRadius: "22px", width: "100%", maxWidth: "460px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 28px 72px rgba(0,0,0,.35)", animation: "scaleIn .3s ease" }}>
        <div style={{ background: `linear-gradient(135deg, #1A0006, ${BURG})`, padding: "22px 28px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "20px", fontFamily: "Georgia, serif", color: "#fff", fontWeight: 400 }}>Withdraw Funds</h2>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,.6)", marginTop: "2px" }}>Available: <strong style={{ color: "#fff" }}>₹{balance.toLocaleString("en-IN")}</strong></p>
          </div>
          <button onClick={onClose} style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(255,255,255,.1)", border: "none", color: "#fff", fontSize: "17px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>×</button>
        </div>
        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={lbl}>Withdrawal Amount *</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "15px", fontWeight: 700, color: BURG }}>₹</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Min ₹100" style={{ ...inp, padding: "12px 14px 12px 32px", fontSize: "18px", fontWeight: 700 }} />
            </div>
            {amount && Number(amount) > 0 && (
              <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "4px" }}>Remaining: ₹{Math.max(0, balance - Number(amount)).toLocaleString("en-IN")}</p>
            )}
          </div>
          {[
            { key: "accountHolder", label: "Account Holder Name *",    placeholder: "Exactly as per bank records" },
            { key: "bankName",      label: "Bank Name *",              placeholder: "e.g. State Bank of India"    },
            { key: "accountNumber", label: "Account Number *",         placeholder: "10 to 18 digit number"        },
            { key: "ifsc",          label: "IFSC Code *",              placeholder: "e.g. SBIN0001234"             },
          ].map(f => (
            <div key={f.key}>
              <label style={lbl}>{f.label}</label>
              <input value={bank[f.key as keyof typeof bank]} onChange={e => setBank({ ...bank, [f.key]: e.target.value })} placeholder={f.placeholder} style={inp} />
            </div>
          ))}
          <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "8px", padding: "10px 14px", fontSize: "12px", color: "#854d0e", lineHeight: 1.5 }}>
            ⏱ Payouts are processed within 2–3 business days after admin approval.
          </div>
          {error && <div style={{ padding: "10px 14px", borderRadius: "8px", background: "#FEF2F2", border: "1px solid #FECACA", color: "#dc2626", fontSize: "13px" }}>⚠️ {error}</div>}
          <button onClick={handleRequest} disabled={loading} style={{ width: "100%", padding: "13px", borderRadius: "10px", background: loading ? "#E5E7EB" : `linear-gradient(135deg, ${BURG}, ${BURG_DARK})`, color: loading ? "#9CA3AF" : "#fff", border: "none", fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
            {loading ? "Submitting..." : "Request Payout →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────
export default function WalletPage() {
  const [balance, setBalance]           = useState<number>(0);
  const [summary, setSummary]           = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payouts, setPayouts]           = useState<Payout[]>([]);
  const [loading, setLoading]           = useState(true);
  const [txLoading, setTxLoading]       = useState(false);
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [total, setTotal]               = useState(0);
  const [activeTab, setActiveTab]       = useState<"transactions" | "payouts">("transactions");
  const [showTopUp, setShowTopUp]       = useState(false);
  const [showPayout, setShowPayout]     = useState(false);
  const [toast, setToast]               = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => setToast({ msg, type });

  const fetchBalance = useCallback(async () => {
    try {
      const [balRes, payRes] = await Promise.allSettled([
        api.get("/wallet/balance"),
        api.get("/payouts/my-payouts?limit=20"),
      ]);
      if (balRes.status === "fulfilled") {
        const d = balRes.value.data;
        setBalance(typeof d.balance === "number" ? d.balance : d.wallet?.balance ?? 0);
        setSummary(d);
      }
      if (payRes.status === "fulfilled") setPayouts(payRes.value.data.payouts ?? []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  const fetchTx = useCallback(async (p: number, smooth = false) => {
    smooth ? setTxLoading(true) : setLoading(true);
    try {
      const res = await api.get(`/wallet/transactions?page=${p}&limit=5`);
      setTransactions(res.data.transactions ?? []);
      setTotalPages(res.data.pagination?.totalPages ?? 1);
      setTotal(res.data.pagination?.total ?? 0);
      setPage(p);
    } catch (e) { console.error(e); }
    finally { smooth ? setTxLoading(false) : setLoading(false); }
  }, []);

  useEffect(() => {
    fetchBalance();
    fetchTx(1);
  }, [fetchBalance, fetchTx]);

  const goToPage = (p: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchTx(p, true);
  };

  const totalCredit = summary?.totalCredit ?? summary?.totalCredited ?? 0;
  const totalDebit  = summary?.totalDebit  ?? summary?.totalDebited  ?? 0;

  const payoutStatusStyle = (s: string) => ({
    PENDING:  { bg: "#FFFBEB", color: "#854d0e", border: "#FDE68A" },
    APPROVED: { bg: "#F0FDF4", color: "#15803d", border: "#BBF7D0" },
    REJECTED: { bg: "#FEF2F2", color: "#dc2626", border: "#FECACA" },
    PAID:     { bg: "#EFF6FF", color: "#1d4ed8", border: "#BFDBFE" },
  }[s] || { bg: "#F3F4F6", color: "#374151", border: "#E5E7EB" });

  const grouped = groupByDate(transactions);

  return (
    <DashPageWrapper>
    <div style={{ maxWidth: "860px" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {showTopUp  && <TopUpModal  onClose={() => setShowTopUp(false)}  onSuccess={(amt) => { setShowTopUp(false); fetchBalance(); fetchTx(1); showToast(`₹${amt.toLocaleString("en-IN")} added to your wallet!`); }} />}
      {showPayout && <PayoutModal balance={balance} onClose={() => setShowPayout(false)} onSuccess={() => { setShowPayout(false); fetchBalance(); showToast("Payout request submitted! Admin will process within 2–3 days."); }} />}

      {/* Page header */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{ fontSize: "12px", color: "#6B7280", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "4px" }}>Manage</p>
        <h1 style={{ fontSize: "26px", fontFamily: "Georgia, serif", color: "#1F2937", fontWeight: 400 }}>Wallet & Payments</h1>
      </div>

      {/* ── Balance card (white glass, deep red outline) ── */}
      <div style={{ background: "rgba(255,255,255,.72)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: `1.5px solid ${BURG}`, borderRadius: "20px", padding: "30px 34px", marginBottom: "20px", position: "relative", overflow: "hidden", boxShadow: "0 6px 24px rgba(155,0,32,.08)" }}>
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "200px", height: "200px", borderRadius: "50%", border: "1px solid rgba(155,0,32,.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-40px", left: "-40px", width: "150px", height: "150px", borderRadius: "50%", border: "1px solid rgba(155,0,32,.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(155,0,32,.05) 1px, transparent 1px)", backgroundSize: "22px 22px", pointerEvents: "none" }} />

        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "24px" }}>
          <div>
            <div style={{ fontSize: "10px", fontWeight: 700, color: BURG, opacity: .75, letterSpacing: ".18em", textTransform: "uppercase", marginBottom: "12px" }}>Available Balance</div>

            {loading ? (
              <div className="skeleton" style={{ width: "200px", height: "60px", borderRadius: "8px", marginBottom: "16px" }} />
            ) : (
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "clamp(38px, 6vw, 58px)", fontWeight: 700, color: "#1F2937", fontFamily: "Georgia, serif", lineHeight: 1 }}>
                  ₹{balance.toLocaleString("en-IN")}
                </div>
                <div style={{ fontSize: "13px", color: "#6B7280", marginTop: "6px" }}>Indian Rupee · INR</div>
              </div>
            )}

            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(16,185,129,.08)", border: "1px solid rgba(16,185,129,.25)" }}>
                <div style={{ fontSize: "10px", color: "#15803d", letterSpacing: ".08em", marginBottom: "4px" }}>CREDITED</div>
                <div style={{ fontSize: "17px", fontWeight: 700, color: "#15803d", fontFamily: "Georgia, serif" }}>+₹{totalCredit.toLocaleString("en-IN")}</div>
              </div>
              <div style={{ padding: "10px 14px", borderRadius: "10px", background: "rgba(155,0,32,.05)", border: "1px solid rgba(155,0,32,.18)" }}>
                <div style={{ fontSize: "10px", color: BURG, opacity: .75, letterSpacing: ".08em", marginBottom: "4px" }}>DEBITED</div>
                <div style={{ fontSize: "17px", fontWeight: 700, color: "#1F2937", fontFamily: "Georgia, serif" }}>-₹{totalDebit.toLocaleString("en-IN")}</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center" }}>
            <button onClick={() => setShowTopUp(true)} style={{ padding: "13px 30px", borderRadius: "10px", background: BURG, color: "#fff", border: "none", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 20px rgba(155,0,32,.22)", letterSpacing: ".02em", whiteSpace: "nowrap" }}>
              + Add Money
            </button>
            <button onClick={() => setShowPayout(true)} style={{ padding: "11px 30px", borderRadius: "10px", border: `1.5px solid ${BURG}`, color: BURG, background: "transparent", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", letterSpacing: ".02em", whiteSpace: "nowrap", transition: "all .2s" }}>
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* ── Summary mini-cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "24px" }}>
        {[
          { icon: "📊", label: "Transactions",   value: String(total),                                color: "rgba(59,130,246,.1)" },
          { icon: "💹", label: "Total Credited",  value: `₹${totalCredit.toLocaleString("en-IN")}`,    color: "rgba(16,185,129,.1)" },
          { icon: "📤", label: "Total Debited",   value: `₹${totalDebit.toLocaleString("en-IN")}`,     color: "rgba(239,68,68,.08)" },
          { icon: "🔄", label: "Payouts",         value: String(payouts.length),                        color: "rgba(155,0,32,.08)" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "14px", padding: "15px 18px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", marginBottom: "10px" }}>{s.icon}</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#1F2937", fontFamily: "Georgia, serif", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "4px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: "4px", background: "#F3F4F6", padding: "4px", borderRadius: "10px", marginBottom: "16px", width: "fit-content" }}>
        {(["transactions", "payouts"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "8px 20px", borderRadius: "7px", border: "none", background: activeTab === tab ? "#fff" : "transparent", color: activeTab === tab ? "#1F2937" : "#6B7280", fontSize: "13px", fontWeight: activeTab === tab ? 600 : 400, cursor: "pointer", fontFamily: "inherit", boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,.1)" : "none", transition: "all .2s" }}>
            {tab === "transactions" ? "💳 Transactions" : "💸 Payouts"}
          </button>
        ))}
      </div>

      {/* ── Transaction timeline ── */}
      {activeTab === "transactions" && (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px", overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#1F2937", fontFamily: "Georgia, serif" }}>Transaction Timeline</h2>
              <p style={{ fontSize: "12px", color: "#6B7280", marginTop: "1px" }}>{total} total · Page {page} of {totalPages}</p>
            </div>
          </div>

          {(loading || txLoading) ? (
            <div style={{ opacity: txLoading ? .55 : 1, transition: "opacity .3s" }}>
              {[1,2,3,4,5].map(i => <SkeletonRow key={i} />)}
            </div>
          ) : transactions.length === 0 ? (
            <div style={{ padding: "56px", textAlign: "center" }}>
              <div style={{ fontSize: "44px", marginBottom: "14px" }}>💳</div>
              <p style={{ fontSize: "16px", fontWeight: 500, color: "#1F2937", marginBottom: "6px" }}>No transactions yet</p>
              <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "20px" }}>Add money to your wallet to get started</p>
              <button onClick={() => setShowTopUp(true)} style={{ padding: "10px 24px", borderRadius: "8px", background: `linear-gradient(135deg, ${BURG}, ${BURG_DARK})`, color: "#fff", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+ Add Money</button>
            </div>
          ) : (
            <>
              {Object.entries(grouped).map(([dateLabel, txs]) => (
                <div key={dateLabel}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 22px 8px", background: "#F9FAFB", borderBottom: "1px solid #F3F4F6" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: BURG, letterSpacing: ".06em", textTransform: "uppercase" }}>{dateLabel}</span>
                    <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
                    <span style={{ fontSize: "11px", color: "#9CA3AF" }}>{txs.length} transaction{txs.length > 1 ? "s" : ""}</span>
                  </div>

                  {txs.map((tx, i) => {
                    const isCredit = tx.type === "CREDIT";
                    const icon = categoryIcons[tx.category] || (isCredit ? "⬆️" : "⬇️");
                    return (
                      <div key={tx._id} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 22px", borderBottom: i < txs.length - 1 ? "1px solid #F3F4F6" : "none", transition: "background .15s" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: isCredit ? "rgba(16,185,129,.1)" : "rgba(239,68,68,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0, border: `1px solid ${isCredit ? "rgba(16,185,129,.15)" : "rgba(239,68,68,.12)"}` }}>
                          {icon}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "14px", fontWeight: 500, color: "#1F2937", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tx.description}</div>
                          <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "3px", display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                            <span>{new Date(tx.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                            <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#D1D5DB", flexShrink: 0 }} />
                            <span style={{ padding: "1px 7px", borderRadius: "99px", background: "rgba(155,0,32,.08)", color: BURG, fontSize: "10px", fontWeight: 700 }}>{tx.category}</span>
                          </div>
                        </div>

                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: "16px", fontWeight: 700, color: isCredit ? "#15803d" : "#dc2626", fontFamily: "Georgia, serif" }}>
                            {isCredit ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                          </div>
                          <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "2px" }}>Bal ₹{(tx.balance ?? 0).toLocaleString("en-IN")}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

              {totalPages > 1 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "16px", borderTop: "1px solid #F3F4F6" }}>
                  <button onClick={() => goToPage(1)} disabled={page === 1} style={{ padding: "5px 10px", borderRadius: "6px", border: "1px solid #E5E7EB", background: "transparent", color: page === 1 ? "#D1D5DB" : "#374151", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "12px", fontFamily: "inherit" }}>«</button>
                  <button onClick={() => goToPage(page - 1)} disabled={page === 1} style={{ padding: "5px 13px", borderRadius: "6px", border: "1px solid #E5E7EB", background: "transparent", color: page === 1 ? "#D1D5DB" : "#1F2937", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "13px", fontFamily: "inherit" }}>← Prev</button>
                  <span style={{ fontSize: "13px", color: "#6B7280", padding: "0 8px" }}>Page {page} of {totalPages}</span>
                  <button onClick={() => goToPage(page + 1)} disabled={page === totalPages} style={{ padding: "5px 13px", borderRadius: "6px", border: "1px solid #E5E7EB", background: "transparent", color: page === totalPages ? "#D1D5DB" : "#1F2937", cursor: page === totalPages ? "not-allowed" : "pointer", fontSize: "13px", fontFamily: "inherit" }}>Next →</button>
                  <button onClick={() => goToPage(totalPages)} disabled={page === totalPages} style={{ padding: "5px 10px", borderRadius: "6px", border: "1px solid #E5E7EB", background: "transparent", color: page === totalPages ? "#D1D5DB" : "#374151", cursor: page === totalPages ? "not-allowed" : "pointer", fontSize: "12px", fontFamily: "inherit" }}>»</button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Payouts tab ── */}
      {activeTab === "payouts" && (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "16px", overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#1F2937", fontFamily: "Georgia, serif" }}>Payout Requests</h2>
              <p style={{ fontSize: "12px", color: "#6B7280", marginTop: "1px" }}>Your withdrawal history</p>
            </div>
            <button onClick={() => setShowPayout(true)} style={{ padding: "8px 16px", borderRadius: "8px", background: `linear-gradient(135deg, ${BURG}, ${BURG_DARK})`, color: "#fff", border: "none", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+ Request Payout</button>
          </div>
          {loading ? (
            <div style={{ padding: "16px 22px" }}>
              {[1,2].map(i => <SkeletonRow key={i} />)}
            </div>
          ) : payouts.length === 0 ? (
            <div style={{ padding: "52px", textAlign: "center" }}>
              <div style={{ fontSize: "44px", marginBottom: "14px" }}>💸</div>
              <p style={{ fontSize: "16px", fontWeight: 500, color: "#1F2937", marginBottom: "6px" }}>No payout requests yet</p>
              <p style={{ fontSize: "13px", color: "#6B7280" }}>Request a withdrawal once you have balance</p>
            </div>
          ) : (
            payouts.map((p, i) => {
              const sc = payoutStatusStyle(p.status);
              return (
                <div key={p._id} style={{ padding: "16px 22px", borderBottom: i < payouts.length - 1 ? "1px solid #F3F4F6" : "none", display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(155,0,32,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>💸</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                      <div>
                        <div style={{ fontSize: "16px", fontWeight: 700, color: "#1F2937", fontFamily: "Georgia, serif" }}>₹{p.amount.toLocaleString("en-IN")}</div>
                        <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "3px" }}>{p.bankDetails?.bankName} · ****{p.bankDetails?.accountNumber?.slice(-4)}</div>
                        <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "2px" }}>{new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                      </div>
                      <span style={{ padding: "4px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: 700, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, alignSelf: "flex-start" }}>{p.status}</span>
                    </div>
                    {p.adminNote && (
                      <div style={{ marginTop: "8px", padding: "8px 12px", borderRadius: "8px", background: p.status === "REJECTED" ? "#FEF2F2" : "#F0FDF4", border: `1px solid ${p.status === "REJECTED" ? "#FECACA" : "#BBF7D0"}`, fontSize: "12px", color: p.status === "REJECTED" ? "#dc2626" : "#15803d" }}>
                        💬 Admin: {p.adminNote}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      <style>{`
        @keyframes scaleIn   { from{opacity:0;transform:scale(.93)} to{opacity:1;transform:scale(1)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        input::placeholder   { color:#9CA3AF; }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; margin:0; }
        input:focus { border-color:${BURG} !important; }
      `}</style>
    </div>
    </DashPageWrapper>
  );
}
