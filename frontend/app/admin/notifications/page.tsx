"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";

type Client = { _id: string; name: string; phone: string; email?: string; totalOrders: number };

function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 5000); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 9999, padding: "12px 16px", borderRadius: "12px", background: type === "success" ? "#F0FDF4" : "#FEF2F2", border: `1px solid ${type === "success" ? "#BBF7D0" : "#FECACA"}`, color: type === "success" ? "#15803d" : "#dc2626", fontSize: "13px", fontWeight: 500, display: "flex", alignItems: "center", gap: "10px", maxWidth: "400px", fontFamily: "inherit" }}>
      {type === "success" ? "✅" : "❌"} <span style={{ flex: 1 }}>{msg}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "17px", color: "inherit", opacity: .6 }}>×</button>
    </div>
  );
}

const TEMPLATES = [
  { value: "payment_reminder", label: "Payment Reminder", body: "Dear {name}, this is a reminder that your payment is due. Please clear the outstanding amount at your earliest convenience.\n\nThank you,\nSanskriti Team" },
  { value: "order_update",     label: "Order Update",     body: "Dear {name}, your order has been updated. Please login to your account to check the latest status.\n\nThank you,\nSanskriti Team" },
  { value: "new_arrival",      label: "New Arrivals",     body: "Dear {name}, we have exciting new antique arrivals at Sanskriti! Visit our gallery to explore the latest pieces.\n\nWarm regards,\nSanskriti Team" },
  { value: "custom",           label: "Custom Message",   body: "" },
];

