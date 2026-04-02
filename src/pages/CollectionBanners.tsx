import { useState } from "react";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CollectionBanner {
  id: string;
  title: string;
  imageUrl: string;
  subtypes: string[];
  align: "left" | "right";
  active: boolean;
}

const initialBanners: CollectionBanner[] = [
  {
    id: "1",
    title: "OVERSIZED TSHIRTS",
    imageUrl: "/banner-tshirts.jpg",
    subtypes: ["HEAVYWEIGHT", "LIGHTWEIGHT", "BOXY FIT", "ACID WASH"],
    align: "left",
    active: true,
  },
  {
    id: "2",
    title: "DENIM JEANS",
    imageUrl: "/banner-denim.jpg",
    subtypes: ["BAGGY JEANS", "STRAIGHT CUT JEANS", "FLARED JEANS", "PRINTED JEANS"],
    align: "right",
    active: true,
  },
];

const emptyForm = {
  title: "",
  imageUrl: "",
  subtypes: [""],
  align: "left" as "left" | "right",
  active: true,
};

export default function CollectionBanners() {
  const [banners, setBanners] = useState<CollectionBanner[]>(initialBanners);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CollectionBanner | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, subtypes: [""] });
    setOpen(true);
  };

  const openEdit = (b: CollectionBanner) => {
    setEditing(b);
    setForm({
      title: b.title,
      imageUrl: b.imageUrl,
      subtypes: b.subtypes.length > 0 ? [...b.subtypes] : [""],
      align: b.align,
      active: b.active,
    });
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.title) return;
    const cleanSubtypes = form.subtypes.filter((s) => s.trim() !== "");
    if (editing) {
      setBanners(banners.map((b) => b.id === editing.id ? { ...b, ...form, subtypes: cleanSubtypes } : b));
    } else {
      setBanners([...banners, { id: Date.now().toString(), ...form, subtypes: cleanSubtypes }]);
    }
    setOpen(false);
  };

  const deleteBanner = (id: string) => setBanners(banners.filter((b) => b.id !== id));
  const toggleActive = (id: string) => setBanners(banners.map((b) => b.id === id ? { ...b, active: !b.active } : b));

  const moveUp = (i: number) => {
    if (i === 0) return;
    const arr = [...banners];
    [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
    setBanners(arr);
  };
  const moveDown = (i: number) => {
    if (i === banners.length - 1) return;
    const arr = [...banners];
    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
    setBanners(arr);
  };

  const updateSubtype = (index: number, value: string) => {
    const s = [...form.subtypes];
    s[index] = value;
    setForm({ ...form, subtypes: s });
  };
  const addSubtype = () => setForm({ ...form, subtypes: [...form.subtypes, ""] });
  const removeSubtype = (i: number) => setForm({ ...form, subtypes: form.subtypes.filter((_, idx) => idx !== i) });

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Collection Banners</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Collection</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading">{editing ? "Edit" : "Add"} Collection Banner</DialogTitle>
            </DialogHeader>
            <div className="grid gap-5 py-2">

              <div>
                <Label>Collection Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value.toUpperCase() })} placeholder="OVERSIZED TSHIRTS" />
              </div>

              <div>
                <Label>Banner Image URL</Label>
                <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="/banner-tshirts.jpg" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Text Alignment</Label>
                  <Select value={form.align} onValueChange={(v) => setForm({ ...form, align: v as "left" | "right" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-3 pb-1">
                  <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
                  <Label className="mb-0">Active</Label>
                </div>
              </div>

              <fieldset className="border border-border rounded-md p-4 space-y-3">
                <legend className="font-heading text-xs uppercase tracking-widest px-2 text-muted-foreground">Subtypes / Categories</legend>
                {form.subtypes.map((sub, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={sub} onChange={(e) => updateSubtype(i, e.target.value.toUpperCase())} placeholder={`Subtype ${i + 1}`} className="flex-1" />
                    {form.subtypes.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeSubtype(i)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addSubtype}><Plus className="h-3.5 w-3.5 mr-1" />Add Subtype</Button>
              </fieldset>

              <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Add"} Collection</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Banner Cards */}
      <div className="space-y-3">
        {banners.map((b, i) => (
          <div
            key={b.id}
            className={`border rounded-md overflow-hidden transition-colors ${b.active ? "border-foreground/20 bg-card" : "border-border bg-muted/30 opacity-60"}`}
          >
            <div className="flex items-stretch">
              {/* Preview thumbnail */}
              <div className="w-32 h-28 bg-muted flex-shrink-0 relative overflow-hidden">
                {b.imageUrl && (
                  <img src={b.imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                )}
                <div className={`absolute inset-0 bg-foreground/40 flex items-end p-2 ${b.align === "right" ? "justify-end text-right" : "justify-start"}`}>
                  <span className="text-background text-[10px] font-heading font-bold tracking-wider leading-tight">{b.title}</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-heading font-bold text-sm tracking-wider">{b.title}</p>
                    <Badge variant="outline" className="text-[10px]">
                      {b.align === "left" ? "← Left" : "Right →"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {b.subtypes.map((s, si) => (
                      <span key={si} className="text-[11px] px-2 py-0.5 bg-muted rounded text-muted-foreground font-heading">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <div className="flex flex-col gap-0.5 mr-2">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveUp(i)}><ArrowUp className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveDown(i)}><ArrowDown className="h-3 w-3" /></Button>
                  </div>
                  <Switch checked={b.active} onCheckedChange={() => toggleActive(b.id)} />
                  <Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteBanner(b.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No collection banners yet. Add your first one above.
          </div>
        )}
      </div>
    </div>
  );
}
