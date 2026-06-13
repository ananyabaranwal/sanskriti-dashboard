"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import api from "@/lib/api";

const BURG = "#9B0020";

function Toast({ msg, type, onClose }: { msg:string; type:"success"|"error"; onClose:()=>void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position:"fixed",top:"24px",right:"24px",zIndex:9999,padding:"12px 16px",borderRadius:"12px",background:type==="success"?"#f0fdf4":"#fef2f2",border:`1px solid ${type==="success"?"#bbf7d0":"#fecaca"}`,color:type==="success"?"#15803d":"#dc2626",fontSize:"13px",fontWeight:500,display:"flex",alignItems:"center",gap:"10px",maxWidth:"380px",boxShadow:"0 4px 16px rgba(0,0,0,.08)" }}>
      {type==="success"?"✅":"❌"}<span style={{ flex:1 }}>{msg}</span>
      <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",fontSize:"16px",opacity:.6 }}>×</button>
    </div>
  );
}

const CATEGORIES = ["All","Idols & Figurines","Paintings & Art","Furniture","Metalwork","Pottery & Ceramics","Textiles","Jewellery","Wooden Crafts","Coins & Stamps"];
const CONDITIONS  = ["Excellent","Good","Fair","Restoration Needed"];

// Mock products — replace with API call
const MOCK: any[] = [
  { _id:"1", name:"Brass Ganesh Idol",       origin:"Rajasthan · 300+ years", category:"Idols & Figurines", price:85000, mrp:95000, condition:"Excellent", inStock:true,  featured:true,  certificate:true,  image:"", desc:"Handcrafted brass Ganesh idol from Rajasthan." },
  { _id:"2", name:"Mughal Miniature Painting",origin:"Agra · 380+ years",     category:"Paintings & Art",   price:220000,mrp:250000,condition:"Good",      inStock:true,  featured:true,  certificate:true,  image:"", desc:"Original Mughal miniature painting." },
  { _id:"3", name:"Teak Wood Carved Cabinet", origin:"Kolkata · 150+ years",  category:"Furniture",         price:145000,mrp:160000,condition:"Good",      inStock:true,  featured:false, certificate:false, image:"", desc:"Hand-carved teak wood cabinet." },
  { _id:"4", name:"Silver Bidri Work Box",    origin:"Bidar · 200+ years",    category:"Metalwork",         price:38000, mrp:45000, condition:"Excellent", inStock:false, featured:false, certificate:true,  image:"", desc:"Traditional Bidri silver inlay work box." },
  { _id:"5", name:"Terracotta Horse Set",     origin:"West Bengal · 100 yrs", category:"Pottery & Ceramics",price:12000, mrp:15000, condition:"Good",      inStock:true,  featured:true,  certificate:false, image:"", desc:"Set of 3 Bankura terracotta horses." },
  { _id:"6", name:"Pashmina Shawl",           origin:"Kashmir · Heritage",    category:"Textiles",          price:18000, mrp:22000, condition:"Excellent", inStock:true,  featured:false, certificate:false, image:"", desc:"Pure Pashmina handwoven shawl." },
];

