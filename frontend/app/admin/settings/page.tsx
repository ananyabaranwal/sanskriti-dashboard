"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

function Toast({ msg, type, onClose }: { msg:string; type:"success"|"error"|"info"; onClose:()=>void }) {
  useEffect(()=>{ const t=setTimeout(onClose,4000); return ()=>clearTimeout(t); },[]);
  const c={success:{bg:"#F0FDF4",border:"#BBF7D0",color:"#15803d",icon:"✅"},error:{bg:"#FEF2F2",border:"#FECACA",color:"#dc2626",icon:"❌"},info:{bg:"#EFF6FF",border:"#BFDBFE",color:"#1d4ed8",icon:"💡"}}[type];
  return (
    <div style={{position:"fixed",top:"24px",right:"24px",zIndex:9999,padding:"12px 16px",borderRadius:"12px",background:c.bg,border:`1px solid ${c.border}`,color:c.color,fontSize:"13px",fontWeight:500,boxShadow:"0 6px 24px rgba(0,0,0,.1)",display:"flex",alignItems:"center",gap:"10px",maxWidth:"360px",animation:"slideDown .3s ease",fontFamily:"inherit"}}>
      <span>{c.icon}</span><span style={{flex:1,lineHeight:1.5}}>{msg}</span>
      <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:"17px",color:"inherit",padding:0,opacity:.6}}>×</button>
    </div>
  );
}

function Toggle({ checked, onChange, label, desc }: { checked:boolean; onChange:(v:boolean)=>void; label:string; desc?:string }) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 0",borderBottom:"1px solid #F0E4C0"}}>
      <div><div style={{fontSize:"14px",fontWeight:500,color:"#2C1810"}}>{label}</div>{desc&&<div style={{fontSize:"12px",color:"#A08060",marginTop:"2px"}}>{desc}</div>}</div>
      <button onClick={()=>onChange(!checked)} style={{width:"44px",height:"24px",borderRadius:"99px",background:checked?"linear-gradient(135deg,#C9A84C,#8B6914)":"#E8D5A3",border:"none",cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
        <span style={{position:"absolute",top:"2px",left:checked?"22px":"2px",width:"20px",height:"20px",borderRadius:"50%",background:"#fff",boxShadow:"0 1px 4px rgba(0,0,0,.15)",transition:"left .2s"}}/>
      </button>
    </div>
  );
}

