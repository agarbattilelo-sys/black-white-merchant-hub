import { useState } from "react";
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCategorySlider } from "@/contexts/CategorySliderContext";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useProducts, type Product, type ProductOffer } from "@/contexts/ProductContext";

const ALL_SIZES = ["26", "28", "30", "32", "34", "36", "38", "XS", "S", "M", "L", "XL", "XXL"];

const emptyProduct: Omit<Product, "id"> = {
  name: "", slug: "", price: 0, originalPrice: 0, category: "", stock: 0,
  description: "", stylingTip: "", images: [""], sizes: [],
  material: "", fit: "", print: "", pockets: "", waistband: "", care: "",
  offers: [], exchangePolicy: ["Easy 7-day exchange from delivery date", "Product must be unused with original tags", "No questions asked — hassle-free process"],
  active: true,
};

export default function Products() {
  const { products, setProducts } = useProducts();
  const { allCategoryNames } = useCategorySlider();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(emptyProduct);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const saveDiscount = form.originalPrice > 0 ? Math.round(((form.originalPrice - form.price) / form.originalPrice) * 100) : 0;

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyProduct, images: [""], offers: [], exchangePolicy: [...emptyProduct.exchangePolicy] });
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ ...p });
    setOpen(true);
  };

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSave = () => {
    if (!form.name || !form.price) return;
    const slug = form.slug || generateSlug(form.name);
    if (editing) {
      setProducts(products.map((p) => p.id === editing.id ? { ...p, ...form, slug } : p));
    } else {
      setProducts([...products, { id: Date.now().toString(), ...form, slug }]);
    }
    setOpen(false);
  };

  const handleDelete = (id: string) => setProducts(products.filter((p) => p.id !== id));

  const toggleSize = (size: string) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter((s) => s !== size) : [...f.sizes, size],
    }));
  };

  const updateImage = (index: number, value: string) => {
    const imgs = [...form.images];
    imgs[index] = value;
    setForm({ ...form, images: imgs });
  };
  const addImage = () => setForm({ ...form, images: [...form.images, ""] });
  const removeImage = (i: number) => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) });

  const addOffer = () => setForm({ ...form, offers: [...form.offers, { amount: "", condition: "", code: "" }] });
  const updateOffer = (i: number, field: keyof ProductOffer, value: string) => {
    const o = [...form.offers];
    o[i] = { ...o[i], [field]: value };
    setForm({ ...form, offers: o });
  };
  const removeOffer = (i: number) => setForm({ ...form, offers: form.offers.filter((_, idx) => idx !== i) });

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Products</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading">{editing ? "Edit Product" : "Add Product"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-5 py-2">
              {/* Basic Info */}
              <fieldset className="border border-border rounded-md p-4 space-y-4">
                <legend className="font-heading text-xs uppercase tracking-widest px-2 text-muted-foreground">Basic Info</legend>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Product Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })} placeholder="Venom Black Cotton Pants" /></div>
                  <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" className="text-muted-foreground" /></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><Label>Sale Price (₹) *</Label><Input type="number" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
                  <div><Label>Original Price (₹)</Label><Input type="number" value={form.originalPrice || ""} onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })} /></div>
                  <div><Label>Discount</Label><div className="h-9 flex items-center px-3 border border-border rounded-md bg-muted text-sm font-heading">{saveDiscount > 0 ? `SAVE ${saveDiscount}%` : "—"}</div></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Category</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {["T-Shirts", "Pants", "Jackets", "Footwear", "Hoodies", "Shirts", "Denim", "Accessories"].map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Stock</Label><Input type="number" value={form.stock || ""} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} /></div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
                  <Label className="mb-0">Active (visible on store)</Label>
                </div>
              </fieldset>

              {/* Images */}
              <fieldset className="border border-border rounded-md p-4 space-y-3">
                <legend className="font-heading text-xs uppercase tracking-widest px-2 text-muted-foreground">Images (Gallery)</legend>
                {form.images.map((img, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={img} onChange={(e) => updateImage(i, e.target.value)} placeholder={`Image URL ${i + 1}`} className="flex-1" />
                    {form.images.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeImage(i)}><Trash2 className="h-3.5 w-3.5" /></Button>}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addImage}><Plus className="h-3.5 w-3.5 mr-1" />Add Image</Button>
              </fieldset>

              {/* Sizes */}
              <fieldset className="border border-border rounded-md p-4">
                <legend className="font-heading text-xs uppercase tracking-widest px-2 text-muted-foreground">Available Sizes</legend>
                <div className="flex flex-wrap gap-2 mt-2">
                  {ALL_SIZES.map((size) => (
                    <button key={size} type="button" onClick={() => toggleSize(size)}
                      className={`w-11 h-11 rounded-full border-2 text-xs font-medium transition-all ${form.sizes.includes(size) ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground/50"}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Description */}
              <fieldset className="border border-border rounded-md p-4 space-y-4">
                <legend className="font-heading text-xs uppercase tracking-widest px-2 text-muted-foreground">Description</legend>
                <div><Label>Product Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <div><Label>Styling Tip</Label><Input value={form.stylingTip} onChange={(e) => setForm({ ...form, stylingTip: e.target.value })} placeholder="Pair it with..." /></div>
              </fieldset>

              {/* Product Details */}
              <fieldset className="border border-border rounded-md p-4 space-y-4">
                <legend className="font-heading text-xs uppercase tracking-widest px-2 text-muted-foreground">Product Details</legend>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Material</Label><Input value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} /></div>
                  <div><Label>Fit</Label><Input value={form.fit} onChange={(e) => setForm({ ...form, fit: e.target.value })} /></div>
                  <div><Label>Print / Design</Label><Input value={form.print} onChange={(e) => setForm({ ...form, print: e.target.value })} /></div>
                  <div><Label>Pockets</Label><Input value={form.pockets} onChange={(e) => setForm({ ...form, pockets: e.target.value })} /></div>
                  <div><Label>Waistband</Label><Input value={form.waistband} onChange={(e) => setForm({ ...form, waistband: e.target.value })} /></div>
                  <div><Label>Care Instructions</Label><Input value={form.care} onChange={(e) => setForm({ ...form, care: e.target.value })} /></div>
                </div>
              </fieldset>

              {/* Offers */}
              <fieldset className="border border-border rounded-md p-4 space-y-3">
                <legend className="font-heading text-xs uppercase tracking-widest px-2 text-muted-foreground">Available Offers</legend>
                {form.offers.map((offer, i) => (
                  <div key={i} className="flex gap-2 items-end">
                    <div className="flex-1"><Label className="text-xs">Amount</Label><Input value={offer.amount} onChange={(e) => updateOffer(i, "amount", e.target.value)} /></div>
                    <div className="flex-1"><Label className="text-xs">Condition</Label><Input value={offer.condition} onChange={(e) => updateOffer(i, "condition", e.target.value)} /></div>
                    <div className="flex-1"><Label className="text-xs">Code</Label><Input value={offer.code} onChange={(e) => updateOffer(i, "code", e.target.value)} /></div>
                    <Button variant="ghost" size="icon" onClick={() => removeOffer(i)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addOffer}><Plus className="h-3.5 w-3.5 mr-1" />Add Offer</Button>
              </fieldset>

              <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Add"} Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Product Table */}
      <div className="table-container">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="text-left p-3 font-heading text-xs uppercase tracking-wider">Product</th>
              <th className="text-left p-3 font-heading text-xs uppercase tracking-wider">Category</th>
              <th className="text-right p-3 font-heading text-xs uppercase tracking-wider">Price</th>
              <th className="text-right p-3 font-heading text-xs uppercase tracking-wider">Original</th>
              <th className="text-center p-3 font-heading text-xs uppercase tracking-wider">Sizes</th>
              <th className="text-right p-3 font-heading text-xs uppercase tracking-wider">Stock</th>
              <th className="text-center p-3 font-heading text-xs uppercase tracking-wider">Status</th>
              <th className="text-right p-3 font-heading text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <>
                <tr key={p.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {p.images[0] && (
                        <div className="w-10 h-10 bg-muted rounded overflow-hidden flex-shrink-0">
                          <img src={p.images[0]} alt="" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground font-heading">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{p.category}</td>
                  <td className="p-3 text-right font-heading">₹{p.price.toLocaleString()}</td>
                  <td className="p-3 text-right text-muted-foreground line-through">₹{p.originalPrice.toLocaleString()}</td>
                  <td className="p-3 text-center"><span className="text-xs text-muted-foreground">{p.sizes.length} sizes</span></td>
                  <td className="p-3 text-right">{p.stock}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2 py-0.5 text-xs rounded-full border ${p.active ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground border-border"}`}>
                      {p.active ? "Active" : "Draft"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => setExpandedRow(expandedRow === p.id ? null : p.id)}>
                      {expandedRow === p.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </td>
                </tr>
                {expandedRow === p.id && (
                  <tr key={`${p.id}-detail`} className="border-b border-border bg-muted/30">
                    <td colSpan={8} className="p-4">
                      <div className="grid grid-cols-3 gap-6 text-sm">
                        <div>
                          <h4 className="font-heading text-xs uppercase tracking-wider text-muted-foreground mb-2">Description</h4>
                          <p className="text-sm leading-relaxed">{p.description || "—"}</p>
                          {p.stylingTip && <p className="text-xs text-muted-foreground mt-2 italic">Tip: {p.stylingTip}</p>}
                        </div>
                        <div>
                          <h4 className="font-heading text-xs uppercase tracking-wider text-muted-foreground mb-2">Details</h4>
                          <div className="space-y-1 text-sm">
                            {p.material && <p>Material: {p.material}</p>}
                            {p.fit && <p>Fit: {p.fit}</p>}
                            {p.print && <p>Print: {p.print}</p>}
                            {p.pockets && <p>Pockets: {p.pockets}</p>}
                            {p.waistband && <p>Waistband: {p.waistband}</p>}
                            {p.care && <p>Care: {p.care}</p>}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-heading text-xs uppercase tracking-wider text-muted-foreground mb-2">Sizes & Offers</h4>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {p.sizes.map((s) => (<Badge key={s} variant="outline" className="text-xs">{s}</Badge>))}
                          </div>
                          {p.offers.length > 0 && (
                            <div className="space-y-1">
                              {p.offers.map((o, i) => (<p key={i} className="text-xs"><span className="font-medium">{o.amount}</span> — {o.condition} ({o.code})</p>))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
