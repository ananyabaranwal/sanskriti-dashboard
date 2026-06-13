"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

const BURG = "#9B0020";

function Toast({ msg, type, onClose }: { msg: string; type: "success"|"error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position:"fixed", top:"24px", right:"24px", zIndex:9999, padding:"12px 16px", borderRadius:"12px", background:type==="success"?"#F0FDF4":"#FEF2F2", border:`1px solid ${type==="success"?"#BBF7D0":"#FECACA"}`, color:type==="success"?"#15803d":"#dc2626", fontSize:"13px", fontWeight:500, display:"flex", alignItems:"center", gap:"10px", maxWidth:"400px", fontFamily:"inherit" }}>
      {type==="success"?"✅":"❌"} <span style={{ flex:1 }}>{msg}</span>
      <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"17px", color:"inherit", opacity:.6 }}>×</button>
    </div>
  );
}

// ── Tab 1: Duplicate Orders ───────────────────────────────────
function DuplicatesTab() {
  const [data,    setData]    = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hours,   setHours]   = useState(24);

  const check = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/duplicates?hours=${hours}`);
      setData(res.data);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"20px", flexWrap:"wrap" }}>
        <select value={hours} onChange={e => setHours(Number(e.target.value))} style={{ padding:"8px 12px", borderRadius:"8px", border:"1.5px solid #e5e7eb", fontSize:"13px", fontFamily:"inherit" }}>
          <option value={6}>Last 6 hours</option>
          <option value={24}>Last 24 hours</option>
          <option value={48}>Last 48 hours</option>
          <option value={168}>Last 7 days</option>
        </select>
        <button onClick={check} disabled={loading} style={{ padding:"9px 20px", borderRadius:"8px", background:BURG, color:"#fff", border:"none", fontSize:"13px", fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
          {loading ? "Checking..." : "Scan for Duplicates"}
        </button>
      </div>

      {data && (
        <div>
          <div style={{ padding:"12px 16px", borderRadius:"10px", background:data.count===0?"#F0FDF4":"#FEF2F2", border:`1px solid ${data.count===0?"#BBF7D0":"#FECACA"}`, marginBottom:"16px", fontSize:"13px", color:data.count===0?"#15803d":"#dc2626", fontWeight:600 }}>
            {data.count===0 ? `✅ No duplicates found in ${data.checkedOrders} orders` : `⚠️ Found ${data.count} duplicate groups in ${data.checkedOrders} orders`}
          </div>

          {data.duplicates?.map((d: any, i: number) => (
            <div key={i} style={{ border:"1.5px solid #FECACA", borderRadius:"12px", marginBottom:"12px", overflow:"hidden" }}>
              <div style={{ padding:"12px 16px", background:"#FEF2F2", borderBottom:"1px solid #FECACA" }}>
                <div style={{ fontSize:"13px", fontWeight:600, color:"#dc2626" }}>🔴 {d.count} duplicate orders — {d.buyerName} ({d.buyerPhone})</div>
                <div style={{ fontSize:"11px", color:"#888", marginTop:"2px" }}>Items: {d.itemsSummary}</div>
              </div>
              {d.orders.map((o: any) => (
                <div key={o._id} style={{ display:"flex", justifyContent:"space-between", padding:"10px 16px", borderBottom:"1px solid #f5f5f5", fontSize:"13px" }}>
                  <span style={{ fontWeight:600, color:"#111" }}>{o.orderNumber}</span>
                  <span style={{ color:"#888" }}>₹{o.total?.toLocaleString("en-IN")}</span>
                  <span style={{ color:"#888" }}>{o.status}</span>
                  <span style={{ color:"#aaa" }}>{new Date(o.createdAt).toLocaleDateString("en-IN")}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tab 2: Roles Management ───────────────────────────────────
function RolesTab() {
  const [staff,   setStaff]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [toast,   setToast]   = useState<any>(null);
  const [form,    setForm]    = useState({ name:"", email:"", phone:"", password:"", role:"manager" });
  const [saving,  setSaving]  = useState(false);

  const fetchStaff = useCallback(async () => {
    try { const r = await api.get("/admin/roles"); setStaff(r.data.staff || []); }
    catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  const addStaff = async () => {
    if (!form.name || !form.email || !form.password) { setToast({ msg:"Name, email and password required", type:"error" }); return; }
    setSaving(true);
    try {
      await api.post("/admin/roles", form);
      setToast({ msg:`${form.role} account created`, type:"success" });
      setShowAdd(false);
      setForm({ name:"", email:"", phone:"", password:"", role:"manager" });
      fetchStaff();
    } catch(e: any) { setToast({ msg:e.response?.data?.message||"Failed", type:"error" }); }
    setSaving(false);
  };

  const deleteStaff = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}'s account?`)) return;
    try {
      await api.delete(`/admin/roles/${id}`);
      setToast({ msg:"Account deleted", type:"success" });
      fetchStaff();
    } catch(e: any) { setToast({ msg:e.response?.data?.message||"Failed", type:"error" }); }
  };

  const ROLE_COLORS: Record<string,string> = { admin:"#7c3aed", manager:"#0369a1", employee:"#15803d" };

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
        <p style={{ fontSize:"13px", color:"#888" }}>Manage who can access the admin panel</p>
        <button onClick={() => setShowAdd(!showAdd)} style={{ padding:"9px 20px", borderRadius:"8px", background:BURG, color:"#fff", border:"none", fontSize:"13px", fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
          + Add Staff
        </button>
      </div>

      {showAdd && (
        <div style={{ padding:"20px", borderRadius:"12px", border:"1.5px solid #e5e7eb", marginBottom:"20px", background:"#fafafa" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"12px" }}>
            {[["Name","name","text"],["Email","email","email"],["Phone","phone","text"],["Password","password","password"]].map(([label,key,type]) => (
              <div key={key}>
                <label style={{ fontSize:"11px", fontWeight:600, color:"#888", display:"block", marginBottom:"4px" }}>{label}</label>
                <input type={type} value={(form as any)[key]} onChange={e => setForm(p => ({...p,[key]:e.target.value}))} style={{ width:"100%", padding:"8px 12px", borderRadius:"8px", border:"1.5px solid #e5e7eb", fontSize:"13px", fontFamily:"inherit" }} />
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
            <select value={form.role} onChange={e => setForm(p => ({...p,role:e.target.value}))} style={{ padding:"8px 12px", borderRadius:"8px", border:"1.5px solid #e5e7eb", fontSize:"13px", fontFamily:"inherit" }}>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
            <button onClick={addStaff} disabled={saving} style={{ padding:"9px 20px", borderRadius:"8px", background:BURG, color:"#fff", border:"none", fontSize:"13px", fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
              {saving ? "Creating..." : "Create Account"}
            </button>
            <button onClick={() => setShowAdd(false)} style={{ padding:"9px 16px", borderRadius:"8px", border:"1.5px solid #e5e7eb", background:"#fff", fontSize:"13px", cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? <div style={{ color:"#aaa", fontSize:"13px" }}>Loading...</div> : (
        <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
          {staff.map(s => (
            <div key={s._id} style={{ display:"flex", alignItems:"center", gap:"14px", padding:"14px 16px", borderRadius:"10px", border:"1px solid #e5e7eb", background:"#fff" }}>
              <div style={{ width:"38px", height:"38px", borderRadius:"50%", background:`${ROLE_COLORS[s.role]}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px", fontWeight:700, color:ROLE_COLORS[s.role], flexShrink:0 }}>{s.name.charAt(0).toUpperCase()}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:"14px", fontWeight:600, color:"#111" }}>{s.name}</div>
                <div style={{ fontSize:"12px", color:"#888" }}>{s.email}</div>
              </div>
              <span style={{ padding:"3px 10px", borderRadius:"99px", fontSize:"11px", fontWeight:700, background:`${ROLE_COLORS[s.role]}18`, color:ROLE_COLORS[s.role], textTransform:"uppercase" }}>{s.role}</span>
              <span style={{ padding:"3px 10px", borderRadius:"99px", fontSize:"11px", fontWeight:600, background:s.status==="active"?"#f0fdf4":"#fef2f2", color:s.status==="active"?"#15803d":"#dc2626" }}>{s.status}</span>
              {s.role !== "admin" && (
                <button onClick={() => deleteStaff(s._id, s.name)} style={{ padding:"6px 12px", borderRadius:"7px", border:"1px solid #FECACA", background:"#FEF2F2", color:"#dc2626", fontSize:"12px", cursor:"pointer", fontFamily:"inherit" }}>Remove</button>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop:"20px", padding:"14px 16px", borderRadius:"10px", background:"#f8f8f8", border:"1px solid #e5e7eb" }}>
        <div style={{ fontSize:"12px", fontWeight:700, color:"#111", marginBottom:"8px" }}>Role Permissions</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"8px", fontSize:"12px", color:"#666" }}>
          <div><strong style={{ color:ROLE_COLORS.admin }}>Admin</strong><br/>Full access to everything</div>
          <div><strong style={{ color:ROLE_COLORS.manager }}>Manager</strong><br/>Orders, clients, billing, reports, export</div>
          <div><strong style={{ color:ROLE_COLORS.employee }}>Employee</strong><br/>Orders, clients, inventory, search</div>
        </div>
      </div>
    </div>
  );
}

// ── Tab 3: Bulk Invoice ───────────────────────────────────────
function BulkInvoiceTab() {
  const [pending,    setPending]    = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [selected,   setSelected]   = useState<Set<string>>(new Set());
  const [generating, setGenerating] = useState(false);
  const [result,     setResult]     = useState<any>(null);
  const [toast,      setToast]      = useState<any>(null);

  useEffect(() => {
    api.get("/admin/bulk-invoice/pending")
      .then(r => setPending(r.data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: string) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const selectAll = () => setSelected(prev => prev.size === pending.length ? new Set() : new Set(pending.map((o: any) => o._id)));

  const generate = async () => {
    if (selected.size === 0) { setToast({ msg:"Select at least one order", type:"error" }); return; }
    setGenerating(true);
    try {
      const res = await api.post("/admin/bulk-invoice/generate", { orderIds: Array.from(selected) });
      setResult(res.data.results);
      setToast({ msg:`Generated ${res.data.results.generated} invoices`, type:"success" });
      setPending(prev => prev.filter((o: any) => !selected.has(o._id)));
      setSelected(new Set());
    } catch(e: any) { setToast({ msg:e.response?.data?.message||"Failed", type:"error" }); }
    setGenerating(false);
  };

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
        <p style={{ fontSize:"13px", color:"#888" }}>{pending.length} orders without invoices</p>
        <div style={{ display:"flex", gap:"10px" }}>
          <button onClick={selectAll} style={{ padding:"8px 16px", borderRadius:"8px", border:"1.5px solid #e5e7eb", background:"#fff", fontSize:"13px", cursor:"pointer", fontFamily:"inherit" }}>
            {selected.size === pending.length ? "Deselect All" : "Select All"}
          </button>
          <button onClick={generate} disabled={generating || selected.size === 0} style={{ padding:"9px 20px", borderRadius:"8px", background:generating||selected.size===0?"#e5e7eb":BURG, color:generating||selected.size===0?"#aaa":"#fff", border:"none", fontSize:"13px", fontWeight:600, cursor:generating||selected.size===0?"not-allowed":"pointer", fontFamily:"inherit" }}>
            {generating ? "Generating..." : `Generate ${selected.size} Invoices`}
          </button>
        </div>
      </div>

      {result && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px", marginBottom:"16px" }}>
          {[["Generated",result.generated,"#15803d"],["Skipped",result.skipped,"#d97706"],["Failed",result.failed,"#dc2626"]].map(([l,v,c]) => (
            <div key={String(l)} style={{ padding:"12px 16px", borderRadius:"10px", background:`${c}11`, border:`1px solid ${c}33`, textAlign:"center" }}>
              <div style={{ fontSize:"22px", fontWeight:700, color:String(c) }}>{String(v)}</div>
              <div style={{ fontSize:"12px", color:"#888" }}>{String(l)}</div>
            </div>
          ))}
        </div>
      )}

      {loading ? <div style={{ color:"#aaa", fontSize:"13px" }}>Loading...</div> : pending.length === 0 ? (
        <div style={{ textAlign:"center", padding:"40px", color:"#aaa", fontSize:"13px" }}>All orders have invoices ✅</div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
          {pending.map((o: any) => (
            <div key={o._id} onClick={() => toggle(o._id)} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"11px 14px", borderRadius:"10px", border:`1.5px solid ${selected.has(o._id)?"#C9A84C":"#e5e7eb"}`, background:selected.has(o._id)?"rgba(201,168,76,.05)":"#fff", cursor:"pointer" }}>
              <div style={{ width:"18px", height:"18px", borderRadius:"4px", border:`2px solid ${selected.has(o._id)?"#C9A84C":"#e5e7eb"}`, background:selected.has(o._id)?"#C9A84C":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {selected.has(o._id) && <span style={{ color:"#fff", fontSize:"11px", fontWeight:700 }}>✓</span>}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:"13px", fontWeight:600, color:"#111" }}>{o.orderNumber}</div>
                <div style={{ fontSize:"11px", color:"#888" }}>{o.buyer?.name} · {o.buyer?.phone}</div>
              </div>
              <div style={{ fontSize:"13px", fontWeight:700, color:"#111" }}>₹{o.total?.toLocaleString("en-IN")}</div>
              <div style={{ fontSize:"11px", color:"#888" }}>{new Date(o.createdAt).toLocaleDateString("en-IN")}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tab 4: Reorder Suggestions ────────────────────────────────
function ReorderTab() {
  const [data,    setData]    = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/reorder/suggestions")
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const URGENCY: Record<string,{bg:string;color:string;label:string}> = {
    critical: { bg:"#FEF2F2", color:"#dc2626", label:"CRITICAL" },
    high:     { bg:"#FFF7ED", color:"#d97706", label:"HIGH"     },
    medium:   { bg:"#FEFCE8", color:"#ca8a04", label:"MEDIUM"   },
    low:      { bg:"#F0FDF4", color:"#15803d", label:"LOW"      },
  };

  return (
    <div>
      {loading ? <div style={{ color:"#aaa", fontSize:"13px" }}>Loading suggestions...</div> : !data?.count ? (
        <div style={{ textAlign:"center", padding:"40px", color:"#aaa", fontSize:"13px" }}>No reorder suggestions — all stock is healthy ✅</div>
      ) : (
        <>
          {/* Summary cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"10px", marginBottom:"20px" }}>
            {[["critical","#dc2626"],["high","#d97706"],["medium","#ca8a04"],["low","#15803d"]].map(([k,c]) => (
              <div key={k} style={{ padding:"12px 14px", borderRadius:"10px", background:`${c}11`, border:`1px solid ${c}33`, textAlign:"center" }}>
                <div style={{ fontSize:"22px", fontWeight:700, color:c }}>{data.summary[k]}</div>
                <div style={{ fontSize:"11px", color:"#888", textTransform:"uppercase", letterSpacing:".06em" }}>{k}</div>
              </div>
            ))}
          </div>

          <div style={{ padding:"10px 14px", borderRadius:"8px", background:"#f8f8f8", border:"1px solid #e5e7eb", marginBottom:"16px", fontSize:"13px", color:"#666" }}>
            💰 Estimated restock cost: <strong style={{ color:"#111" }}>₹{data.summary.totalEstimatedCost?.toLocaleString("en-IN")}</strong>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {data.suggestions.map((p: any) => {
              const u = URGENCY[p.urgency];
              return (
                <div key={p._id} style={{ display:"grid", gridTemplateColumns:"1fr auto auto auto auto", gap:"12px", alignItems:"center", padding:"14px 16px", borderRadius:"10px", border:`1.5px solid ${u.bg}`, background:"#fff" }}>
                  <div>
                    <div style={{ fontSize:"13px", fontWeight:600, color:"#111" }}>{p.name}</div>
                    <div style={{ fontSize:"11px", color:"#888" }}>{p.sku || "No SKU"} · {p.category || "No category"}</div>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:"16px", fontWeight:700, color:p.currentStock===0?"#dc2626":"#111" }}>{p.currentStock}</div>
                    <div style={{ fontSize:"10px", color:"#aaa" }}>In stock</div>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:"14px", fontWeight:600, color:"#C9A84C" }}>{p.suggestedQty}</div>
                    <div style={{ fontSize:"10px", color:"#aaa" }}>Reorder qty</div>
                  </div>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:"13px", fontWeight:600, color:"#111" }}>{p.soldLast30}</div>
                    <div style={{ fontSize:"10px", color:"#aaa" }}>Sold/30d</div>
                  </div>
                  <span style={{ padding:"4px 10px", borderRadius:"99px", fontSize:"10px", fontWeight:700, background:u.bg, color:u.color, whiteSpace:"nowrap" }}>{u.label}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ── Main Settings Page ────────────────────────────────────────
const TABS = [
  { key:"duplicates",  label:"Duplicate Orders", icon:"⚠️" },
  { key:"roles",       label:"Roles & Staff",    icon:"👤" },
  { key:"bulk-invoice",label:"Bulk Invoice",     icon:"🧾" },
  { key:"reorder",     label:"Reorder Alerts",   icon:"📦" },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("duplicates");

  return (
    <div style={{ maxWidth:"1000px" }}>
      <div style={{ marginBottom:"24px" }}>
        <p style={{ fontSize:"12px", color:"#9ca3af", letterSpacing:".1em", textTransform:"uppercase", marginBottom:"4px" }}>Admin</p>
        <h1 style={{ fontSize:"26px", fontFamily:"Georgia,serif", color:"#111827", fontWeight:400 }}>Settings & Tools</h1>
      </div>

      {/* Tab bar */}
      <div style={{ display:"flex", gap:"6px", marginBottom:"24px", borderBottom:"1px solid #e5e7eb", paddingBottom:"0" }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ padding:"10px 18px", borderRadius:"8px 8px 0 0", border:"none", borderBottom:activeTab===t.key?`2px solid ${BURG}`:"2px solid transparent", background:activeTab===t.key?"#fff":"transparent", color:activeTab===t.key?BURG:"#6b7280", fontSize:"13px", fontWeight:activeTab===t.key?600:500, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:"6px" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #e5e7eb", padding:"24px" }}>
        {activeTab === "duplicates"   && <DuplicatesTab />}
        {activeTab === "roles"        && <RolesTab />}
        {activeTab === "bulk-invoice" && <BulkInvoiceTab />}
        {activeTab === "reorder"      && <ReorderTab />}
      </div>
    </div>
  );
}
