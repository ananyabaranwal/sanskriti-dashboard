"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

type Product = {
  _id: string;
  name: string;
  sku?: string;
  category?: string;
  stock: number;
  reorderLevel: number;
  stockStatus: string;
  costPrice: number;
  sellingPrice: number;
  totalSold: number;
  lastSoldAt?: string;
};

function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, []);
  const c = type === "success" ? { bg: "#F0FDF4", border: "#BBF7D0", color: "#15803d", icon: "✅" } : { bg: "#FEF2F2", border: "#FECACA", color: "#dc2626", icon: "❌" };
  return (
    <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 9999, padding: "12px 16px", borderRadius: "12px", background: c.bg, border: `1px solid ${c.border}`, color: c.color, fontSize: "13px", fontWeight: 500, display: "flex", alignItems: "center", gap: "10px", fontFamily: "inherit" }}>
      <span>{c.icon}</span><span>{msg}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "17px", color: "inherit", padding: 0, opacity: .6 }}>×</button>
    </div>
  );
}

function StockBadge({ status }: { status: string }) {
  const s = {
    IN_STOCK:    { bg: "#F0FDF4", color: "#15803d", label: "In Stock" },
    LOW_STOCK:   { bg: "#FFFBEB", color: "#854d0e", label: "Low Stock" },
    OUT_OF_STOCK:{ bg: "#FEF2F2", color: "#dc2626", label: "Out of Stock" },
  }[status] || { bg: "#F5E6C8", color: "#6B4F12", label: status };
  return <span style={{ padding: "3px 8px", borderRadius: "99px", fontSize: "10px", fontWeight: 700, background: s.bg, color: s.color }}>{s.label}</span>;
}

