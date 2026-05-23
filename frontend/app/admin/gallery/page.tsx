"use client";

import { useState } from "react";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  condition: string;
  age: string;
  origin: string;
  material: string;
  dimensions: string;
  weight: string;
  description: string;
  inStock: boolean;
  featured: boolean;
  certificate: boolean;
  seller: string;
  createdAt: string;
};

const MOCK_PRODUCTS: Product[] = [
  { id:"p1", name:"Brass Ganesh Idol — 18th Century",         category:"Idols & Figurines",    price:85000, originalPrice:95000, condition:"Excellent", age:"300+ years", origin:"Rajasthan",       material:"Solid Brass",    dimensions:`12" H × 8" W`, weight:"4.2 kg", description:"An extraordinary 18th-century Ganesha idol cast in solid brass.", inStock:true,  featured:true,  certificate:true,  seller:"Ananya Seller", createdAt:"2026-05-02" },
  { id:"p2", name:"Mughal Miniature Painting — Shah Jahan Era",category:"Paintings & Art",      price:220000,                   condition:"Good",      age:"380+ years", origin:"Agra",            material:"Natural pigments", dimensions:`9" × 6"`,       weight:"0.3 kg", description:"A stunning Mughal miniature from the Shah Jahan period.",     inStock:true,  featured:true,  certificate:true,  seller:"Ananya Seller", createdAt:"2026-05-02" },
  { id:"p3", name:"Teak Wood Carved Cabinet — Victorian Era",  category:"Furniture",            price:145000,originalPrice:160000,condition:"Good",     age:"150+ years", origin:"Kolkata",         material:"Burma Teak",      dimensions:`48" H × 36" W`, weight:"68 kg",  description:"A Victorian-era teak cabinet crafted in Kolkata.",            inStock:true,  featured:false, certificate:false, seller:"Ananya Seller", createdAt:"2026-05-01" },
  { id:"p4", name:"Silver Bidri Work Box — Hyderabad",         category:"Metalwork",            price:38000,                    condition:"Excellent", age:"100+ years", origin:"Hyderabad",       material:"Zinc + Silver",    dimensions:`8" × 5" × 3"`,  weight:"1.1 kg", description:"Authentic Bidriware from Hyderabad with silver inlay.",       inStock:true,  featured:true,  certificate:true,  seller:"Ananya Seller", createdAt:"2026-04-30" },
  { id:"p5", name:"Terracotta Horse — Bankura",                 category:"Pottery & Ceramics",  price:12000,                    condition:"Excellent", age:"80+ years",  origin:"Bankura",         material:"Terracotta",       dimensions:`14" H × 12" L`, weight:"2.8 kg", description:"A classic Bankura horse — genuine older piece.",               inStock:true,  featured:false, certificate:false, seller:"Ananya Seller", createdAt:"2026-04-29" },
  { id:"p6", name:"Pashmina Carpet — Kashmir",                  category:"Textiles",             price:195000,                   condition:"Good",      age:"120+ years", origin:"Srinagar",        material:"Pure Pashmina",    dimensions:`8' × 5'`,       weight:"6.5 kg", description:"An antique Kashmiri carpet hand-knotted from pure pashmina.", inStock:false, featured:false, certificate:true,  seller:"Ananya Seller", createdAt:"2026-04-28" },
];

const CATEGORIES = ["All","Idols & Figurines","Paintings & Art","Furniture","Metalwork","Pottery & Ceramics","Textiles"];

function Toast({ msg, type, onClose }: { msg:string; type:"success"|"error"; onClose:()=>void }) {
  return (
    <div style={{ position:"fixed", top:"24px", right:"24px", zIndex:9999, padding:"12px 16px", borderRadius:"10px", background:type==="success"?"#f0fdf4":"#fef2f2", border:`1px solid ${type==="success"?"#bbf7d0":"#fecaca"}`, color:type==="success"?"#15803d":"#dc2626", fontSize:"13px", fontWeight:500, boxShadow:"0 4px 16px rgba(0,0,0,.08)", display:"flex", alignItems:"center", gap:"10px", maxWidth:"360px", animation:"slideDown .3s ease", fontFamily:"inherit" }}>
      <span>{type==="success"?"✅":"❌"}</span><span style={{flex:1}}>{msg}</span>
      <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:"16px",color:"inherit",padding:0,opacity:.6}}>×</button>
    </div>
  );
}