export default function AdminNotificationsPage() {
  const [clients, setClients]         = useState<Client[]>([]);
  const [selected, setSelected]       = useState<Set<string>>(new Set());
  const [channel, setChannel]         = useState<"email" | "both">("email");
  const [template, setTemplate]       = useState(TEMPLATES[0].value);
  const [subject, setSubject]         = useState("Payment Reminder from Sanskriti");
  const [body, setBody]               = useState(TEMPLATES[0].body);
  const [search, setSearch]           = useState("");
  const [sending, setSending]         = useState(false);
  const [results, setResults]         = useState<any>(null);
  const [toast, setToast]             = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [selectAll, setSelectAll]     = useState(false);

  useEffect(() => {
    api.get(`/admin/notify/clients?search=${search}`)
      .then(r => setClients(r.data.clients || []))
      .catch(console.error);
  }, [search]);

  const toggleClient = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) { setSelected(new Set()); setSelectAll(false); }
    else { setSelected(new Set(clients.map(c => c._id))); setSelectAll(true); }
  };

  const handleTemplateChange = (val: string) => {
    setTemplate(val);
    const t = TEMPLATES.find(t => t.value === val);
    if (t && t.body) setBody(t.body);
  };

  const send = async () => {
    if (selected.size === 0) { setToast({ msg: "Select at least one client", type: "error" }); return; }
    if (!subject.trim() || !body.trim()) { setToast({ msg: "Subject and message are required", type: "error" }); return; }
    setSending(true);
    setResults(null);
    try {
      const payload = { clientIds: Array.from(selected), subject, body };
      const res = await api.post("/admin/notify/email-bulk", payload);
      setResults(res.data.results);
      setToast({ msg: `✅ Sent to ${res.data.results.sent} clients`, type: "success" });
      setSelected(new Set());
      setSelectAll(false);
    } catch (e: any) {
      setToast({ msg: e.response?.data?.message || "Failed to send", type: "error" });
    }
    setSending(false);
  };

  return (
    <div style={{ maxWidth: "1100px" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ marginBottom: "24px" }}>
        <p style={{ fontSize: "12px", color: "#888", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "4px" }}>Admin</p>
        <h1 style={{ fontSize: "26px", fontFamily: "Georgia,serif", color: "#111", fontWeight: 400 }}>Bulk Notifications</h1>
        <p style={{ fontSize: "14px", color: "#888", marginTop: "3px" }}>Send emails to multiple clients at once</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "20px", alignItems: "start" }}>

        {/* Left — client selector */}
        <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "16px", overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>Select Clients</div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "12px", color: "#888" }}>{selected.size} selected</span>
              <button onClick={handleSelectAll} style={{ fontSize: "12px", color: "#7a001a", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                {selectAll ? "Deselect All" : "Select All"}
              </button>
            </div>
          </div>

          <div style={{ padding: "10px 14px", borderBottom: "1px solid #f0f0f0" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..." style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #f0f0f0", fontSize: "13px", color: "#111", background: "#f9f9f9", outline: "none", fontFamily: "inherit" }} />
          </div>

          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {clients.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>No clients found</div>
            ) : clients.map((c, i) => (
              <div key={c._id} onClick={() => toggleClient(c._id)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "11px 16px", borderBottom: i < clients.length - 1 ? "1px solid #f5f5f5" : "none", cursor: "pointer", background: selected.has(c._id) ? "rgba(155,0,32,.06)" : "transparent", transition: "background .1s" }}>
                <div style={{ width: "18px", height: "18px", borderRadius: "4px", border: `2px solid ${selected.has(c._id) ? "#9B0020" : "#f0f0f0"}`, background: selected.has(c._id) ? "#9B0020" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .15s" }}>
                  {selected.has(c._id) && <span style={{ color: "#111", fontSize: "11px", fontWeight: 700 }}>✓</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "#111" }}>{c.name}</div>
                  <div style={{ fontSize: "11px", color: "#888" }}>{c.phone}{c.email ? ` · ${c.email}` : " · no email"}</div>
                </div>
                <div style={{ fontSize: "11px", color: "#888", flexShrink: 0 }}>{c.totalOrders} orders</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — compose */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* Template picker */}
          <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "14px", padding: "18px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#888", letterSpacing: ".06em", marginBottom: "10px" }}>TEMPLATE</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {TEMPLATES.map(t => (
                <button key={t.value} onClick={() => handleTemplateChange(t.value)} style={{ padding: "9px 14px", borderRadius: "8px", border: `1.5px solid ${template === t.value ? "#9B0020" : "#f0f0f0"}`, background: template === t.value ? "rgba(155,0,32,.08)" : "transparent", color: template === t.value ? "#7a001a" : "#7a001a", fontSize: "13px", fontWeight: template === t.value ? 600 : 400, cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Compose */}
          <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: "14px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#888", letterSpacing: ".06em" }}>COMPOSE</div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: 600, color: "#888", display: "block", marginBottom: "5px" }}>SUBJECT</label>
              <input value={subject} onChange={e => setSubject(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #f0f0f0", fontSize: "13px", color: "#111", background: "#f9f9f9", outline: "none", fontFamily: "inherit" }} />
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: 600, color: "#888", display: "block", marginBottom: "5px" }}>MESSAGE</label>
              <textarea value={body} onChange={e => setBody(e.target.value)} rows={6} style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #f0f0f0", fontSize: "13px", color: "#111", background: "#f9f9f9", outline: "none", resize: "vertical", fontFamily: "inherit" }} />
              <div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>Use {"{name}"} to personalize with client name</div>
            </div>
          </div>

          {/* Preview */}
          {selected.size > 0 && (
            <div style={{ padding: "12px 14px", background: "#f9f9f9", borderRadius: "10px", border: "1px solid #f0f0f0" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#7a001a" }}>
                📤 Ready to send to <strong>{selected.size}</strong> client{selected.size > 1 ? "s" : ""} via email
              </div>
            </div>
          )}

          {/* Send button */}
          <button onClick={send} disabled={sending || selected.size === 0} style={{ padding: "13px", borderRadius: "10px", background: sending || selected.size === 0 ? "#f0f0f0" : "linear-gradient(135deg,#9B0020,#7a001a)", color: sending || selected.size === 0 ? "#888" : "#111", border: "none", fontSize: "14px", fontWeight: 700, cursor: sending || selected.size === 0 ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "all .2s" }}>
            {sending ? "Sending..." : `Send Email to ${selected.size || 0} Client${selected.size !== 1 ? "s" : ""}`}
          </button>

          {/* Results */}
          {results && (
            <div style={{ padding: "14px", background: "#fff", border: "1px solid #f0f0f0", borderRadius: "10px" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#111", marginBottom: "8px" }}>Send Results</div>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1, padding: "10px", background: "#F0FDF4", borderRadius: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: "20px", fontWeight: 700, color: "#15803d" }}>{results.sent}</div>
                  <div style={{ fontSize: "11px", color: "#15803d" }}>Sent</div>
                </div>
                <div style={{ flex: 1, padding: "10px", background: results.failed > 0 ? "#FEF2F2" : "#F5F5F5", borderRadius: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: "20px", fontWeight: 700, color: results.failed > 0 ? "#dc2626" : "#9ca3af" }}>{results.failed}</div>
                  <div style={{ fontSize: "11px", color: results.failed > 0 ? "#dc2626" : "#9ca3af" }}>Failed</div>
                </div>
              </div>
              {results.errors?.length > 0 && (
                <div style={{ marginTop: "10px", fontSize: "11px", color: "#888" }}>
                  Failed: {results.errors.slice(0, 3).map((e: any) => e.name).join(", ")}
                  {results.errors.length > 3 ? ` +${results.errors.length - 3} more` : ""}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`input::placeholder,textarea::placeholder{color:#C4A882}input:focus,textarea:focus{border-color:#9B0020!important}`}</style>
    </div>
  );
}
