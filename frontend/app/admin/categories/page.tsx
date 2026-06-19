"use client";
import { useState, useEffect, useCallback, useRef, CSSProperties } from "react";
import api from "@/lib/api";

const BURG = "#9B0020";

// ── Backend serves uploaded files (e.g. /uploads/categories/x.jpg) from its
// root, not under /api — strip a trailing "/api" off NEXT_PUBLIC_API_URL to
// get the right origin to prefix those paths with.
const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api\/?$/, "");
function resolveUploadUrl(path?: string): string {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${API_ORIGIN}${path}`;
}

type Category = {
  _id: string;
  label: string;
  slug: string;
  image: string;
  heroImage: string;
  count: string;
  displayOrder: number;
  showInHero: boolean;
  heroOrder: number;
  isActive: boolean;
};

function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position:"fixed",top:"24px",right:"24px",zIndex:9999,padding:"12px 16px",borderRadius:"12px",background:type==="success"?"#f0fdf4":"#fef2f2",border:`1px solid ${type==="success"?"#bbf7d0":"#fecaca"}`,color:type==="success"?"#15803d":"#dc2626",fontSize:"13px",fontWeight:500,display:"flex",alignItems:"center",gap:"10px",maxWidth:"380px",boxShadow:"0 4px 16px rgba(0,0,0,.08)" }}>
      {type==="success"?"✅":"❌"}<span style={{ flex:1 }}>{msg}</span>
      <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",fontSize:"16px",opacity:.6 }}>×</button>
    </div>
  );
}

const inputStyle: CSSProperties = {
  width:"100%", padding:"10px 12px", borderRadius:"8px", border:"1.5px solid #e0e0e0",
  fontSize:"13px", color:"#111", fontFamily:"inherit",
};

const labelStyle: CSSProperties = {
  fontSize:"12px", fontWeight:600, color:"#555", display:"block", marginBottom:"5px",
};

const emptyForm = { label:"", slug:"", count:"", displayOrder:0, heroOrder:0, showInHero:false, isActive:true };

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "").slice(0, 30);
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,     setLoading]    = useState(true);
  const [toast,       setToast]      = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [modalOpen,   setModalOpen]  = useState(false);
  const [editing,     setEditing]    = useState<Category | null>(null);
  const [form,        setForm]       = useState({ ...emptyForm });
  const [imageFile,        setImageFile]        = useState<File | null>(null);
  const [heroImageFile,    setHeroImageFile]    = useState<File | null>(null);
  const [imagePreview,     setImagePreview]     = useState("");
  const [heroImagePreview, setHeroImagePreview] = useState("");
  const [saving,      setSaving]      = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const imageInputRef     = useRef<HTMLInputElement>(null);
  const heroImageInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => setToast({ msg, type });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/categories");
      setCategories(res.data.categories || []);
    } catch {
      showToast("Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const resetFileState = () => {
    setImageFile(null); setHeroImageFile(null);
    setImagePreview(""); setHeroImagePreview("");
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, displayOrder: categories.length });
    resetFileState();
    setSlugTouched(false);
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({
      label: cat.label, slug: cat.slug, count: cat.count,
      displayOrder: cat.displayOrder, heroOrder: cat.heroOrder,
      showInHero: cat.showInHero, isActive: cat.isActive,
    });
    setImageFile(null); setHeroImageFile(null);
    setImagePreview(resolveUploadUrl(cat.image));
    setHeroImagePreview(resolveUploadUrl(cat.heroImage));
    setSlugTouched(true);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleLabelChange = (val: string) => {
    setForm(f => ({ ...f, label: val, slug: slugTouched ? f.slug : slugify(val) }));
  };

  const handleFile = (file: File | null, which: "image" | "heroImage") => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("Please choose an image file", "error"); return; }
    if (file.size > 3 * 1024 * 1024) { showToast("Image must be under 3MB", "error"); return; }
    const reader = new FileReader();
    reader.onload = e => {
      const dataUrl = e.target?.result as string;
      if (which === "image") { setImageFile(file); setImagePreview(dataUrl); }
      else { setHeroImageFile(file); setHeroImagePreview(dataUrl); }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!form.label.trim() || !form.slug.trim()) { showToast("Name and slug are required", "error"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("label", form.label.trim());
      fd.append("slug", form.slug.trim());
      fd.append("count", form.count);
      fd.append("displayOrder", String(form.displayOrder));
      fd.append("heroOrder", String(form.heroOrder));
      fd.append("showInHero", String(form.showInHero));
      fd.append("isActive", String(form.isActive));
      if (imageFile)     fd.append("image", imageFile);
      if (heroImageFile) fd.append("heroImage", heroImageFile);

      if (editing) {
        await api.patch(`/admin/categories/${editing._id}`, fd);
        showToast("Category updated");
      } else {
        await api.post("/admin/categories", fd);
        showToast("Category created");
      }
      setModalOpen(false);
      fetchCategories();
    } catch (e: any) {
      showToast(e.response?.data?.message || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Delete category "${cat.label}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/categories/${cat._id}`);
      showToast("Category deleted");
      fetchCategories();
    } catch (e: any) {
      showToast(e.response?.data?.message || "Delete failed", "error");
    }
  };

  return (
    <div style={{ padding:"28px 32px", fontFamily:"'Segoe UI',sans-serif" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"24px", flexWrap:"wrap", gap:"12px" }}>
        <div>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:"24px", fontWeight:700, color:"#111", marginBottom:"4px" }}>Categories</h1>
          <p style={{ fontSize:"13px", color:"#888" }}>Manage the categories shown on the gallery page's grid and hero carousel.</p>
        </div>
        <button onClick={openAdd} style={{ padding:"11px 22px", borderRadius:"8px", background:BURG, color:"#fff", border:"none", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>
          + Add Category
        </button>
      </div>

      {/* Table */}
      <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #f0f0f0", overflow:"hidden" }}>
        <div style={{ display:"grid", gridTemplateColumns:"56px 1.4fr 1fr 90px 100px 90px 80px 130px", gap:"10px", padding:"12px 16px", background:"#fafafa", borderBottom:"1px solid #f0f0f0", fontSize:"11px", fontWeight:700, color:"#999", textTransform:"uppercase", letterSpacing:".05em" }}>
          <div>Photo</div><div>Name</div><div>Slug</div><div>Count</div><div>Grid Order</div><div>Hero</div><div>Active</div><div>Actions</div>
        </div>

        {loading ? (
          <div style={{ padding:"40px", textAlign:"center", color:"#aaa", fontSize:"13px" }}>Loading…</div>
        ) : categories.length === 0 ? (
          <div style={{ padding:"40px", textAlign:"center", color:"#aaa", fontSize:"13px" }}>No categories yet — click "+ Add Category" to create one.</div>
        ) : (
          categories.map(cat => (
            <div key={cat._id} style={{ display:"grid", gridTemplateColumns:"56px 1.4fr 1fr 90px 100px 90px 80px 130px", gap:"10px", padding:"10px 16px", borderBottom:"1px solid #f5f5f5", alignItems:"center", fontSize:"13px" }}>
              <div style={{ width:"40px", height:"40px", borderRadius:"8px", overflow:"hidden", background:"#f3f1ee" }}>
                {cat.image && (
                  <img
                    src={resolveUploadUrl(cat.image)}
                    alt={cat.label}
                    style={{ width:"100%", height:"100%", objectFit:"cover" }}
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
              </div>
              <div style={{ fontWeight:600, color:"#111" }}>{cat.label}</div>
              <div style={{ color:"#888", fontFamily:"monospace", fontSize:"12px" }}>{cat.slug}</div>
              <div style={{ color:"#888" }}>{cat.count || "—"}</div>
              <div style={{ color:"#888" }}>{cat.displayOrder}</div>
              <div>
                {cat.showInHero
                  ? <span style={{ padding:"3px 8px", borderRadius:"99px", background:"#F0FDF4", color:"#15803d", fontSize:"11px", fontWeight:600 }}>#{cat.heroOrder}</span>
                  : <span style={{ color:"#ccc", fontSize:"12px" }}>off</span>}
              </div>
              <div>
                <span style={{ color: cat.isActive ? "#15803d" : "#ccc", fontSize:"16px" }}>●</span>
              </div>
              <div style={{ display:"flex", gap:"6px" }}>
                <button onClick={() => openEdit(cat)} style={{ padding:"5px 10px", borderRadius:"6px", border:"1px solid #eee", background:"#fafafa", fontSize:"12px", cursor:"pointer" }}>Edit</button>
                <button onClick={() => handleDelete(cat)} style={{ padding:"5px 10px", borderRadius:"6px", border:"1px solid #fecaca", background:"#fef2f2", color:"#dc2626", fontSize:"12px", cursor:"pointer" }}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit modal */}
      {modalOpen && (
        <div
          onClick={e => e.target === e.currentTarget && closeModal()}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:"20px" }}
        >
          <div style={{ background:"#fff", borderRadius:"16px", padding:"28px", width:"100%", maxWidth:"520px", maxHeight:"90vh", overflowY:"auto" }}>
            <h2 style={{ fontFamily:"Georgia,serif", fontSize:"19px", fontWeight:700, color:"#111", marginBottom:"18px" }}>
              {editing ? "Edit Category" : "Add Category"}
            </h2>

            <label style={labelStyle}>Name</label>
            <input value={form.label} onChange={e => handleLabelChange(e.target.value)} placeholder="e.g. Wooden Products" style={inputStyle} />

            <label style={{ ...labelStyle, marginTop:"14px" }}>
              Slug <span style={{ color:"#aaa", fontWeight:400 }}>(must match the "cat" field used on products, e.g. "wooden")</span>
            </label>
            <input
              value={form.slug}
              onChange={e => { setSlugTouched(true); setForm(f => ({ ...f, slug: slugify(e.target.value) })); }}
              placeholder="e.g. wooden"
              style={{ ...inputStyle, fontFamily:"monospace" }}
            />

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginTop:"14px" }}>
              <div>
                <label style={labelStyle}>Count text</label>
                <input value={form.count} onChange={e => setForm(f => ({ ...f, count: e.target.value }))} placeholder="e.g. 33+" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Grid order</label>
                <input type="number" value={form.displayOrder} onChange={e => setForm(f => ({ ...f, displayOrder: Number(e.target.value) }))} style={inputStyle} />
              </div>
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginTop:"16px", padding:"12px", borderRadius:"10px", background:"#fafafa", border:"1px solid #f0f0f0" }}>
              <input type="checkbox" id="showInHero" checked={form.showInHero} onChange={e => setForm(f => ({ ...f, showInHero: e.target.checked }))} style={{ width:"16px", height:"16px" }} />
              <label htmlFor="showInHero" style={{ fontSize:"13px", fontWeight:600, color:"#333", flex:1 }}>Show in hero carousel on the gallery page</label>
              {form.showInHero && (
                <input
                  type="number"
                  value={form.heroOrder}
                  onChange={e => setForm(f => ({ ...f, heroOrder: Number(e.target.value) }))}
                  placeholder="Order"
                  style={{ ...inputStyle, width:"70px", padding:"6px 8px" }}
                />
              )}
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginTop:"10px" }}>
              <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} style={{ width:"16px", height:"16px" }} />
              <label htmlFor="isActive" style={{ fontSize:"13px", fontWeight:600, color:"#333" }}>Active (visible on the public gallery page)</label>
            </div>

            {/* Image uploads */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginTop:"18px" }}>
              <div>
                <label style={{ ...labelStyle, marginBottom:"6px" }}>Grid thumbnail</label>
                <div
                  onClick={() => imageInputRef.current?.click()}
                  style={{ height:"90px", borderRadius:"10px", border:"1.5px dashed #ddd", background:"#fafafa", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", overflow:"hidden" }}
                >
                  {imagePreview ? <img src={imagePreview} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <span style={{ fontSize:"12px", color:"#aaa" }}>📁 Upload</span>}
                </div>
                <input ref={imageInputRef} type="file" accept="image/*" onChange={e => handleFile(e.target.files?.[0] || null, "image")} style={{ display:"none" }} />
              </div>
              <div>
                <label style={{ ...labelStyle, marginBottom:"6px" }}>Hero banner <span style={{ color:"#aaa", fontWeight:400 }}>(optional)</span></label>
                <div
                  onClick={() => heroImageInputRef.current?.click()}
                  style={{ height:"90px", borderRadius:"10px", border:"1.5px dashed #ddd", background:"#fafafa", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", overflow:"hidden" }}
                >
                  {heroImagePreview ? <img src={heroImagePreview} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <span style={{ fontSize:"12px", color:"#aaa" }}>📁 Upload</span>}
                </div>
                <input ref={heroImageInputRef} type="file" accept="image/*" onChange={e => handleFile(e.target.files?.[0] || null, "heroImage")} style={{ display:"none" }} />
              </div>
            </div>

            <div style={{ display:"flex", gap:"10px", marginTop:"24px" }}>
              <button onClick={closeModal} style={{ flex:1, padding:"12px", borderRadius:"9px", border:"1px solid #ddd", background:"#fff", color:"#555", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>Cancel</button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                style={{ flex:1, padding:"12px", borderRadius:"9px", border:"none", background: saving ? "#ccc" : BURG, color:"#fff", fontSize:"13px", fontWeight:700, cursor: saving ? "not-allowed" : "pointer" }}
              >
                {saving ? "Saving…" : editing ? "Save Changes" : "Create Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