function EditModal({ product, onClose, onSave }: { product:Product; onClose:()=>void; onSave:(p:Product)=>void }) {
  const [form, setForm] = useState({ ...product });
  const inp: React.CSSProperties = { width:"100%", padding:"9px 12px", borderRadius:"7px", border:"1.5px solid #e5e7eb", fontSize:"13px", color:"#111827", background:"#f9fafb", outline:"none", fontFamily:"inherit" };
  const lbl: React.CSSProperties = { fontSize:"11px", fontWeight:700, color:"#6b7280", display:"block", marginBottom:"4px", letterSpacing:".04em", textTransform:"uppercase" };

  return (
    <div onClick={(e)=>{if(e.target===e.currentTarget)onClose();}} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000, padding:"20px", backdropFilter:"blur(6px)" }}>
      <div style={{ background:"#fff", borderRadius:"16px", width:"100%", maxWidth:"620px", maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 64px rgba(0,0,0,.25)", animation:"scaleIn .3s ease" }}>
        <div style={{ padding:"20px 24px 18px", borderBottom:"1px solid #f3f4f6", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <h2 style={{ fontSize:"17px", fontWeight:700, color:"#111827" }}>Edit Listing</h2>
            <p style={{ fontSize:"12px", color:"#9ca3af", marginTop:"2px" }}>Update product details for the gallery</p>
          </div>
          <button onClick={onClose} style={{ width:"30px", height:"30px", borderRadius:"50%", background:"#f3f4f6", border:"none", color:"#374151", fontSize:"16px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"inherit" }}>×</button>
        </div>
        <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:"14px" }}>
          <div><label style={lbl}>Product Name *</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={inp}/></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
            <div><label style={lbl}>Category</label>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={{...inp,cursor:"pointer"}}>
                {CATEGORIES.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Condition</label>
              <select value={form.condition} onChange={e=>setForm({...form,condition:e.target.value})} style={{...inp,cursor:"pointer"}}>
                {["Excellent","Good","Fair","Restoration Needed"].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
            <div><label style={lbl}>Price (₹) *</label><input type="number" value={form.price} onChange={e=>setForm({...form,price:Number(e.target.value)})} style={inp}/></div>
            <div><label style={lbl}>Original Price (₹)</label><input type="number" value={form.originalPrice||""} onChange={e=>setForm({...form,originalPrice:Number(e.target.value)||undefined})} placeholder="Optional" style={inp}/></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
            <div><label style={lbl}>Age</label><input value={form.age} onChange={e=>setForm({...form,age:e.target.value})} placeholder="e.g. 100+ years" style={inp}/></div>
            <div><label style={lbl}>Origin</label><input value={form.origin} onChange={e=>setForm({...form,origin:e.target.value})} placeholder="City, State" style={inp}/></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
            <div><label style={lbl}>Material</label><input value={form.material} onChange={e=>setForm({...form,material:e.target.value})} style={inp}/></div>
            <div><label style={lbl}>Weight</label><input value={form.weight} onChange={e=>setForm({...form,weight:e.target.value})} placeholder="e.g. 2.5 kg" style={inp}/></div>
          </div>
          <div><label style={lbl}>Dimensions</label><input value={form.dimensions} onChange={e=>setForm({...form,dimensions:e.target.value})} placeholder={`e.g. 12" H × 8" W`} style={inp}/></div>
          <div><label style={lbl}>Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3} style={{...inp,resize:"none"}}/></div>

          {/* Toggles */}
          <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
            {[
              {key:"inStock",    label:"In Stock"},
              {key:"featured",   label:"Featured"},
              {key:"certificate",label:"Certificate Included"},
            ].map(t=>(
              <label key={t.key} style={{ display:"flex", alignItems:"center", gap:"8px", cursor:"pointer", padding:"8px 14px", borderRadius:"8px", background:form[t.key as keyof typeof form]?"rgba(201,168,76,.1)":"#f9fafb", border:`1px solid ${form[t.key as keyof typeof form]?"#C9A84C":"#e5e7eb"}`, transition:"all .15s" }}>
                <input type="checkbox" checked={!!form[t.key as keyof typeof form]} onChange={e=>setForm({...form,[t.key]:e.target.checked})} style={{ accentColor:"#C9A84C" }}/>
                <span style={{ fontSize:"13px", fontWeight:500, color:"#374151" }}>{t.label}</span>
              </label>
            ))}
          </div>

          <div style={{ display:"flex", gap:"10px", paddingTop:"4px" }}>
            <button onClick={onClose} style={{ flex:1, padding:"10px", borderRadius:"8px", border:"1.5px solid #e5e7eb", background:"transparent", color:"#374151", fontSize:"14px", fontWeight:500, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
            <button onClick={()=>{onSave(form);onClose();}} style={{ flex:2, padding:"10px", borderRadius:"8px", background:"linear-gradient(135deg,#C9A84C,#8B6914)", color:"#2C1810", border:"none", fontSize:"14px", fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminGalleryPage() {
  const [products, setProducts]     = useState<Product[]>(MOCK_PRODUCTS);
  const [category, setCategory]     = useState("All");
  const [search, setSearch]         = useState("");
  const [editingProduct, setEditingProduct] = useState<Product|null>(null);
  const [toast, setToast]           = useState<{msg:string;type:"success"|"error"}|null>(null);
  const [filter, setFilter]         = useState<"all"|"featured"|"out_of_stock">("all");

  const showToast = (msg:string,type:"success"|"error"="success")=>{ setToast({msg,type}); setTimeout(()=>setToast(null),4000); };

  const handleSave = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id===updated.id ? updated : p));
    showToast(`"${updated.name.split("—")[0].trim()}" updated successfully!`);
  };

  const toggleFeatured = (id:string) => {
    setProducts(prev => prev.map(p => p.id===id ? {...p,featured:!p.featured} : p));
    const p = products.find(x=>x.id===id);
    showToast(p?.featured ? "Removed from featured" : "Added to featured! ⭐");
  };

  const toggleStock = (id:string) => {
    setProducts(prev => prev.map(p => p.id===id ? {...p,inStock:!p.inStock} : p));
    const p = products.find(x=>x.id===id);
    showToast(p?.inStock ? "Marked as out of stock" : "Marked as in stock");
  };

  const deleteProduct = (id:string) => {
    const p = products.find(x=>x.id===id);
    if (!confirm(`Delete "${p?.name}"? This cannot be undone.`)) return;
    setProducts(prev => prev.filter(x=>x.id!==id));
    showToast("Product removed from gallery","error");
  };

  const filtered = products.filter(p => {
    const matchCat    = category==="All" || p.category===category;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.origin.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter==="all" || (filter==="featured"&&p.featured) || (filter==="out_of_stock"&&!p.inStock);
    return matchCat && matchSearch && matchFilter;
  });

  const conditionStyle = (c:string) => ({
    Excellent:          {bg:"#f0fdf4",color:"#15803d"},
    Good:               {bg:"#eff6ff",color:"#1d4ed8"},
    Fair:               {bg:"#fffbeb",color:"#854d0e"},
    "Restoration Needed":{bg:"#fef2f2",color:"#dc2626"},
  }[c]||{bg:"#f3f4f6",color:"#374151"});

  return (
    <div style={{ maxWidth:"1200px" }}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      {editingProduct&&<EditModal product={editingProduct} onClose={()=>setEditingProduct(null)} onSave={handleSave}/>}

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"24px", flexWrap:"wrap", gap:"12px" }}>
        <div>
          <h1 style={{ fontSize:"22px", fontWeight:700, color:"#111827", marginBottom:"4px" }}>Gallery Management</h1>
          <p style={{ fontSize:"14px", color:"#6b7280" }}>{products.length} listings · Edit prices, details, and visibility</p>
        </div>
        <a href="/dashboard/gallery" target="_blank" style={{ padding:"9px 18px", borderRadius:"8px", background:"linear-gradient(135deg,#C9A84C,#8B6914)", color:"#2C1810", border:"none", fontSize:"13px", fontWeight:700, cursor:"pointer", fontFamily:"inherit", textDecoration:"none", display:"flex", alignItems:"center", gap:"6px" }}>
          ↗ View Seller Gallery
        </a>
      </div>

      {/* Summary stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:"12px", marginBottom:"22px" }}>
        {[
          {icon:"🏺",label:"Total Listings",  value:String(products.length),                           color:"rgba(79,70,229,.1)"},
          {icon:"✅",label:"In Stock",         value:String(products.filter(p=>p.inStock).length),      color:"rgba(16,185,129,.1)"},
          {icon:"⭐",label:"Featured",         value:String(products.filter(p=>p.featured).length),     color:"rgba(245,158,11,.1)"},
          {icon:"❌",label:"Out of Stock",      value:String(products.filter(p=>!p.inStock).length),     color:"rgba(239,68,68,.08)"},
          {icon:"📜",label:"Certified",        value:String(products.filter(p=>p.certificate).length),  color:"rgba(201,168,76,.1)"},
        ].map(s=>(
          <div key={s.label} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:"10px", padding:"14px 16px" }}>
            <div style={{ width:"32px", height:"32px", borderRadius:"8px", background:s.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px", marginBottom:"8px" }}>{s.icon}</div>
            <div style={{ fontSize:"20px", fontWeight:700, color:"#111827", lineHeight:1 }}>{s.value}</div>
            <div style={{ fontSize:"11px", color:"#9ca3af", marginTop:"3px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:"10px", marginBottom:"14px", flexWrap:"wrap" }}>
        <div style={{ flex:1, minWidth:"200px", position:"relative" }}>
          <span style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)", fontSize:"14px", pointerEvents:"none" }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..." style={{ width:"100%", padding:"9px 14px 9px 34px", borderRadius:"8px", border:"1.5px solid #e5e7eb", fontSize:"13px", color:"#111827", background:"#fff", outline:"none", fontFamily:"inherit" }}/>
          {search&&<button onClick={()=>setSearch("")} style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:"16px", color:"#9ca3af", padding:0, lineHeight:1 }}>×</button>}
        </div>
        <select value={filter} onChange={e=>setFilter(e.target.value as any)} style={{ padding:"9px 14px", borderRadius:"8px", border:"1.5px solid #e5e7eb", fontSize:"13px", color:"#111827", background:"#fff", outline:"none", cursor:"pointer", fontFamily:"inherit" }}>
          <option value="all">All Products</option>
          <option value="featured">Featured Only</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>

      {/* Category tabs */}
      <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"18px" }}>
        {CATEGORIES.map(cat=>(
          <button key={cat} onClick={()=>setCategory(cat)} style={{ padding:"6px 14px", borderRadius:"99px", border:`1.5px solid ${category===cat?"#C9A84C":"#e5e7eb"}`, background:category===cat?"linear-gradient(135deg,#C9A84C,#8B6914)":"#fff", color:category===cat?"#2C1810":"#374151", fontSize:"12px", fontWeight:category===cat?700:400, cursor:"pointer", fontFamily:"inherit", transition:"all .15s" }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Products table */}
      <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:"12px", overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 110px 120px 90px 80px 90px 160px", padding:"10px 20px", background:"#111827" }}>
          {["Product","Price","Category","Condition","Stock","Featured","Actions"].map(h=>(
            <div key={h} style={{ fontSize:"10px", fontWeight:700, color:"rgba(255,255,255,.5)", letterSpacing:".08em", textTransform:"uppercase" }}>{h}</div>
          ))}
        </div>

        {filtered.length===0 ? (
          <div style={{ padding:"56px 20px", textAlign:"center" }}>
            <div style={{ fontSize:"44px", marginBottom:"14px" }}>🏺</div>
            <p style={{ fontSize:"16px", fontWeight:500, color:"#111827", marginBottom:"6px" }}>No products found</p>
            <p style={{ fontSize:"13px", color:"#9ca3af" }}>Try different filters</p>
          </div>
        ) : (
          filtered.map((p,i)=>{
            const cc = conditionStyle(p.condition);
            return (
              <div key={p.id} style={{ display:"grid", gridTemplateColumns:"1fr 110px 120px 90px 80px 90px 160px", padding:"14px 20px", borderBottom:i<filtered.length-1?"1px solid #f9fafb":"none", background:i%2===0?"#fff":"#fafafa", alignItems:"center", transition:"background .15s" }}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background="#fffbeb"}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background=i%2===0?"#fff":"#fafafa"}
              >
                {/* Product */}
                <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <div style={{ width:"40px", height:"40px", borderRadius:"8px", background:"linear-gradient(135deg,#2C1810,#3D2B1F)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", flexShrink:0 }}>🏺</div>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:"13px", fontWeight:600, color:"#111827", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.name.split("—")[0].trim()}</div>
                    <div style={{ fontSize:"11px", color:"#9ca3af" }}>{p.origin} · {p.age}</div>
                    {p.certificate&&<span style={{ fontSize:"9px", fontWeight:700, color:"#C9A84C", background:"rgba(201,168,76,.1)", padding:"1px 5px", borderRadius:"3px" }}>CERTIFIED</span>}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <div style={{ fontSize:"13px", fontWeight:700, color:"#111827" }}>₹{p.price.toLocaleString("en-IN")}</div>
                  {p.originalPrice&&<div style={{ fontSize:"11px", color:"#9ca3af", textDecoration:"line-through" }}>₹{p.originalPrice.toLocaleString("en-IN")}</div>}
                </div>

                {/* Category */}
                <div style={{ fontSize:"12px", color:"#374151", fontWeight:500 }}>{p.category}</div>

                {/* Condition */}
                <span style={{ display:"inline-block", padding:"3px 8px", borderRadius:"99px", fontSize:"10px", fontWeight:700, background:cc.bg, color:cc.color }}>{p.condition}</span>

                {/* Stock */}
                <button onClick={()=>toggleStock(p.id)} style={{ padding:"4px 10px", borderRadius:"99px", fontSize:"10px", fontWeight:700, background:p.inStock?"#f0fdf4":"#fef2f2", color:p.inStock?"#15803d":"#dc2626", border:`1px solid ${p.inStock?"#bbf7d0":"#fecaca"}`, cursor:"pointer", fontFamily:"inherit", transition:"all .15s" }}>
                  {p.inStock?"In Stock":"Out"}
                </button>

                {/* Featured */}
                <button onClick={()=>toggleFeatured(p.id)} style={{ padding:"4px 10px", borderRadius:"99px", fontSize:"10px", fontWeight:700, background:p.featured?"rgba(245,158,11,.1)":"#f9fafb", color:p.featured?"#d97706":"#9ca3af", border:`1px solid ${p.featured?"#fde68a":"#e5e7eb"}`, cursor:"pointer", fontFamily:"inherit", transition:"all .15s" }}>
                  {p.featured?"⭐ Yes":"No"}
                </button>

                {/* Actions */}
                <div style={{ display:"flex", gap:"5px" }}>
                  <button onClick={()=>setEditingProduct(p)} style={{ padding:"6px 12px", borderRadius:"6px", background:"linear-gradient(135deg,#C9A84C,#8B6914)", color:"#2C1810", border:"none", fontSize:"11px", fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>✏ Edit</button>
                  <button onClick={()=>deleteProduct(p.id)} style={{ padding:"6px 10px", borderRadius:"6px", background:"#fef2f2", border:"1px solid #fecaca", color:"#dc2626", fontSize:"11px", cursor:"pointer", fontFamily:"inherit" }}>🗑</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        @keyframes scaleIn {from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        input::placeholder,textarea::placeholder{color:#9ca3af;}
        input:focus,select:focus,textarea:focus{border-color:#C9A84C !important;}
      `}</style>
    </div>
  );
}
