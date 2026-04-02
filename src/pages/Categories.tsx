import { useState } from "react";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

interface Category {
  id: string;
  name: string;
  imageUrl: string;
  active: boolean;
}

const initialCategories: Category[] = [
  { id: "1", name: "Joggers", imageUrl: "/cat-joggers.jpg", active: true },
  { id: "2", name: "Winter Collection", imageUrl: "/cat-winter.jpg", active: true },
  { id: "3", name: "Shirts", imageUrl: "/cat-shirts.jpg", active: true },
  { id: "4", name: "Cargo Pants", imageUrl: "/cat-pants.jpg", active: true },
];

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", imageUrl: "" });

  const openAdd = () => { setEditing(null); setForm({ name: "", imageUrl: "" }); setOpen(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, imageUrl: c.imageUrl }); setOpen(true); };

  const handleSave = () => {
    if (!form.name) return;
    if (editing) {
      setCategories(categories.map((c) => c.id === editing.id ? { ...c, ...form } : c));
    } else {
      setCategories([...categories, { id: Date.now().toString(), ...form, active: true }]);
    }
    setOpen(false);
  };

  const toggleActive = (id: string) => setCategories(categories.map((c) => c.id === id ? { ...c, active: !c.active } : c));
  const deleteCategory = (id: string) => setCategories(categories.filter((c) => c.id !== id));

  const moveUp = (i: number) => {
    if (i === 0) return;
    const arr = [...categories]; [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; setCategories(arr);
  };
  const moveDown = (i: number) => {
    if (i === categories.length - 1) return;
    const arr = [...categories]; [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; setCategories(arr);
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Categories Banner</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Category</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading">{editing ? "Edit" : "Add"} Category</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div><Label>Category Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Joggers" /></div>
              <div><Label>Image URL</Label><Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="/cat-joggers.jpg" /></div>
              <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Add"} Category</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Manage the category grid displayed on the storefront. Reorder, toggle visibility, or edit each tile.
      </p>

      {/* Preview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {categories.filter((c) => c.active).map((c) => (
          <div key={c.id} className="relative aspect-[3/4] bg-muted rounded-md overflow-hidden group">
            {c.imageUrl && (
              <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
            )}
            <div className="absolute inset-0 bg-foreground/40 flex items-end p-3">
              <span className="text-background font-heading text-xs font-bold tracking-wider uppercase">{c.name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Management List */}
      <div className="space-y-2">
        {categories.map((c, i) => (
          <div
            key={c.id}
            className={`flex items-center justify-between border rounded-md p-3 transition-colors ${c.active ? "border-foreground/20 bg-card" : "border-border bg-muted/30 opacity-60"}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-0.5">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveUp(i)}><ArrowUp className="h-3 w-3" /></Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveDown(i)}><ArrowDown className="h-3 w-3" /></Button>
              </div>
              <div className="w-12 h-14 bg-muted rounded overflow-hidden flex-shrink-0">
                {c.imageUrl && <img src={c.imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />}
              </div>
              <div>
                <p className="font-medium text-sm">{c.name}</p>
                <p className="text-xs text-muted-foreground font-heading">{c.imageUrl || "No image"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={c.active} onCheckedChange={() => toggleActive(c.id)} />
              <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="icon" onClick={() => deleteCategory(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