function ProductForm({ product, onClose, onSave }: { product?: Product | null; onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({ name: product?.name || "", sku: product?.sku || "", category: product?.category || "", stock: product?.stock || 0, reorderLevel: product?.reorderLevel || 5, costPrice: product?.costPrice || 0, sellingPrice: product?.sellingPrice || 0 });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (product) await api.patch(`/admin/inventory/${product._id}`, form);
      else await api.post("/admin/inventory", form);
      onSave();
      onClose();
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(44,24,16,.5)", backdropFilter: "blur(3px)" }} onClick={onClose} />
      <div style={{ position: "relative", background: "#FFFDF9", borderRadius: "16px", padding: "28px", width: "440px", boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
        <h2 style={{ fontSize: "18px", fontFamily: "Georgia,serif", color: "#2C1810", marginBottom: "20px" }}>{product ? "Edit Product" : "Add Product"}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          {[
            { label: "Name *", key: "name", full: true },
            { label: "SKU", key: "sku" },
            { label: "Category", key: "category" },
            { label: "Stock", key: "stock", type: "number" },
            { label: "Reorder Level", key: "reorderLevel", type: "number" },
            { label: "Cost Price (₹)", key: "costPrice", type: "number" },
            { label: "Selling Price (₹)", key: "sellingPrice", type: "number" },
          ].map(f => (
            <div key={f.key} style={{ gridColumn: (f as any).full ? "1 / -1" : undefined }}>
              <label style={{ fontSize: "11px", fontWeight: 600, color: "#A08060", letterSpacing: ".06em", display: "block", marginBottom: "5px" }}>{f.label.toUpperCase()}</label>
              <input type={f.type || "text"} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value }))} style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #E8D5A3", fontSize: "13px", color: "#2C1810", background: "#FBF7F0", outline: "none", fontFamily: "inherit" }} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "9px 18px", borderRadius: "8px", border: "1px solid #E8D5A3", background: "transparent", color: "#A08060", fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ padding: "9px 18px", borderRadius: "8px", background: "linear-gradient(135deg,#C9A84C,#8B6914)", color: "#2C1810", border: "none", fontSize: "13px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit" }}>{saving ? "Saving..." : "Save"}</button>
        </div>
      </div>
    </div>
  );
}

function StockAdjustModal({ product, onClose, onSave }: { product: Product; onClose: () => void; onSave: () => void }) {
  const [type, setType] = useState("IN");
  const [qty, setQty] = useState(1);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await api.patch(`/admin/inventory/${product._id}/stock`, { type, quantity: qty, reason });
      onSave(); onClose();
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(44,24,16,.5)", backdropFilter: "blur(3px)" }} onClick={onClose} />
      <div style={{ position: "relative", background: "#FFFDF9", borderRadius: "16px", padding: "28px", width: "380px" }}>
        <h2 style={{ fontSize: "18px", fontFamily: "Georgia,serif", color: "#2C1810", marginBottom: "6px" }}>Adjust Stock</h2>
        <p style={{ fontSize: "13px", color: "#A08060", marginBottom: "20px" }}>{product.name} · Current: <strong style={{ color: "#2C1810" }}>{product.stock}</strong></p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={{ fontSize: "11px", fontWeight: 600, color: "#A08060", display: "block", marginBottom: "5px" }}>TYPE</label>
            <select value={type} onChange={e => setType(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #E8D5A3", fontSize: "13px", color: "#2C1810", background: "#FBF7F0", fontFamily: "inherit" }}>
              <option value="IN">Stock In (+)</option>
              <option value="OUT">Stock Out (−)</option>
              <option value="ADJUSTMENT">Adjustment</option>
              <option value="RETURN">Return</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: "11px", fontWeight: 600, color: "#A08060", display: "block", marginBottom: "5px" }}>QUANTITY</label>
            <input type="number" min={1} value={qty} onChange={e => setQty(Number(e.target.value))} style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #E8D5A3", fontSize: "13px", color: "#2C1810", background: "#FBF7F0", fontFamily: "inherit" }} />
          </div>
          <div>
            <label style={{ fontSize: "11px", fontWeight: 600, color: "#A08060", display: "block", marginBottom: "5px" }}>REASON</label>
            <input value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. New purchase, Damaged..." style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #E8D5A3", fontSize: "13px", color: "#2C1810", background: "#FBF7F0", fontFamily: "inherit" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px" }}>
          <button onClick={onClose} style={{ padding: "9px 18px", borderRadius: "8px", border: "1px solid #E8D5A3", background: "transparent", color: "#A08060", fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ padding: "9px 18px", borderRadius: "8px", background: "linear-gradient(135deg,#C9A84C,#8B6914)", color: "#2C1810", border: "none", fontSize: "13px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit" }}>{saving ? "Saving..." : "Adjust"}</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "low" | "out" | "dead">("all");
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [editProduct, setEditProduct] = useState<Product | null | undefined>(undefined);
  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const fetchProducts = useCallback(async (t = "all", s = "") => {
    setLoading(true);
    try {
      const endpoint = t === "low" ? "/admin/inventory/low-stock" : t === "out" ? "/admin/inventory/out-of-stock" : t === "dead" ? "/admin/inventory/dead-stock?days=30" : `/admin/inventory?search=${s}`;
      const res = await api.get(endpoint);
      setProducts(res.data.products || []);
      setTotal(res.data.total || res.data.count || res.data.products?.length || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProducts(tab, search); }, [tab]);

  const handleExport = async () => {
    try {
      const res = await api.get("/admin/export/inventory", { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a"); a.href = url; a.download = "inventory.xlsx"; a.click();
      setToast({ msg: "Exported successfully", type: "success" });
    } catch { setToast({ msg: "Export failed", type: "error" }); }
  };

  const tabs = [
    { key: "all", label: "All Products", icon: "📦" },
    { key: "low", label: "Low Stock", icon: "⚠️" },
    { key: "out", label: "Out of Stock", icon: "🔴" },
    { key: "dead", label: "Dead Stock (30d)", icon: "📉" },
  ] as const;

  return (
    <div style={{ maxWidth: "1100px" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {editProduct !== undefined && <ProductForm product={editProduct} onClose={() => setEditProduct(undefined)} onSave={() => fetchProducts(tab, search)} />}
      {adjustProduct && <StockAdjustModal product={adjustProduct} onClose={() => setAdjustProduct(null)} onSave={() => fetchProducts(tab, search)} />}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <p style={{ fontSize: "12px", color: "#A08060", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: "4px" }}>Admin</p>
          <h1 style={{ fontSize: "26px", fontFamily: "Georgia,serif", color: "#2C1810", fontWeight: 400 }}>Inventory</h1>
          <p style={{ fontSize: "14px", color: "#A08060", marginTop: "3px" }}>{total} products</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={handleExport} style={{ padding: "10px 18px", borderRadius: "9px", border: "1.5px solid #E8D5A3", background: "#FFFDF9", color: "#6B4F12", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>⬇ Export</button>
          <button onClick={() => setEditProduct(null)} style={{ padding: "10px 20px", borderRadius: "9px", background: "linear-gradient(135deg,#C9A84C,#8B6914)", color: "#2C1810", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+ Add Product</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: "8px 16px", borderRadius: "99px", fontSize: "12px", fontWeight: 600, border: `1.5px solid ${tab === t.key ? "#C9A84C" : "#E8D5A3"}`, background: tab === t.key ? "rgba(201,168,76,.12)" : "#FFFDF9", color: tab === t.key ? "#8B6914" : "#A08060", cursor: "pointer", fontFamily: "inherit" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Search (all tab only) */}
      {tab === "all" && (
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", fontSize: "14px" }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && fetchProducts("all", search)} placeholder="Search products by name, SKU, category..." style={{ width: "100%", padding: "10px 14px 10px 36px", borderRadius: "9px", border: "1.5px solid #E8D5A3", fontSize: "13px", color: "#2C1810", background: "#FFFDF9", outline: "none", fontFamily: "inherit" }} />
          </div>
          <button onClick={() => fetchProducts("all", search)} style={{ padding: "10px 20px", borderRadius: "9px", background: "#2C1810", color: "#C9A84C", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Search</button>
        </div>
      )}

      {/* Table */}
      <div style={{ background: "#FFFDF9", border: "1px solid #E8D5A3", borderRadius: "16px", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px 120px 100px 120px 110px", padding: "10px 20px", background: "linear-gradient(135deg,#2C1810,#3D2B1F)" }}>
          {["Product", "SKU", "Category", "Stock", "Status", "Price", "Actions"].map(h => (
            <div key={h} style={{ fontSize: "10px", fontWeight: 700, color: "#C9A84C", letterSpacing: ".08em", textTransform: "uppercase" }}>{h}</div>
          ))}
        </div>
        {loading ? Array(5).fill(0).map((_, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px 120px 100px 120px 110px", padding: "14px 20px", borderBottom: "1px solid #F5EDE0", gap: "10px" }}>
            {[140, 60, 80, 50, 70, 70, 80].map((w, j) => <div key={j} className="skeleton" style={{ height: "13px", width: `${w}px`, borderRadius: "4px" }} />)}
          </div>
        )) : products.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📦</div>
            <p style={{ color: "#A08060" }}>No products found</p>
          </div>
        ) : products.map((p, i) => (
          <div key={p._id} style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px 120px 100px 120px 110px", padding: "14px 20px", borderBottom: i < products.length - 1 ? "1px solid #F5EDE0" : "none", alignItems: "center", background: i % 2 === 0 ? "#FFFDF9" : "#FDFAF4" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#2C1810" }}>{p.name}</div>
              {p.lastSoldAt && <div style={{ fontSize: "10px", color: "#A08060" }}>Last sold: {new Date(p.lastSoldAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>}
            </div>
            <div style={{ fontSize: "11px", color: "#A08060", fontFamily: "monospace" }}>{p.sku || "—"}</div>
            <div style={{ fontSize: "12px", color: "#6B4F12" }}>{p.category || "—"}</div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: p.stock === 0 ? "#dc2626" : p.stock <= p.reorderLevel ? "#854d0e" : "#2C1810" }}>{p.stock}</div>
              <div style={{ fontSize: "10px", color: "#A08060" }}>reorder @ {p.reorderLevel}</div>
            </div>
            <StockBadge status={p.stockStatus} />
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#2C1810" }}>₹{p.sellingPrice.toLocaleString("en-IN")}</div>
              <div style={{ fontSize: "10px", color: "#A08060" }}>cost ₹{p.costPrice.toLocaleString("en-IN")}</div>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <button onClick={() => setAdjustProduct(p)} style={{ padding: "5px 10px", borderRadius: "6px", border: "1px solid #E8D5A3", background: "transparent", color: "#6B4F12", fontSize: "11px", cursor: "pointer", fontFamily: "inherit" }}>Stock</button>
              <button onClick={() => setEditProduct(p)} style={{ padding: "5px 10px", borderRadius: "6px", border: "1px solid #C9A84C", background: "rgba(201,168,76,.08)", color: "#8B6914", fontSize: "11px", cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
            </div>
          </div>
        ))}
      </div>
      <style>{`input::placeholder{color:#C4A882}input:focus,select:focus{border-color:#C9A84C!important}`}</style>
    </div>
  );
}
