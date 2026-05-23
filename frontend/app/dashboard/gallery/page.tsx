"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashPageWrapper from "../DashPageWrapper";

// ── Types ─────────────────────────────────────────────────────
type Product = {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  originalPrice?: number;
  condition: "Excellent" | "Good" | "Fair" | "Restoration Needed";
  age: string;
  origin: string;
  material: string;
  dimensions: string;
  weight: string;
  description: string;
  details: string[];
  images: string[];
  tags: string[];
  inStock: boolean;
  featured: boolean;
  certificate: boolean;
};

// ── Mock product catalogue ────────────────────────────────────
const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Brass Ganesh Idol — 18th Century",
    category: "Idols & Figurines",
    subCategory: "Brass",
    price: 85000,
    originalPrice: 95000,
    condition: "Excellent",
    age: "300+ years",
    origin: "Rajasthan, India",
    material: "Solid Brass",
    dimensions: "12\" H × 8\" W × 6\" D",
    weight: "4.2 kg",
    description: "An extraordinary 18th-century Ganesha idol cast in solid brass using the lost-wax technique. The intricate detailing on the crown, jewellery, and vahana (mouse) reflects the finest craftsmanship of Rajasthan's artisans of that era.",
    details: ["Lost-wax casting technique", "Natural green patina", "Original consecration marks present", "Provenance documented from 1962", "Certificate of authenticity included"],
    images: ["", "", ""],
    tags: ["ganesh", "brass", "rajasthan", "18th century", "idol"],
    inStock: true,
    featured: true,
    certificate: true,
  },
  {
    id: "p2",
    name: "Mughal Miniature Painting — Shah Jahan Era",
    category: "Paintings & Art",
    subCategory: "Miniature",
    price: 220000,
    condition: "Good",
    age: "380+ years",
    origin: "Agra, Mughal Empire",
    material: "Natural pigments on handmade paper",
    dimensions: "9\" × 6\" (framed: 14\" × 11\")",
    weight: "0.3 kg",
    description: "A stunning Mughal miniature painting from the Shah Jahan period (c. 1630–1640). Depicts a courtly scene with intricate detailing of costumes, architecture, and court life. Natural lapis lazuli blue and saffron-derived orange pigments are clearly visible.",
    details: ["Authenticated by National Museum curator", "Lapis lazuli and saffron pigments", "Handmade wasli (layered paper)", "Gold leaf border", "UV-stable archival framing"],
    images: ["", "", ""],
    tags: ["mughal", "miniature", "painting", "shah jahan", "agra"],
    inStock: true,
    featured: true,
    certificate: true,
  },
  {
    id: "p3",
    name: "Teak Wood Carved Cabinet — Victorian Era",
    category: "Furniture",
    subCategory: "Cabinets",
    price: 145000,
    originalPrice: 160000,
    condition: "Good",
    age: "150+ years",
    origin: "Kolkata, British India",
    material: "Burma Teak",
    dimensions: "48\" H × 36\" W × 18\" D",
    weight: "68 kg",
    description: "A magnificent Victorian-era teak cabinet crafted in Kolkata for a wealthy Bengali merchant family. Features hand-carved floral motifs on all panels, original brass hardware, and dovetail joinery throughout.",
    details: ["Original brass locks and hinges", "Dovetail joinery — no nails", "Hand-carved floral panels", "Interior cedar lining", "Professionally restored in 2018"],
    images: ["", ""],
    tags: ["teak", "cabinet", "victorian", "kolkata", "furniture"],
    inStock: true,
    featured: false,
    certificate: false,
  },
  {
    id: "p4",
    name: "Silver Bidri Work Box — Hyderabad",
    category: "Metalwork",
    subCategory: "Silver",
    price: 38000,
    condition: "Excellent",
    age: "100+ years",
    origin: "Hyderabad, India",
    material: "Zinc alloy with silver inlay",
    dimensions: "8\" × 5\" × 3\"",
    weight: "1.1 kg",
    description: "Authentic Bidriware from Hyderabad, featuring the distinctive black zinc alloy body with intricate silver inlay depicting lotus and vine motifs. A hallmark of Deccan craft tradition.",
    details: ["Bidri technique — zinc-lead alloy", "Pure silver inlay throughout", "Lotus and vine pattern", "Fully functional hinged lid", "Original velvet interior lining"],
    images: ["", ""],
    tags: ["bidri", "silver", "hyderabad", "metalwork", "deccan"],
    inStock: true,
    featured: true,
    certificate: true,
  },
  {
    id: "p5",
    name: "Terracotta Horse — Bankura",
    category: "Pottery & Ceramics",
    subCategory: "Terracotta",
    price: 12000,
    condition: "Excellent",
    age: "80+ years",
    origin: "Bankura, West Bengal",
    material: "Terracotta",
    dimensions: "14\" H × 12\" L",
    weight: "2.8 kg",
    description: "A classic Bankura horse, the iconic folk art form of West Bengal. Hand-moulded and kiln-fired with characteristic geometric decorations and upward-tilted neck. One of the few genuine older pieces — most available today are modern reproductions.",
    details: ["Hand-moulded by traditional artisan", "Natural oxide pigments", "Kiln-fired at high temperature", "Geometric incised decoration", "GI tag verified origin"],
    images: ["", ""],
    tags: ["bankura", "terracotta", "horse", "bengal", "folk art"],
    inStock: true,
    featured: false,
    certificate: false,
  },
  {
    id: "p6",
    name: "Pashmina Carpet — Kashmir",
    category: "Textiles",
    subCategory: "Carpets",
    price: 195000,
    condition: "Good",
    age: "120+ years",
    origin: "Srinagar, Kashmir",
    material: "Pure Pashmina wool",
    dimensions: "8\' × 5\' (240cm × 150cm)",
    weight: "6.5 kg",
    description: "An antique Kashmiri carpet hand-knotted from pure pashmina wool with natural vegetable dyes. Features a classic medallion design with intricate floral borders. Approximately 300 knots per square inch.",
    details: ["300 KPSI (knots per square inch)", "Natural vegetable dyes — no fading", "Pashmina wool — 17 microns", "Silk warp and weft", "Minor professional repair on one edge"],
    images: ["", ""],
    tags: ["kashmir", "carpet", "pashmina", "textile", "srinagar"],
    inStock: false,
    featured: false,
    certificate: true,
  },
];