const inp: React.CSSProperties = { width:"100%", padding:"10px 13px", borderRadius:"8px", border:"1.5px solid #E8D5A3", fontSize:"14px", color:"#2C1810", background:"#FBF7F0", outline:"none", fontFamily:"inherit", transition:"border-color .2s" };
const lbl: React.CSSProperties = { fontSize:"11px", fontWeight:700, color:"#6B4F12", display:"block", marginBottom:"5px", letterSpacing:".04em", textTransform:"uppercase" };

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"platform"|"commission"|"notifications"|"security">("platform");
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState<{msg:string;type:"success"|"error"|"info"}|null>(null);
  const showToast = (msg:string,type:"success"|"error"|"info"="success")=>setToast({msg,type});

  // Platform settings
  const [platform, setPlatform] = useState({
    siteName:        "Sanskriti The Antique",
    siteEmail:       "info@sanskriti.vyrelle.in",
    supportPhone:    "+91 98765 43210",
    gstNumber:       "09ABCDE1234F1Z5",
    address:         "456 Hazratganj, Lucknow, Uttar Pradesh 226001",
    minOrderAmount:  "500",
    maxOrderAmount:  "1000000",
    currency:        "INR",
    timezone:        "Asia/Kolkata",
  });

  // Commission settings
  const [commission, setCommission] = useState({
    platformFee:        "5",
    payoutFee:          "2",
    gstRate:            "18",
    minPayoutAmount:    "100",
    maxPayoutAmount:    "100000",
    payoutCycleDays:    "3",
    autoApproveBelow:   "1000",
  });

  // Notification toggles
  const [notif, setNotif] = useState({
    newSellerEmail:   true,
    kycSubmitEmail:   true,
    payoutRequestEmail: true,
    orderAlertEmail:  true,
    dailyReport:      false,
    weeklyReport:     true,
    smsAlerts:        false,
    slackWebhook:     false,
  });

  // Security settings
  const [security, setSecurity] = useState({
    require2FA:          false,
    sessionTimeout:      "60",
    maxLoginAttempts:    "5",
    allowedIPs:          "",
    maintenanceMode:     false,
    newRegistrations:    true,
    autoApproveKYC:      false,
  });

  // Password change
  const [pwForm, setPwForm] = useState({ current:"", newPw:"", confirm:"" });
  const [pwError, setPwError] = useState("");

  const save = async (section:string) => {
    setSaving(true);
    await new Promise(r=>setTimeout(r,800));
    showToast(`${section} settings saved successfully!`);
    setSaving(false);
  };

  const changePassword = async () => {
    setPwError("");
    if (!pwForm.current)        { setPwError("Current password required"); return; }
    if (pwForm.newPw.length<8)  { setPwError("New password must be 8+ characters"); return; }
    if (pwForm.newPw!==pwForm.confirm) { setPwError("Passwords do not match"); return; }
    setSaving(true);
    try {
      await api.patch("/seller/change-password", { currentPassword:pwForm.current, newPassword:pwForm.newPw });
      showToast("Admin password changed successfully!");
      setPwForm({current:"",newPw:"",confirm:""});
    } catch(e:any) { setPwError(e.response?.data?.message||"Password change failed"); }
    finally { setSaving(false); }
  };

  const tabs = [
    {id:"platform",      label:"Platform",      icon:"🏛️"},
    {id:"commission",    label:"Commission",    icon:"💰"},
    {id:"notifications", label:"Notifications", icon:"🔔"},
    {id:"security",      label:"Security",      icon:"🔒"},
  ] as const;

  return (
    <div style={{maxWidth:"800px"}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

      <div style={{marginBottom:"24px"}}>
        <p style={{fontSize:"12px",color:"#A08060",letterSpacing:".1em",textTransform:"uppercase",marginBottom:"4px"}}>Admin</p>
        <h1 style={{fontSize:"26px",fontFamily:"Georgia,serif",color:"#2C1810",fontWeight:400}}>Admin Settings</h1>
        <p style={{fontSize:"14px",color:"#A08060",marginTop:"3px"}}>Platform configuration and preferences</p>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:"4px",background:"#F0EBE3",padding:"4px",borderRadius:"10px",marginBottom:"22px"}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{flex:1,padding:"9px 10px",borderRadius:"7px",border:"none",background:activeTab===t.id?"#FFFDF9":"transparent",color:activeTab===t.id?"#2C1810":"#A08060",fontSize:"12px",fontWeight:activeTab===t.id?600:400,cursor:"pointer",fontFamily:"inherit",boxShadow:activeTab===t.id?"0 1px 4px rgba(61,43,31,.1)":"none",transition:"all .18s",display:"flex",alignItems:"center",justifyContent:"center",gap:"5px"}}>
            <span>{t.icon}</span><span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Platform Settings ── */}
      {activeTab==="platform"&&(
        <div style={{background:"#FFFDF9",border:"1px solid #E8D5A3",borderRadius:"16px",padding:"26px 28px"}}>
          <h2 style={{fontSize:"17px",fontFamily:"Georgia,serif",color:"#2C1810",marginBottom:"5px"}}>Platform Information</h2>
          <p style={{fontSize:"13px",color:"#A08060",marginBottom:"22px"}}>Core settings for Sanskriti The Antique</p>
          <div style={{display:"flex",flexDirection:"column",gap:"15px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
              <div><label style={lbl}>Site Name</label><input value={platform.siteName} onChange={e=>setPlatform({...platform,siteName:e.target.value})} style={inp}/></div>
              <div><label style={lbl}>Support Email</label><input value={platform.siteEmail} onChange={e=>setPlatform({...platform,siteEmail:e.target.value})} style={inp}/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
              <div><label style={lbl}>Support Phone</label><input value={platform.supportPhone} onChange={e=>setPlatform({...platform,supportPhone:e.target.value})} style={inp}/></div>
              <div><label style={lbl}>GSTIN</label><input value={platform.gstNumber} onChange={e=>setPlatform({...platform,gstNumber:e.target.value})} style={inp}/></div>
            </div>
            <div><label style={lbl}>Registered Address</label><input value={platform.address} onChange={e=>setPlatform({...platform,address:e.target.value})} style={inp}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"14px"}}>
              <div><label style={lbl}>Currency</label>
                <select value={platform.currency} onChange={e=>setPlatform({...platform,currency:e.target.value})} style={{...inp,cursor:"pointer"}}>
                  <option>INR</option><option>USD</option><option>EUR</option>
                </select>
              </div>
              <div><label style={lbl}>Min Order (₹)</label><input type="number" value={platform.minOrderAmount} onChange={e=>setPlatform({...platform,minOrderAmount:e.target.value})} style={inp}/></div>
              <div><label style={lbl}>Max Order (₹)</label><input type="number" value={platform.maxOrderAmount} onChange={e=>setPlatform({...platform,maxOrderAmount:e.target.value})} style={inp}/></div>
            </div>
          </div>
          <button onClick={()=>save("Platform")} disabled={saving} style={{marginTop:"20px",padding:"11px 28px",borderRadius:"8px",background:saving?"#E8D5A3":"linear-gradient(135deg,#C9A84C,#8B6914)",color:saving?"#A08060":"#2C1810",border:"none",fontSize:"14px",fontWeight:700,cursor:saving?"not-allowed":"pointer",fontFamily:"inherit"}}>
            {saving?"Saving...":"Save Platform Settings"}
          </button>
        </div>
      )}

      {/* ── Commission Settings ── */}
      {activeTab==="commission"&&(
        <div style={{background:"#FFFDF9",border:"1px solid #E8D5A3",borderRadius:"16px",padding:"26px 28px"}}>
          <h2 style={{fontSize:"17px",fontFamily:"Georgia,serif",color:"#2C1810",marginBottom:"5px"}}>Commission & Payout Rules</h2>
          <p style={{fontSize:"13px",color:"#A08060",marginBottom:"22px"}}>Fee structure and payout configuration</p>

          {/* Fee preview card */}
          <div style={{background:"linear-gradient(135deg,#2C1810,#3D2B1F)",borderRadius:"12px",padding:"16px 20px",marginBottom:"22px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(201,168,76,.04) 1px,transparent 1px)",backgroundSize:"18px 18px",pointerEvents:"none"}}/>
            <div style={{position:"relative"}}>
              <div style={{fontSize:"12px",color:"rgba(201,168,76,.55)",letterSpacing:".08em",marginBottom:"12px",fontWeight:600}}>LIVE FEE PREVIEW — ₹10,000 ORDER</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"12px"}}>
                {[
                  {label:"Platform Fee",  value:`₹${Math.round(10000*Number(commission.platformFee)/100).toLocaleString("en-IN")} (${commission.platformFee}%)`},
                  {label:"GST on Fee",    value:`₹${Math.round(10000*Number(commission.platformFee)/100*Number(commission.gstRate)/100).toLocaleString("en-IN")} (${commission.gstRate}%)`},
                  {label:"Seller Gets",   value:`₹${Math.round(10000*(1-Number(commission.platformFee)/100*(1+Number(commission.gstRate)/100))).toLocaleString("en-IN")}`},
                ].map(s=>(
                  <div key={s.label}>
                    <div style={{fontSize:"10px",color:"rgba(201,168,76,.5)",marginBottom:"3px"}}>{s.label}</div>
                    <div style={{fontSize:"14px",fontWeight:700,color:"#C9A84C",fontFamily:"Georgia,serif"}}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:"15px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
              <div><label style={lbl}>Platform Fee (%)</label><input type="number" value={commission.platformFee} onChange={e=>setCommission({...commission,platformFee:e.target.value})} min="0" max="30" style={inp}/></div>
              <div><label style={lbl}>Payout Processing Fee (%)</label><input type="number" value={commission.payoutFee} onChange={e=>setCommission({...commission,payoutFee:e.target.value})} style={inp}/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
              <div><label style={lbl}>GST Rate (%)</label><input type="number" value={commission.gstRate} onChange={e=>setCommission({...commission,gstRate:e.target.value})} style={inp}/></div>
              <div><label style={lbl}>Payout Cycle (days)</label><input type="number" value={commission.payoutCycleDays} onChange={e=>setCommission({...commission,payoutCycleDays:e.target.value})} style={inp}/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px"}}>
              <div><label style={lbl}>Min Payout (₹)</label><input type="number" value={commission.minPayoutAmount} onChange={e=>setCommission({...commission,minPayoutAmount:e.target.value})} style={inp}/></div>
              <div><label style={lbl}>Max Payout (₹)</label><input type="number" value={commission.maxPayoutAmount} onChange={e=>setCommission({...commission,maxPayoutAmount:e.target.value})} style={inp}/></div>
            </div>
            <div>
              <label style={lbl}>Auto-approve payouts below (₹)</label>
              <input type="number" value={commission.autoApproveBelow} onChange={e=>setCommission({...commission,autoApproveBelow:e.target.value})} style={{...inp,maxWidth:"220px"}}/>
              <p style={{fontSize:"11px",color:"#A08060",marginTop:"4px"}}>Payouts below this amount are approved automatically without manual review</p>
            </div>
          </div>
          <button onClick={()=>save("Commission")} disabled={saving} style={{marginTop:"20px",padding:"11px 28px",borderRadius:"8px",background:saving?"#E8D5A3":"linear-gradient(135deg,#C9A84C,#8B6914)",color:saving?"#A08060":"#2C1810",border:"none",fontSize:"14px",fontWeight:700,cursor:saving?"not-allowed":"pointer",fontFamily:"inherit"}}>
            {saving?"Saving...":"Save Commission Settings"}
          </button>
        </div>
      )}

      {/* ── Notification Settings ── */}
      {activeTab==="notifications"&&(
        <div style={{background:"#FFFDF9",border:"1px solid #E8D5A3",borderRadius:"16px",padding:"26px 28px"}}>
          <h2 style={{fontSize:"17px",fontFamily:"Georgia,serif",color:"#2C1810",marginBottom:"5px"}}>Admin Notifications</h2>
          <p style={{fontSize:"13px",color:"#A08060",marginBottom:"22px"}}>Control which alerts you receive as admin</p>
          <div style={{marginBottom:"20px"}}>
            <p style={{fontSize:"12px",fontWeight:700,color:"#6B4F12",textTransform:"uppercase",letterSpacing:".06em",marginBottom:"2px"}}>Email Alerts</p>
          </div>
          {[
            {key:"newSellerEmail",    label:"New Seller Registration",   desc:"Email when a new seller registers"},
            {key:"kycSubmitEmail",    label:"KYC Document Submitted",    desc:"Email when a seller submits KYC documents"},
            {key:"payoutRequestEmail",label:"Payout Request Received",   desc:"Email when a seller requests a payout"},
            {key:"orderAlertEmail",   label:"Large Order Alert",         desc:"Email for orders above ₹50,000"},
            {key:"dailyReport",       label:"Daily Activity Report",     desc:"Morning summary of platform activity"},
            {key:"weeklyReport",      label:"Weekly Business Report",    desc:"Sunday summary with revenue and growth metrics"},
            {key:"smsAlerts",         label:"SMS Alerts (Critical)",     desc:"SMS for urgent issues requiring immediate action"},
            {key:"slackWebhook",      label:"Slack Notifications",       desc:"Push alerts to your Slack workspace"},
          ].map(item=>(
            <Toggle key={item.key} checked={notif[item.key as keyof typeof notif]} onChange={v=>setNotif(p=>({...p,[item.key]:v}))} label={item.label} desc={item.desc}/>
          ))}
          <button onClick={()=>save("Notification")} disabled={saving} style={{marginTop:"20px",padding:"11px 28px",borderRadius:"8px",background:saving?"#E8D5A3":"linear-gradient(135deg,#C9A84C,#8B6914)",color:saving?"#A08060":"#2C1810",border:"none",fontSize:"14px",fontWeight:700,cursor:saving?"not-allowed":"pointer",fontFamily:"inherit"}}>
            {saving?"Saving...":"Save Notification Preferences"}
          </button>
        </div>
      )}

      {/* ── Security Settings ── */}
      {activeTab==="security"&&(
        <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>

          {/* Access control */}
          <div style={{background:"#FFFDF9",border:"1px solid #E8D5A3",borderRadius:"16px",padding:"26px 28px"}}>
            <h2 style={{fontSize:"17px",fontFamily:"Georgia,serif",color:"#2C1810",marginBottom:"5px"}}>Access & Platform Control</h2>
            <p style={{fontSize:"13px",color:"#A08060",marginBottom:"22px"}}>Control who can access the platform</p>
            <Toggle checked={security.newRegistrations}  onChange={v=>setSecurity(p=>({...p,newRegistrations:v}))}  label="Allow New Registrations"    desc="Allow new sellers to register on the platform"/>
            <Toggle checked={security.autoApproveKYC}    onChange={v=>setSecurity(p=>({...p,autoApproveKYC:v}))}    label="Auto-approve KYC"           desc="Automatically approve all KYC submissions without manual review"/>
            <Toggle checked={security.require2FA}        onChange={v=>setSecurity(p=>({...p,require2FA:v}))}        label="Require 2FA for Admin"      desc="Enforce two-factor authentication for admin login"/>
            <Toggle checked={security.maintenanceMode}   onChange={v=>setSecurity(p=>({...p,maintenanceMode:v}))}   label="Maintenance Mode"           desc="Show maintenance page to all visitors — admin still accessible"/>
            {security.maintenanceMode&&(
              <div style={{marginTop:"10px",padding:"10px 14px",borderRadius:"8px",background:"#FEF2F2",border:"1px solid #FECACA",fontSize:"12px",color:"#dc2626"}}>
                ⚠️ Maintenance mode is ON — the public website is showing a maintenance page to visitors
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px",marginTop:"16px"}}>
              <div>
                <label style={lbl}>Session Timeout (minutes)</label>
                <input type="number" value={security.sessionTimeout} onChange={e=>setSecurity({...security,sessionTimeout:e.target.value})} style={inp}/>
              </div>
              <div>
                <label style={lbl}>Max Login Attempts</label>
                <input type="number" value={security.maxLoginAttempts} onChange={e=>setSecurity({...security,maxLoginAttempts:e.target.value})} style={inp}/>
              </div>
            </div>
            <div style={{marginTop:"14px"}}>
              <label style={lbl}>Allowed Admin IPs (comma separated, blank = all)</label>
              <input value={security.allowedIPs} onChange={e=>setSecurity({...security,allowedIPs:e.target.value})} placeholder="e.g. 192.168.1.1, 103.25.45.67" style={inp}/>
              <p style={{fontSize:"11px",color:"#A08060",marginTop:"4px"}}>Leave blank to allow access from any IP address</p>
            </div>
            <button onClick={()=>save("Security")} disabled={saving} style={{marginTop:"20px",padding:"11px 28px",borderRadius:"8px",background:saving?"#E8D5A3":"linear-gradient(135deg,#C9A84C,#8B6914)",color:saving?"#A08060":"#2C1810",border:"none",fontSize:"14px",fontWeight:700,cursor:saving?"not-allowed":"pointer",fontFamily:"inherit"}}>
              {saving?"Saving...":"Save Security Settings"}
            </button>
          </div>

          {/* Change admin password */}
          <div style={{background:"#FFFDF9",border:"1px solid #E8D5A3",borderRadius:"16px",padding:"26px 28px"}}>
            <h2 style={{fontSize:"17px",fontFamily:"Georgia,serif",color:"#2C1810",marginBottom:"5px"}}>Change Admin Password</h2>
            <p style={{fontSize:"13px",color:"#A08060",marginBottom:"22px"}}>Use a strong password of at least 8 characters</p>
            <div style={{display:"flex",flexDirection:"column",gap:"14px",maxWidth:"400px"}}>
              {[
                {key:"current", label:"Current Password *",  placeholder:"Your current password"},
                {key:"newPw",   label:"New Password *",      placeholder:"At least 8 characters"},
                {key:"confirm", label:"Confirm Password *",  placeholder:"Repeat new password"},
              ].map(f=>(
                <div key={f.key}>
                  <label style={lbl}>{f.label}</label>
                  <input type="password" value={pwForm[f.key as keyof typeof pwForm]} onChange={e=>setPwForm({...pwForm,[f.key]:e.target.value})} placeholder={f.placeholder} style={inp}/>
                </div>
              ))}
              {pwError&&<div style={{padding:"10px 14px",borderRadius:"8px",background:"#FEF2F2",border:"1px solid #FECACA",color:"#dc2626",fontSize:"13px"}}>⚠️ {pwError}</div>}
              <button onClick={changePassword} disabled={saving} style={{padding:"11px 24px",borderRadius:"8px",background:saving?"#E8D5A3":"linear-gradient(135deg,#C9A84C,#8B6914)",color:saving?"#A08060":"#2C1810",border:"none",fontSize:"14px",fontWeight:700,cursor:saving?"not-allowed":"pointer",fontFamily:"inherit",alignSelf:"flex-start"}}>
                {saving?"Changing...":"Change Password"}
              </button>
            </div>
          </div>

          {/* Danger zone */}
          <div style={{background:"#FFFDF9",border:"1.5px solid #FECACA",borderRadius:"16px",padding:"22px 28px"}}>
            <h3 style={{fontSize:"15px",fontWeight:600,color:"#dc2626",marginBottom:"6px"}}>⚠️ Danger Zone</h3>
            <p style={{fontSize:"13px",color:"#A08060",marginBottom:"16px"}}>These actions are irreversible. Proceed with extreme caution.</p>
            <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
              <button style={{padding:"9px 18px",borderRadius:"8px",background:"transparent",border:"1.5px solid #FDE68A",color:"#854d0e",fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🗄 Export All Data</button>
              <button style={{padding:"9px 18px",borderRadius:"8px",background:"transparent",border:"1.5px solid #FECACA",color:"#dc2626",fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🗑 Purge Test Data</button>
              <button style={{padding:"9px 18px",borderRadius:"8px",background:"transparent",border:"1.5px solid #FECACA",color:"#dc2626",fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>⛔ Suspend Platform</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        input::placeholder{color:#C4A882;}
        input:focus,select:focus{border-color:#C9A84C !important;}
      `}</style>
    </div>
  );
}