function EditModal({ product, onClose, onSave }: { product:any; onClose:()=>void; onSave:(p:any)=>void }) {
  const [form, setForm] = useState({ ...product });
  return (
    <div onClick={e => e.target===e.currentTarget&&onClose()} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:"20px",backdropFilter:"blur(4px)" }}>
      <div style={{ background:"#fff",borderRadius:"18px",width:"100%",maxWidth:"540px",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,.15)" }}>
        <div style={{ padding:"20px 24px",borderBottom:"1px solid #f0f0f0",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:"#fff",zIndex:1 }}>
          <h3 style={{ fontSize:"17px",fontWeight:700,color:"#111",fontFamily:"Georgia,serif" }}>Edit Product</h3>
          <button onClick={onClose} style={{ background:"none",border:"none",fontSize:"20px",cursor:"pointer",color:"#aaa" }}>×</button>
        </div>
        <div style={{ padding:"20px 24px",display:"flex",flexDirection:"column",gap:"14px" }}>
          {[
            ["Product Name","name","text"],
            ["Origin / Provenance","origin","text"],
            ["Description","desc","text"],
            ["Image URL","image","text"],
          ].map(([label,key,type]) => (
            <div key={key}>
              <label style={{ fontSize:"12px",fontWeight:600,color:"#888",display:"block",marginBottom:"5px" }}>{label}</label>
              <input type={type} value={form[key]||""} onChange={e=>setForm({...form,[key]:e.target.value})}
                style={{ width:"100%",padding:"9px 12px",borderRadius:"8px",border:"1.5px solid #f0f0f0",fontSize:"13px",fontFamily:"inherit",outline:"none" }}
                onFocus={e=>(e.target as HTMLElement).style.borderColor=BURG}
                onBlur={e=>(e.target as HTMLElement).style.borderColor="#f0f0f0"}
              />
            </div>
          ))}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px" }}>
            <div>
              <label style={{ fontSize:"12px",fontWeight:600,color:"#888",display:"block",marginBottom:"5px" }}>Price (₹)</label>
              <input type="number" value={form.price||""} onChange={e=>setForm({...form,price:Number(e.target.value)})}
                style={{ width:"100%",padding:"9px 12px",borderRadius:"8px",border:"1.5px solid #f0f0f0",fontSize:"13px",fontFamily:"inherit",outline:"none" }} />
            </div>
            <div>
              <label style={{ fontSize:"12px",fontWeight:600,color:"#888",display:"block",marginBottom:"5px" }}>MRP (₹)</label>
              <input type="number" value={form.mrp||""} onChange={e=>setForm({...form,mrp:Number(e.target.value)})}
                style={{ width:"100%",padding:"9px 12px",borderRadius:"8px",border:"1.5px solid #f0f0f0",fontSize:"13px",fontFamily:"inherit",outline:"none" }} />
            </div>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px" }}>
            <div>
              <label style={{ fontSize:"12px",fontWeight:600,color:"#888",display:"block",marginBottom:"5px" }}>Category</label>
              <select value={form.category||""} onChange={e=>setForm({...form,category:e.target.value})}
                style={{ width:"100%",padding:"9px 12px",borderRadius:"8px",border:"1.5px solid #f0f0f0",fontSize:"13px",fontFamily:"inherit",outline:"none" }}>
                {CATEGORIES.filter(c=>c!=="All").map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:"12px",fontWeight:600,color:"#888",display:"block",marginBottom:"5px" }}>Condition</label>
              <select value={form.condition||""} onChange={e=>setForm({...form,condition:e.target.value})}
                style={{ width:"100%",padding:"9px 12px",borderRadius:"8px",border:"1.5px solid #f0f0f0",fontSize:"13px",fontFamily:"inherit",outline:"none" }}>
                {CONDITIONS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:"flex",gap:"16px" }}>
            {[["inStock","In Stock"],["featured","Featured"],["certificate","Certificate"]].map(([k,l])=>(
              <label key={k} style={{ display:"flex",alignItems:"center",gap:"7px",cursor:"pointer",fontSize:"13px",fontWeight:500,color:"#333" }}>
                <input type="checkbox" checked={!!form[k]} onChange={e=>setForm({...form,[k]:e.target.checked})} style={{ accentColor:BURG,width:"15px",height:"15px" }} />
                {l}
              </label>
            ))}
          </div>
          <div style={{ display:"flex",gap:"10px",paddingTop:"4px" }}>
            <button onClick={onClose} style={{ flex:1,padding:"11px",borderRadius:"8px",border:"1.5px solid #e5e5e5",background:"transparent",color:"#333",fontSize:"13px",fontWeight:500,cursor:"pointer",fontFamily:"inherit" }}>Cancel</button>
            <button onClick={()=>{onSave(form);onClose();}} style={{ flex:2,padding:"11px",borderRadius:"8px",background:BURG,color:"#fff",border:"none",fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddProductModal({ onClose, onAdd }: { onClose:()=>void; onAdd:(p:any)=>void }) {
  const [form, setForm] = useState({ name:"",origin:"",category:"Idols & Figurines",condition:"Good",price:"",mrp:"",image:"",desc:"",inStock:true,featured:false,certificate:false });
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000,padding:"20px",backdropFilter:"blur(4px)" }}>
      <div style={{ background:"#fff",borderRadius:"18px",width:"100%",maxWidth:"540px",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,.15)" }}>
        <div style={{ padding:"20px 24px",borderBottom:"1px solid #f0f0f0",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:"#fff",zIndex:1 }}>
          <h3 style={{ fontSize:"17px",fontWeight:700,color:"#111",fontFamily:"Georgia,serif" }}>Add New Product</h3>
          <button onClick={onClose} style={{ background:"none",border:"none",fontSize:"20px",cursor:"pointer",color:"#aaa" }}>×</button>
        </div>
        <div style={{ padding:"20px 24px",display:"flex",flexDirection:"column",gap:"14px" }}>
          {[["Product Name","name"],["Origin / Provenance","origin"],["Description","desc"],["Image URL","image"]].map(([l,k])=>(
            <div key={k}>
              <label style={{ fontSize:"12px",fontWeight:600,color:"#888",display:"block",marginBottom:"5px" }}>{l}</label>
              <input value={(form as any)[k]} onChange={e=>setForm({...form,[k]:e.target.value})}
                style={{ width:"100%",padding:"9px 12px",borderRadius:"8px",border:"1.5px solid #f0f0f0",fontSize:"13px",fontFamily:"inherit",outline:"none" }} />
            </div>
          ))}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px" }}>
            {[["Price (₹)","price"],["MRP (₹)","mrp"]].map(([l,k])=>(
              <div key={k}>
                <label style={{ fontSize:"12px",fontWeight:600,color:"#888",display:"block",marginBottom:"5px" }}>{l}</label>
                <input type="number" value={(form as any)[k]} onChange={e=>setForm({...form,[k]:e.target.value})}
                  style={{ width:"100%",padding:"9px 12px",borderRadius:"8px",border:"1.5px solid #f0f0f0",fontSize:"13px",fontFamily:"inherit",outline:"none" }} />
              </div>
            ))}
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px" }}>
            <div>
              <label style={{ fontSize:"12px",fontWeight:600,color:"#888",display:"block",marginBottom:"5px" }}>Category</label>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}
                style={{ width:"100%",padding:"9px 12px",borderRadius:"8px",border:"1.5px solid #f0f0f0",fontSize:"13px",fontFamily:"inherit",outline:"none" }}>
                {CATEGORIES.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:"12px",fontWeight:600,color:"#888",display:"block",marginBottom:"5px" }}>Condition</label>
              <select value={form.condition} onChange={e=>setForm({...form,condition:e.target.value})}
                style={{ width:"100%",padding:"9px 12px",borderRadius:"8px",border:"1.5px solid #f0f0f0",fontSize:"13px",fontFamily:"inherit",outline:"none" }}>
                {CONDITIONS.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:"flex",gap:"16px" }}>
            {[["inStock","In Stock"],["featured","Featured"],["certificate","Certificate"]].map(([k,l])=>(
              <label key={k} style={{ display:"flex",alignItems:"center",gap:"7px",cursor:"pointer",fontSize:"13px",fontWeight:500,color:"#333" }}>
                <input type="checkbox" checked={!!(form as any)[k]} onChange={e=>setForm({...form,[k]:e.target.checked})} style={{ accentColor:BURG,width:"15px",height:"15px" }} />
                {l}
              </label>
            ))}
          </div>
          <div style={{ display:"flex",gap:"10px",paddingTop:"4px" }}>
            <button onClick={onClose} style={{ flex:1,padding:"11px",borderRadius:"8px",border:"1.5px solid #e5e5e5",background:"transparent",color:"#333",fontSize:"13px",fontWeight:500,cursor:"pointer",fontFamily:"inherit" }}>Cancel</button>
            <button onClick={()=>{onAdd({...form,_id:Date.now().toString(),price:Number(form.price),mrp:Number(form.mrp)});onClose();}} style={{ flex:2,padding:"11px",borderRadius:"8px",background:BURG,color:"#fff",border:"none",fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>Add Product</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── View mode: grid card (mirrors seller gallery) ─────────────
function ProductCard({ p, onEdit, onToggleFeatured, onToggleStock, onDelete, showToast }: any) {
  const [hov, setHov] = useState(false);
  const discount = p.mrp > p.price ? Math.round((1 - p.price/p.mrp)*100) : 0;
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ borderRadius:"14px",border:`1.5px solid ${hov?BURG:"#f0f0f0"}`,background:"#fff",overflow:"hidden",transition:"all .2s",transform:hov?"translateY(-3px)":"none",boxShadow:hov?`0 12px 32px rgba(155,0,32,.08)`:"0 2px 8px rgba(0,0,0,.04)" }}>
      {/* Image */}
      <div style={{ height:"180px",background:p.image?"transparent":"linear-gradient(135deg,#f9f9f9,#f0f0f0)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden" }}>
        {p.image ? <img src={p.image} alt={p.name} style={{ width:"100%",height:"100%",objectFit:"cover" }} /> : <span style={{ fontSize:"48px",opacity:.3 }}>🏺</span>}
        {/* Badges */}
        <div style={{ position:"absolute",top:"10px",left:"10px",display:"flex",gap:"4px",flexWrap:"wrap" }}>
          {p.certificate && <span style={{ padding:"2px 8px",borderRadius:"99px",background:BURG,color:"#fff",fontSize:"9px",fontWeight:700,letterSpacing:".06em" }}>CERTIFIED</span>}
          {p.featured    && <span style={{ padding:"2px 8px",borderRadius:"99px",background:"#f59e0b",color:"#fff",fontSize:"9px",fontWeight:700 }}>⭐ FEATURED</span>}
          {!p.inStock    && <span style={{ padding:"2px 8px",borderRadius:"99px",background:"#dc2626",color:"#fff",fontSize:"9px",fontWeight:700 }}>OUT OF STOCK</span>}
        </div>
        {discount > 0 && <span style={{ position:"absolute",top:"10px",right:"10px",padding:"2px 8px",borderRadius:"6px",background:"#15803d",color:"#fff",fontSize:"10px",fontWeight:700 }}>-{discount}%</span>}
      </div>
      {/* Info */}
      <div style={{ padding:"14px" }}>
        <div style={{ fontSize:"10px",color:BURG,fontWeight:600,letterSpacing:".08em",textTransform:"uppercase",marginBottom:"3px" }}>{p.category}</div>
        <div style={{ fontSize:"14px",fontWeight:700,color:"#111",marginBottom:"3px",fontFamily:"Georgia,serif",lineHeight:1.3 }}>{p.name}</div>
        <div style={{ fontSize:"11px",color:"#aaa",marginBottom:"10px" }}>{p.origin}</div>
        <div style={{ display:"flex",alignItems:"center",gap:"8px",marginBottom:"12px" }}>
          <span style={{ fontSize:"16px",fontWeight:700,color:"#111" }}>₹{p.price?.toLocaleString("en-IN")}</span>
          {p.mrp > p.price && <span style={{ fontSize:"12px",color:"#aaa",textDecoration:"line-through" }}>₹{p.mrp?.toLocaleString("en-IN")}</span>}
        </div>
        {/* Admin actions */}
        <div style={{ display:"flex",gap:"6px",flexWrap:"wrap" }}>
          <button onClick={()=>onEdit(p)} style={{ flex:1,padding:"6px",borderRadius:"7px",background:BURG,color:"#fff",border:"none",fontSize:"11px",fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>Edit</button>
          <button onClick={()=>onToggleFeatured(p._id)} style={{ padding:"6px 8px",borderRadius:"7px",background:p.featured?"#fff8d0":"#f9f9f9",border:`1px solid ${p.featured?"#f59e0b":"#e5e5e5"}`,color:p.featured?"#d97706":"#888",fontSize:"11px",cursor:"pointer",fontFamily:"inherit" }}>⭐</button>
          <button onClick={()=>onToggleStock(p._id)} style={{ padding:"6px 8px",borderRadius:"7px",background:p.inStock?"#f0fdf4":"#fef2f2",border:`1px solid ${p.inStock?"#bbf7d0":"#fecaca"}`,color:p.inStock?"#15803d":"#dc2626",fontSize:"11px",cursor:"pointer",fontFamily:"inherit" }}>{p.inStock?"✓":"✗"}</button>
          <button onClick={()=>onDelete(p._id)} style={{ padding:"6px 8px",borderRadius:"7px",background:"#fef2f2",border:"1px solid #fecaca",color:"#dc2626",fontSize:"11px",cursor:"pointer",fontFamily:"inherit" }}>🗑</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminGalleryPage() {
  const [products,  setProducts]  = useState<any[]>(MOCK);
  const [category,  setCategory]  = useState("All");
  const [search,    setSearch]    = useState("");
  const [view,      setView]      = useState<"grid"|"list">("grid");
  const [editing,   setEditing]   = useState<any>(null);
  const [showAdd,   setShowAdd]   = useState(false);
  const [toast,     setToast]     = useState<any>(null);

  const showT = (msg:string, type:"success"|"error"="success") => setToast({ msg, type });

  const filtered = products.filter(p =>
    (category==="All" || p.category===category) &&
    (!search || p.name.toLowerCase().includes(search.toLowerCase()) || p.origin.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleFeatured = (id:string) => {
    setProducts(prev => prev.map(p => p._id===id?{...p,featured:!p.featured}:p));
    showT(products.find(p=>p._id===id)?.featured?"Removed from featured":"Added to featured ⭐");
  };
  const toggleStock = (id:string) => {
    setProducts(prev => prev.map(p => p._id===id?{...p,inStock:!p.inStock}:p));
    showT(products.find(p=>p._id===id)?.inStock?"Marked out of stock":"Marked in stock");
  };
  const deleteProduct = (id:string) => {
    if (!confirm("Delete this product?")) return;
    setProducts(prev => prev.filter(p => p._id!==id));
    showT("Product deleted","error");
  };
  const saveProduct = (updated:any) => {
    setProducts(prev => prev.map(p => p._id===updated._id?updated:p));
    showT(`"${updated.name}" updated!`);
  };
  const addProduct = (p:any) => {
    setProducts(prev => [...prev, p]);
    showT(`"${p.name}" added to gallery!`);
  };

  const CONDITION_COLORS: Record<string,any> = {
    Excellent:            { bg:"#f0fdf4",color:"#15803d" },
    Good:                 { bg:"#eff6ff",color:"#1d4ed8" },
    Fair:                 { bg:"#fffbeb",color:"#854d0e" },
    "Restoration Needed": { bg:"#fef2f2",color:"#dc2626" },
  };

  return (
    <div style={{ maxWidth:"1200px" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)} />}
      {editing  && <EditModal product={editing} onClose={()=>setEditing(null)} onSave={saveProduct} />}
      {showAdd  && <AddProductModal onClose={()=>setShowAdd(false)} onAdd={addProduct} />}

      {/* Header */}
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"24px",flexWrap:"wrap",gap:"12px" }}>
        <div>
          <p style={{ fontSize:"12px",color:"#aaa",letterSpacing:".1em",textTransform:"uppercase",marginBottom:"4px" }}>Admin</p>
          <h1 style={{ fontSize:"26px",fontFamily:"Georgia,serif",color:"#111",fontWeight:400 }}>Gallery Management</h1>
          <p style={{ fontSize:"13px",color:"#aaa",marginTop:"3px" }}>{products.length} listings · Edit prices, details, and visibility</p>
        </div>
        <div style={{ display:"flex",gap:"10px",alignItems:"center" }}>
          <Link href="/gallery" target="_blank" style={{ padding:"9px 16px",borderRadius:"8px",border:`1.5px solid rgba(155,0,32,.2)`,color:BURG,fontSize:"12px",fontWeight:600,textDecoration:"none" }}>↗ View Live Gallery</Link>
          <button onClick={()=>setShowAdd(true)} style={{ padding:"9px 18px",borderRadius:"8px",background:BURG,color:"#fff",border:"none",fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>+ Add Product</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"12px",marginBottom:"22px" }}>
        {[
          { icon:"🏺", label:"Total",       value:products.length,                                color:`rgba(155,0,32,.07)` },
          { icon:"✅", label:"In Stock",     value:products.filter(p=>p.inStock).length,           color:"rgba(16,185,129,.07)" },
          { icon:"⭐", label:"Featured",     value:products.filter(p=>p.featured).length,          color:"rgba(245,158,11,.07)" },
          { icon:"❌", label:"Out of Stock", value:products.filter(p=>!p.inStock).length,          color:"rgba(239,68,68,.07)" },
          { icon:"📜", label:"Certified",   value:products.filter(p=>p.certificate).length,       color:"rgba(99,102,241,.07)" },
        ].map(s => (
          <div key={s.label} style={{ background:"#fff",border:"1px solid #f0f0f0",borderRadius:"12px",padding:"14px 16px" }}>
            <div style={{ width:"32px",height:"32px",borderRadius:"8px",background:s.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"15px",marginBottom:"8px" }}>{s.icon}</div>
            <div style={{ fontSize:"22px",fontWeight:700,color:"#111",lineHeight:1 }}>{s.value}</div>
            <div style={{ fontSize:"11px",color:"#aaa",marginTop:"3px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + view toggle */}
      <div style={{ display:"flex",gap:"10px",marginBottom:"16px",alignItems:"center",flexWrap:"wrap" }}>
        <div style={{ position:"relative",flex:1,minWidth:"200px" }}>
          <span style={{ position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",fontSize:"14px",opacity:.4 }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..." style={{ width:"100%",padding:"9px 12px 9px 36px",borderRadius:"9px",border:"1.5px solid #f0f0f0",fontSize:"13px",fontFamily:"inherit",outline:"none" }} />
        </div>
        <div style={{ display:"flex",border:"1px solid #f0f0f0",borderRadius:"8px",overflow:"hidden" }}>
          {(["grid","list"] as const).map(v => (
            <button key={v} onClick={()=>setView(v)} style={{ padding:"8px 14px",background:view===v?BURG:"#fff",color:view===v?"#fff":"#888",border:"none",cursor:"pointer",fontSize:"13px",fontFamily:"inherit" }}>
              {v==="grid"?"▦":"☰"}
            </button>
          ))}
        </div>
      </div>

      {/* Category tabs — mirrors seller gallery */}
      <div style={{ display:"flex",gap:"6px",marginBottom:"20px",overflowX:"auto",paddingBottom:"4px" }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={()=>setCategory(c)} style={{ padding:"7px 16px",borderRadius:"99px",border:`1.5px solid ${category===c?BURG:"#f0f0f0"}`,background:category===c?BURG:"#fff",color:category===c?"#fff":"#666",fontSize:"12px",fontWeight:category===c?700:500,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit",transition:"all .15s",flexShrink:0 }}>
            {c}
          </button>
        ))}
      </div>

      {/* Grid view — mirrors how seller sees gallery */}
      {view === "grid" && (
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:"16px" }}>
          {filtered.map(p => (
            <ProductCard key={p._id} p={p} onEdit={setEditing} onToggleFeatured={toggleFeatured} onToggleStock={toggleStock} onDelete={deleteProduct} showToast={showT} />
          ))}
        </div>
      )}

      {/* List view — table */}
      {view === "list" && (
        <div style={{ background:"#fff",borderRadius:"14px",border:"1px solid #f0f0f0",overflow:"hidden" }}>
          <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 80px 80px 120px",gap:"0",padding:"11px 16px",background:"#f9f9f9",borderBottom:"1px solid #f0f0f0",fontSize:"11px",fontWeight:700,color:"#aaa",letterSpacing:".08em",textTransform:"uppercase" }}>
            <span>Product</span><span>Price</span><span>Category</span><span>Condition</span><span>Stock</span><span>Featured</span><span>Actions</span>
          </div>
          {filtered.map((p,i) => {
            const cc = CONDITION_COLORS[p.condition]||{bg:"#f5f5f5",color:"#888"};
            return (
              <div key={p._id} style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 80px 80px 120px",gap:"0",padding:"12px 16px",borderBottom:i<filtered.length-1?"1px solid #f9f9f9":"none",alignItems:"center" }}>
                <div style={{ display:"flex",alignItems:"center",gap:"10px" }}>
                  <div style={{ width:"36px",height:"36px",borderRadius:"8px",background:"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0 }}>
                    {p.image?<img src={p.image} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>:<span style={{ fontSize:"16px" }}>🏺</span>}
                  </div>
                  <div>
                    <div style={{ fontSize:"13px",fontWeight:600,color:"#111" }}>{p.name}</div>
                    <div style={{ fontSize:"11px",color:"#aaa" }}>{p.origin}</div>
                    {p.certificate&&<span style={{ fontSize:"9px",padding:"1px 6px",borderRadius:"99px",background:`rgba(155,0,32,.08)`,color:BURG,fontWeight:700 }}>CERTIFIED</span>}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:"13px",fontWeight:700,color:"#111" }}>₹{p.price?.toLocaleString("en-IN")}</div>
                  {p.mrp>p.price&&<div style={{ fontSize:"11px",color:"#aaa",textDecoration:"line-through" }}>₹{p.mrp?.toLocaleString("en-IN")}</div>}
                </div>
                <div style={{ fontSize:"12px",color:"#666" }}>{p.category}</div>
                <div><span style={{ padding:"3px 9px",borderRadius:"99px",fontSize:"11px",fontWeight:600,background:cc.bg,color:cc.color }}>{p.condition}</span></div>
                <div>
                  <button onClick={()=>toggleStock(p._id)} style={{ padding:"4px 10px",borderRadius:"6px",background:p.inStock?"#f0fdf4":"#fef2f2",border:`1px solid ${p.inStock?"#bbf7d0":"#fecaca"}`,color:p.inStock?"#15803d":"#dc2626",fontSize:"11px",fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
                    {p.inStock?"In Stock":"OOS"}
                  </button>
                </div>
                <div>
                  <button onClick={()=>toggleFeatured(p._id)} style={{ padding:"4px 10px",borderRadius:"6px",background:p.featured?"#fff8d0":"#f9f9f9",border:`1px solid ${p.featured?"#f59e0b":"#e5e5e5"}`,color:p.featured?"#d97706":"#aaa",fontSize:"11px",fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
                    {p.featured?"⭐ Yes":"No"}
                  </button>
                </div>
                <div style={{ display:"flex",gap:"6px" }}>
                  <button onClick={()=>setEditing(p)} style={{ padding:"5px 12px",borderRadius:"6px",background:BURG,color:"#fff",border:"none",fontSize:"11px",fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>Edit</button>
                  <button onClick={()=>deleteProduct(p._id)} style={{ padding:"5px 8px",borderRadius:"6px",background:"#fef2f2",border:"1px solid #fecaca",color:"#dc2626",fontSize:"11px",cursor:"pointer",fontFamily:"inherit" }}>🗑</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign:"center",padding:"60px",color:"#aaa",fontSize:"13px" }}>
          No products found. <button onClick={()=>setShowAdd(true)} style={{ color:BURG,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:600 }}>Add one?</button>
        </div>
      )}
    </div>
  );
}