const CATEGORIES = ["All", "Idols & Figurines", "Paintings & Art", "Furniture", "Metalwork", "Pottery & Ceramics", "Textiles"];

const conditionColor = (c: string) => ({
  "Excellent":           { bg:"#F0FDF4", color:"#15803d", border:"#BBF7D0" },
  "Good":                { bg:"#EFF6FF", color:"#1d4ed8", border:"#BFDBFE" },
  "Fair":                { bg:"#FFFBEB", color:"#854d0e", border:"#FDE68A" },
  "Restoration Needed":  { bg:"#FEF2F2", color:"#dc2626", border:"#FECACA" },
}[c] || { bg:"#F5E6C8", color:"#6B4F12", border:"#E8D5A3" });

// ── Image Zoom Modal ──────────────────────────────────────────
function ImageZoomModal({ product, imgIdx, onClose }: { product: Product; imgIdx: number; onClose: () => void }) {
  const [current, setCurrent] = useState(imgIdx);
  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{ position:"fixed", inset:0, background:"rgba(10,5,2,.92)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:3000, padding:"20px", backdropFilter:"blur(8px)" }}>
      <div style={{ position:"relative", width:"100%", maxWidth:"700px" }}>
        <button onClick={onClose} style={{ position:"absolute", top:"-44px", right:0, background:"rgba(255,255,255,.1)", border:"1px solid rgba(201,168,76,.2)", borderRadius:"8px", color:"#C9A84C", fontSize:"13px", padding:"6px 14px", cursor:"pointer", fontFamily:"inherit" }}>✕ Close</button>
        <div style={{ background:"linear-gradient(135deg,#2C1810,#3D2B1F)", borderRadius:"16px", height:"400px", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", border:"1px solid rgba(201,168,76,.15)" }}>
          <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(201,168,76,.04) 1px,transparent 1px)", backgroundSize:"20px 20px", pointerEvents:"none" }}/>
          <div style={{ textAlign:"center", position:"relative" }}>
            <div style={{ fontSize:"72px", marginBottom:"10px" }}>🏺</div>
            <div style={{ fontSize:"14px", color:"rgba(201,168,76,.6)" }}>Image {current + 1} of {product.images.length}</div>
            <div style={{ fontSize:"12px", color:"rgba(245,230,200,.4)", marginTop:"4px" }}>{product.name}</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:"8px", justifyContent:"center", marginTop:"12px" }}>
          {product.images.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{ width:"48px", height:"48px", borderRadius:"8px", border:`2px solid ${i===current?"#C9A84C":"rgba(201,168,76,.2)"}`, background:"rgba(201,168,76,.05)", cursor:"pointer", fontSize:"20px", display:"flex", alignItems:"center", justifyContent:"center" }}>🏺</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Compare Modal ─────────────────────────────────────────────
function CompareModal({ products, onClose, onAddToOrder }: { products: Product[]; onClose: () => void; onAddToOrder: (p: Product) => void }) {
  const fields: { label: string; key: keyof Product }[] = [
    { label:"Price",      key:"price"      },
    { label:"Condition",  key:"condition"  },
    { label:"Age",        key:"age"        },
    { label:"Origin",     key:"origin"     },
    { label:"Material",   key:"material"   },
    { label:"Dimensions", key:"dimensions" },
    { label:"Weight",     key:"weight"     },
  ];
  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{ position:"fixed", inset:0, background:"rgba(44,24,16,.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000, padding:"20px", backdropFilter:"blur(6px)" }}>
      <div style={{ background:"#FFFDF9", borderRadius:"20px", width:"100%", maxWidth:"860px", maxHeight:"90vh", overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 28px 72px rgba(44,24,16,.5)", animation:"scaleIn .3s ease" }}>
        <div style={{ background:"linear-gradient(135deg,#1A0F0A,#2C1810)", padding:"20px 28px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
          <div>
            <h2 style={{ fontSize:"18px", fontFamily:"Georgia,serif", color:"#C9A84C", fontWeight:400 }}>Compare Products</h2>
            <p style={{ fontSize:"12px", color:"rgba(245,230,200,.5)", marginTop:"2px" }}>{products.length} items selected</p>
          </div>
          <button onClick={onClose} style={{ width:"30px", height:"30px", borderRadius:"50%", background:"rgba(255,255,255,.08)", border:"none", color:"#C9A84C", fontSize:"17px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"inherit" }}>×</button>
        </div>
        <div style={{ overflowY:"auto", overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"13px" }}>
            <thead>
              <tr>
                <th style={{ padding:"12px 16px", textAlign:"left", background:"#FBF7F0", fontSize:"11px", fontWeight:700, color:"#A08060", textTransform:"uppercase", letterSpacing:".06em", borderBottom:"1px solid #E8D5A3", width:"120px" }}>Spec</th>
                {products.map(p => (
                  <th key={p.id} style={{ padding:"12px 16px", textAlign:"left", background:"#FBF7F0", borderBottom:"1px solid #E8D5A3", minWidth:"200px" }}>
                    <div style={{ fontSize:"13px", fontWeight:700, color:"#2C1810", fontFamily:"Georgia,serif" }}>{p.name.split("—")[0].trim()}</div>
                    <div style={{ fontSize:"11px", color:"#A08060", marginTop:"2px" }}>{p.category}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((f, fi) => (
                <tr key={f.key} style={{ background:fi%2===0?"#FFFDF9":"#FDFAF4" }}>
                  <td style={{ padding:"12px 16px", fontWeight:600, color:"#6B4F12", borderRight:"1px solid #F0E4C0" }}>{f.label}</td>
                  {products.map(p => {
                    const val = p[f.key];
                    if (f.key === "price") return <td key={p.id} style={{ padding:"12px 16px", fontWeight:700, color:"#8B6914", fontFamily:"Georgia,serif" }}>₹{(val as number).toLocaleString("en-IN")}</td>;
                    if (f.key === "condition") {
                      const cc = conditionColor(val as string);
                      return <td key={p.id} style={{ padding:"12px 16px" }}><span style={{ padding:"3px 8px", borderRadius:"99px", background:cc.bg, color:cc.color, border:`1px solid ${cc.border}`, fontSize:"11px", fontWeight:700 }}>{val as string}</span></td>;
                    }
                    return <td key={p.id} style={{ padding:"12px 16px", color:"#2C1810" }}>{val as string}</td>;
                  })}
                </tr>
              ))}
              <tr style={{ background:"#FBF7F0" }}>
                <td style={{ padding:"12px 16px", fontWeight:600, color:"#6B4F12", borderRight:"1px solid #F0E4C0" }}>Action</td>
                {products.map(p => (
                  <td key={p.id} style={{ padding:"12px 16px" }}>
                    <button onClick={() => { onAddToOrder(p); onClose(); }} disabled={!p.inStock} style={{ padding:"8px 16px", borderRadius:"8px", background:p.inStock?"linear-gradient(135deg,#C9A84C,#8B6914)":"#E8D5A3", color:p.inStock?"#2C1810":"#A08060", border:"none", fontSize:"12px", fontWeight:700, cursor:p.inStock?"pointer":"not-allowed", fontFamily:"inherit" }}>
                      {p.inStock ? "+ Add to Order" : "Out of Stock"}
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Product Detail Panel ──────────────────────────────────────
function ProductDetail({ product, onClose, onAddToOrder, onCompare, isComparing }: {
  product: Product;
  onClose: () => void;
  onAddToOrder: (p: Product) => void;
  onCompare: (p: Product) => void;
  isComparing: boolean;
}) {
  const [activeImg, setActiveImg]     = useState(0);
  const [showZoom, setShowZoom]       = useState(false);
  const [added, setAdded]             = useState(false);
  const cc = conditionColor(product.condition);

  const handleAddToOrder = () => {
    onAddToOrder(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      {showZoom && <ImageZoomModal product={product} imgIdx={activeImg} onClose={() => setShowZoom(false)} />}
      <div style={{ position:"fixed", inset:0, zIndex:1000 }}>
        <div style={{ position:"absolute", inset:0, background:"rgba(44,24,16,.55)", backdropFilter:"blur(3px)" }} onClick={onClose}/>
        <div style={{ position:"absolute", right:0, top:0, bottom:0, width:"520px", background:"#FFFDF9", boxShadow:"-8px 0 48px rgba(44,24,16,.2)", overflowY:"auto", animation:"slideLeft .3s ease", display:"flex", flexDirection:"column" }}>

          {/* Header */}
          <div style={{ background:"linear-gradient(135deg,#1A0F0A,#2C1810,#3D2B1F)", padding:"20px 24px", flexShrink:0 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"8px" }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:"11px", color:"rgba(201,168,76,.5)", marginBottom:"5px" }}>{product.category} · {product.subCategory}</div>
                <h2 style={{ fontSize:"17px", fontFamily:"Georgia,serif", color:"#F5E6C8", fontWeight:400, lineHeight:1.3 }}>{product.name}</h2>
              </div>
              <button onClick={onClose} style={{ width:"30px", height:"30px", borderRadius:"50%", background:"rgba(255,255,255,.08)", border:"none", color:"#C9A84C", fontSize:"16px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginLeft:"12px", fontFamily:"inherit" }}>×</button>
            </div>
            <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
              <span style={{ padding:"3px 8px", borderRadius:"99px", background:cc.bg, color:cc.color, border:`1px solid ${cc.border}`, fontSize:"10px", fontWeight:700 }}>{product.condition}</span>
              {product.certificate && <span style={{ padding:"3px 8px", borderRadius:"99px", background:"rgba(201,168,76,.12)", color:"#C9A84C", border:"1px solid rgba(201,168,76,.25)", fontSize:"10px", fontWeight:700 }}>✓ Certified</span>}
              {!product.inStock && <span style={{ padding:"3px 8px", borderRadius:"99px", background:"rgba(239,68,68,.12)", color:"#fca5a5", border:"1px solid rgba(239,68,68,.25)", fontSize:"10px", fontWeight:700 }}>Out of Stock</span>}
            </div>
          </div>

          <div style={{ padding:"20px 24px", flex:1, display:"flex", flexDirection:"column", gap:"18px" }}>

            {/* Image gallery */}
            <div>
              <div onClick={() => setShowZoom(true)} style={{ background:"linear-gradient(135deg,#2C1810,#3D2B1F)", borderRadius:"12px", height:"220px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"zoom-in", position:"relative", overflow:"hidden", border:"1px solid rgba(201,168,76,.1)" }}>
                <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(201,168,76,.04) 1px,transparent 1px)", backgroundSize:"18px 18px", pointerEvents:"none" }}/>
                <div style={{ textAlign:"center", position:"relative" }}>
                  <div style={{ fontSize:"64px" }}>🏺</div>
                  <div style={{ fontSize:"11px", color:"rgba(201,168,76,.5)", marginTop:"6px" }}>Click to zoom</div>
                </div>
                <div style={{ position:"absolute", top:"10px", right:"10px", padding:"4px 8px", borderRadius:"6px", background:"rgba(0,0,0,.5)", color:"#C9A84C", fontSize:"10px", fontWeight:600 }}>🔍 Zoom</div>
              </div>
              {product.images.length > 1 && (
                <div style={{ display:"flex", gap:"8px", marginTop:"8px" }}>
                  {product.images.map((_, i) => (
                    <button key={i} onClick={() => setActiveImg(i)} style={{ width:"52px", height:"52px", borderRadius:"7px", border:`2px solid ${i===activeImg?"#C9A84C":"#E8D5A3"}`, background:"linear-gradient(135deg,#2C1810,#3D2B1F)", cursor:"pointer", fontSize:"22px", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>🏺</button>
                  ))}
                </div>
              )}
            </div>

            {/* Price */}
            <div style={{ display:"flex", alignItems:"baseline", gap:"10px" }}>
              <span style={{ fontSize:"28px", fontWeight:700, color:"#8B6914", fontFamily:"Georgia,serif" }}>₹{product.price.toLocaleString("en-IN")}</span>
              {product.originalPrice && (
                <>
                  <span style={{ fontSize:"16px", color:"#C4A882", textDecoration:"line-through" }}>₹{product.originalPrice.toLocaleString("en-IN")}</span>
                  <span style={{ fontSize:"12px", fontWeight:700, color:"#15803d", background:"#F0FDF4", border:"1px solid #BBF7D0", padding:"2px 7px", borderRadius:"99px" }}>
                    {Math.round((1-(product.price/product.originalPrice))*100)}% off
                  </span>
                </>
              )}
            </div>

            {/* Specs grid */}
            <div style={{ background:"#FBF7F0", borderRadius:"10px", padding:"14px", border:"1px solid #E8D5A3" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                {[
                  { label:"Age",        value:product.age        },
                  { label:"Origin",     value:product.origin     },
                  { label:"Material",   value:product.material   },
                  { label:"Dimensions", value:product.dimensions },
                  { label:"Weight",     value:product.weight     },
                  { label:"Condition",  value:product.condition  },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize:"10px", fontWeight:700, color:"#A08060", textTransform:"uppercase", letterSpacing:".06em", marginBottom:"2px" }}>{s.label}</div>
                    <div style={{ fontSize:"13px", fontWeight:500, color:"#2C1810" }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <div style={{ fontSize:"12px", fontWeight:700, color:"#6B4F12", textTransform:"uppercase", letterSpacing:".06em", marginBottom:"6px" }}>About this piece</div>
              <p style={{ fontSize:"13px", color:"#2C1810", lineHeight:1.75 }}>{product.description}</p>
            </div>

            {/* Key details */}
            <div>
              <div style={{ fontSize:"12px", fontWeight:700, color:"#6B4F12", textTransform:"uppercase", letterSpacing:".06em", marginBottom:"8px" }}>Key Details</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                {product.details.map(d => (
                  <div key={d} style={{ display:"flex", gap:"8px", alignItems:"flex-start" }}>
                    <span style={{ color:"#C9A84C", flexShrink:0, marginTop:"1px" }}>▸</span>
                    <span style={{ fontSize:"13px", color:"#6B4F12", lineHeight:1.5 }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
              {product.tags.map(t => (
                <span key={t} style={{ padding:"3px 9px", borderRadius:"99px", background:"rgba(201,168,76,.08)", border:"1px solid rgba(201,168,76,.2)", color:"#8B6914", fontSize:"11px" }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Footer actions */}
          <div style={{ padding:"16px 24px", borderTop:"1px solid #F0E4C0", background:"#FFFDF9", display:"flex", gap:"10px", flexShrink:0 }}>
            <button
              onClick={() => onCompare(product)}
              style={{ flex:1, padding:"11px", borderRadius:"9px", border:`1.5px solid ${isComparing?"#C9A84C":"#E8D5A3"}`, background:isComparing?"rgba(201,168,76,.1)":"transparent", color:isComparing?"#8B6914":"#6B4F12", fontSize:"13px", fontWeight:600, cursor:"pointer", fontFamily:"inherit", transition:"all .2s" }}
            >
              {isComparing ? "✓ Comparing" : "⚖ Compare"}
            </button>
            <button
              onClick={handleAddToOrder}
              disabled={!product.inStock}
              style={{ flex:2, padding:"11px", borderRadius:"9px", background:added?"#F0FDF4":product.inStock?"linear-gradient(135deg,#C9A84C,#8B6914)":"#E8D5A3", color:added?"#15803d":product.inStock?"#2C1810":"#A08060", border:added?"1px solid #BBF7D0":"none", fontSize:"14px", fontWeight:700, cursor:product.inStock?"pointer":"not-allowed", fontFamily:"inherit", transition:"all .2s", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}
            >
              {added ? "✓ Added to Order!" : product.inStock ? "+ Add to Order" : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Product Card ──────────────────────────────────────────────
function ProductCard({ product, onView, onCompare, isComparing }: { product:Product; onView:(p:Product)=>void; onCompare:(p:Product)=>void; isComparing:boolean }) {
  const [hovered, setHovered] = useState(false);
  const cc = conditionColor(product.condition);

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background:"#FFFDF9", border:`1px solid ${hovered?"rgba(201,168,76,.5)":"#E8D5A3"}`, borderRadius:"14px", overflow:"hidden", transition:"all .22s", transform:hovered?"translateY(-3px)":"none", boxShadow:hovered?"0 10px 28px rgba(61,43,31,.12)":"0 2px 8px rgba(61,43,31,.04)", position:"relative" }}>

      {/* Image */}
      <div onClick={() => onView(product)} style={{ background:"linear-gradient(135deg,#2C1810,#3D2B1F)", height:"180px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(201,168,76,.04) 1px,transparent 1px)", backgroundSize:"18px 18px", pointerEvents:"none" }}/>
        <div style={{ fontSize:"56px" }}>🏺</div>
        {product.featured && <div style={{ position:"absolute", top:"10px", left:"10px", padding:"3px 8px", borderRadius:"99px", background:"linear-gradient(135deg,#C9A84C,#8B6914)", color:"#2C1810", fontSize:"10px", fontWeight:700 }}>⭐ Featured</div>}
        {!product.inStock && <div style={{ position:"absolute", inset:0, background:"rgba(44,24,16,.6)", display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ padding:"6px 14px", borderRadius:"8px", background:"rgba(239,68,68,.8)", color:"#fff", fontSize:"12px", fontWeight:700 }}>Out of Stock</span></div>}
        {product.certificate && <div style={{ position:"absolute", top:"10px", right:"10px", width:"26px", height:"26px", borderRadius:"50%", background:"rgba(201,168,76,.9)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px" }}>✓</div>}
      </div>

      {/* Body */}
      <div style={{ padding:"14px 16px" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize:"10px", color:"#A08060", marginBottom:"5px", display:"flex", gap:"4px", alignItems:"center" }}>
          <span>Gallery</span><span style={{ opacity:.5 }}>›</span>
          <span>{product.category}</span><span style={{ opacity:.5 }}>›</span>
          <span style={{ color:"#8B6914", fontWeight:600 }}>{product.subCategory}</span>
        </div>

        <h3 onClick={() => onView(product)} style={{ fontSize:"14px", fontWeight:600, color:"#2C1810", fontFamily:"Georgia,serif", lineHeight:1.3, marginBottom:"8px", cursor:"pointer" }}>{product.name}</h3>

        <div style={{ display:"flex", gap:"6px", marginBottom:"10px", flexWrap:"wrap" }}>
          <span style={{ padding:"2px 7px", borderRadius:"99px", background:cc.bg, color:cc.color, border:`1px solid ${cc.border}`, fontSize:"10px", fontWeight:700 }}>{product.condition}</span>
          <span style={{ padding:"2px 7px", borderRadius:"99px", background:"#FBF7F0", color:"#6B4F12", border:"1px solid #E8D5A3", fontSize:"10px" }}>{product.age}</span>
          <span style={{ padding:"2px 7px", borderRadius:"99px", background:"#FBF7F0", color:"#6B4F12", border:"1px solid #E8D5A3", fontSize:"10px" }}>{product.origin.split(",")[0]}</span>
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" }}>
          <div>
            <div style={{ fontSize:"18px", fontWeight:700, color:"#8B6914", fontFamily:"Georgia,serif", lineHeight:1 }}>₹{product.price.toLocaleString("en-IN")}</div>
            {product.originalPrice && <div style={{ fontSize:"11px", color:"#C4A882", textDecoration:"line-through" }}>₹{product.originalPrice.toLocaleString("en-IN")}</div>}
          </div>
          <button onClick={(e) => { e.stopPropagation(); onCompare(product); }} style={{ padding:"5px 10px", borderRadius:"7px", border:`1px solid ${isComparing?"#C9A84C":"#E8D5A3"}`, background:isComparing?"rgba(201,168,76,.1)":"transparent", color:isComparing?"#8B6914":"#A08060", fontSize:"11px", cursor:"pointer", fontFamily:"inherit", fontWeight:isComparing?700:400 }}>
            {isComparing ? "✓ Comparing" : "⚖ Compare"}
          </button>
        </div>

        <button onClick={() => onView(product)} style={{ width:"100%", padding:"9px", borderRadius:"8px", background:hovered?"linear-gradient(135deg,#C9A84C,#8B6914)":"transparent", color:hovered?"#2C1810":"#8B6914", border:`1px solid ${hovered?"transparent":"rgba(201,168,76,.4)"}`, fontSize:"13px", fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"all .2s" }}>
          View Details →
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function GalleryPage() {
  const router              = useRouter();
  const [category, setCategory]         = useState("All");
  const [search, setSearch]             = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product|null>(null);
  const [compareList, setCompareList]   = useState<Product[]>([]);
  const [showCompare, setShowCompare]   = useState(false);
  const [sortBy, setSortBy]             = useState("featured");
  const [toast, setToast]               = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleCompare = (p: Product) => {
    setCompareList(prev => {
      if (prev.find(x => x.id === p.id)) return prev.filter(x => x.id !== p.id);
      if (prev.length >= 3) { showToast("Maximum 3 products can be compared at once"); return prev; }
      return [...prev, p];
    });
  };

  const handleAddToOrder = (product: Product) => {
    showToast(`${product.name.split("—")[0].trim()} added! Go to Orders to create a new order.`);
    // Store in sessionStorage for orders page to pick up
    sessionStorage.setItem("gallery_add_to_order", JSON.stringify({ name: product.name, price: product.price }));
  };

  // Sort + filter
  const filtered = PRODUCTS
    .filter(p => {
      const matchCat    = category === "All" || p.category === category;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.includes(search.toLowerCase())) || p.origin.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc")  return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "featured")   return (b.featured?1:0) - (a.featured?1:0);
      return 0;
    });

  return (
    <DashPageWrapper>
    <div style={{ maxWidth:"1100px" }}>

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", top:"24px", right:"24px", zIndex:9999, padding:"12px 16px", borderRadius:"12px", background:"#F0FDF4", border:"1px solid #BBF7D0", color:"#15803d", fontSize:"13px", fontWeight:500, boxShadow:"0 6px 24px rgba(0,0,0,.1)", display:"flex", alignItems:"center", gap:"10px", maxWidth:"380px", animation:"slideDown .3s ease", fontFamily:"inherit" }}>
          ✅ {toast}
        </div>
      )}

      {showCompare && compareList.length >= 2 && (
        <CompareModal products={compareList} onClose={() => setShowCompare(false)} onAddToOrder={handleAddToOrder} />
      )}

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToOrder={handleAddToOrder}
          onCompare={handleCompare}
          isComparing={!!compareList.find(x => x.id === selectedProduct.id)}
        />
      )}

      {/* Page header */}
      <div style={{ marginBottom:"24px" }}>
        <p style={{ fontSize:"12px", color:"#A08060", letterSpacing:".1em", textTransform:"uppercase", marginBottom:"4px" }}>Explore</p>
        <h1 style={{ fontSize:"26px", fontFamily:"Georgia,serif", color:"#2C1810", fontWeight:400 }}>Antique Gallery</h1>
        <p style={{ fontSize:"14px", color:"#A08060", marginTop:"3px" }}>{PRODUCTS.length} authenticated pieces · Click any item to view full details</p>
      </div>

      {/* Search + sort */}
      <div style={{ display:"flex", gap:"10px", marginBottom:"16px", flexWrap:"wrap" }}>
        <div style={{ flex:1, minWidth:"200px", position:"relative" }}>
          <span style={{ position:"absolute", left:"13px", top:"50%", transform:"translateY(-50%)", fontSize:"14px", pointerEvents:"none" }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, origin, material..." style={{ width:"100%", padding:"10px 14px 10px 36px", borderRadius:"9px", border:"1.5px solid #E8D5A3", fontSize:"13px", color:"#2C1810", background:"#FFFDF9", outline:"none", fontFamily:"inherit" }}/>
          {search && <button onClick={() => setSearch("")} style={{ position:"absolute", right:"13px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:"17px", color:"#A08060", padding:0, lineHeight:1 }}>×</button>}
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding:"10px 14px", borderRadius:"9px", border:"1.5px solid #E8D5A3", fontSize:"13px", color:"#2C1810", background:"#FFFDF9", outline:"none", cursor:"pointer", fontFamily:"inherit" }}>
          <option value="featured">Featured First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Category tabs */}
      <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"20px" }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{ padding:"7px 14px", borderRadius:"99px", border:`1.5px solid ${category===cat?"#C9A84C":"#E8D5A3"}`, background:category===cat?"linear-gradient(135deg,#C9A84C,#8B6914)":"transparent", color:category===cat?"#2C1810":"#6B4F12", fontSize:"12px", fontWeight:category===cat?700:500, cursor:"pointer", fontFamily:"inherit", transition:"all .18s" }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Compare bar */}
      {compareList.length > 0 && (
        <div style={{ background:"linear-gradient(135deg,#2C1810,#3D2B1F)", borderRadius:"12px", padding:"12px 18px", marginBottom:"20px", display:"flex", alignItems:"center", gap:"14px", flexWrap:"wrap" }}>
          <span style={{ fontSize:"13px", color:"rgba(245,230,200,.7)", fontWeight:600 }}>⚖ Comparing {compareList.length}/3:</span>
          <div style={{ display:"flex", gap:"8px", flex:1, flexWrap:"wrap" }}>
            {compareList.map(p => (
              <div key={p.id} style={{ display:"flex", alignItems:"center", gap:"6px", padding:"4px 10px", borderRadius:"8px", background:"rgba(201,168,76,.1)", border:"1px solid rgba(201,168,76,.2)" }}>
                <span style={{ fontSize:"12px", color:"#C9A84C", fontWeight:500 }}>{p.name.split("—")[0].trim().substring(0,20)}</span>
                <button onClick={() => handleCompare(p)} style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(201,168,76,.5)", fontSize:"14px", padding:0, lineHeight:1 }}>×</button>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:"8px" }}>
            {compareList.length >= 2 && (
              <button onClick={() => setShowCompare(true)} style={{ padding:"8px 18px", borderRadius:"8px", background:"linear-gradient(135deg,#C9A84C,#8B6914)", color:"#2C1810", border:"none", fontSize:"13px", fontWeight:700, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
                Compare Now →
              </button>
            )}
            <button onClick={() => setCompareList([])} style={{ padding:"8px 14px", borderRadius:"8px", border:"1px solid rgba(201,168,76,.2)", color:"rgba(201,168,76,.6)", background:"transparent", fontSize:"12px", cursor:"pointer", fontFamily:"inherit" }}>Clear</button>
          </div>
        </div>
      )}

      {/* Results count */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
        <p style={{ fontSize:"13px", color:"#A08060" }}>{filtered.length} {filtered.length===1?"piece":"pieces"}{category!=="All"?` in ${category}`:""}</p>
        {(category!=="All"||search) && <button onClick={() => { setCategory("All"); setSearch(""); }} style={{ fontSize:"12px", color:"#8B6914", fontWeight:600, background:"none", border:"none", cursor:"pointer", padding:0, fontFamily:"inherit" }}>Clear filters ×</button>}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px 20px", background:"#FFFDF9", border:"1px solid #E8D5A3", borderRadius:"16px" }}>
          <div style={{ fontSize:"44px", marginBottom:"14px" }}>🏺</div>
          <p style={{ fontSize:"16px", fontWeight:500, color:"#2C1810", marginBottom:"6px" }}>No pieces found</p>
          <p style={{ fontSize:"13px", color:"#A08060", marginBottom:"16px" }}>Try different filters or search terms</p>
          <button onClick={() => { setCategory("All"); setSearch(""); }} style={{ padding:"9px 20px", borderRadius:"8px", background:"linear-gradient(135deg,#C9A84C,#8B6914)", color:"#2C1810", border:"none", fontSize:"13px", fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Show All Pieces</button>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"18px" }}>
          {filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onView={setSelectedProduct}
              onCompare={handleCompare}
              isComparing={!!compareList.find(x => x.id === product.id)}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideLeft{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
        @keyframes scaleIn {from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        input::placeholder{color:#C4A882;}
        input:focus{border-color:#C9A84C !important;}
      `}</style>
    </div>
    </DashPageWrapper>
  );
}
