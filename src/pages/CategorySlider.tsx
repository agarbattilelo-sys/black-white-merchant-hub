import { useState } from "react";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useCategorySlider, type CategorySliderItem, type SubItem } from "@/contexts/CategorySliderContext";

const emptyForm = { label: "", href: "/", hasDropdown: false, sub: [] as SubItem[], active: true };

export default function CategorySlider() {
  const { sliderItems: items, setSliderItems: setItems } = useCategorySlider();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CategorySliderItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const openAdd = () => { setEditing(null); setForm({ ...emptyForm, sub: [] }); setOpen(true); };
  const openEdit = (item: CategorySliderItem) => {
    setEditing(item);
    setForm({ label: item.label, href: item.href, hasDropdown: item.hasDropdown, sub: [...item.sub], active: item.active });
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.label) return;
    const cleanSub = form.hasDropdown ? form.sub.filter((s) => s.label.trim()) : [];
    if (editing) {
      setItems(items.map((it) => it.id === editing.id ? { ...it, ...form, sub: cleanSub } : it));
    } else {
      setItems([...items, { id: Date.now().toString(), ...form, sub: cleanSub }]);
    }
    setOpen(false);
  };

  const deleteItem = (id: string) => setItems(items.filter((it) => it.id !== id));
  const toggleActive = (id: string) => setItems(items.map((it) => it.id === id ? { ...it, active: !it.active } : it));

  const moveUp = (i: number) => { if (i === 0) return; const arr = [...items]; [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; setItems(arr); };
  const moveDown = (i: number) => { if (i === items.length - 1) return; const arr = [...items]; [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; setItems(arr); };

  const updateSub = (i: number, field: keyof SubItem, value: string) => {
    const s = [...form.sub]; s[i] = { ...s[i], [field]: value }; setForm({ ...form, sub: s });
  };
  const addSub = () => setForm({ ...form, sub: [...form.sub, { label: "", href: "#" }] });
  const removeSub = (i: number) => setForm({ ...form, sub: form.sub.filter((_, idx) => idx !== i) });

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Category Slider</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Menu Item</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading">{editing ? "Edit" : "Add"} Menu Item</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Label *</Label><Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Topwear" /></div>
                <div><Label>Link URL</Label><Input value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} placeholder="/" /></div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.hasDropdown} onCheckedChange={(v) => setForm({ ...form, hasDropdown: v, sub: v && form.sub.length === 0 ? [{ label: "", href: "#" }] : form.sub })} />
                <Label className="mb-0">Has Dropdown (subcategories)</Label>
              </div>
              {form.hasDropdown && (
                <fieldset className="border border-border rounded-md p-4 space-y-3">
                  <legend className="font-heading text-xs uppercase tracking-widest px-2 text-muted-foreground">Subcategories</legend>
                  {form.sub.map((sub, i) => (
                    <div key={i} className="flex gap-2">
                      <Input value={sub.label} onChange={(e) => updateSub(i, "label", e.target.value)} placeholder="Subcategory name" className="flex-1" />
                      <Input value={sub.href} onChange={(e) => updateSub(i, "href", e.target.value)} placeholder="#" className="w-24" />
                      {form.sub.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeSub(i)}><Trash2 className="h-3.5 w-3.5" /></Button>}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addSub}><Plus className="h-3.5 w-3.5 mr-1" />Add Subcategory</Button>
                </fieldset>
              )}
              <div className="flex items-center gap-3">
                <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
                <Label className="mb-0">Active</Label>
              </div>
              <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Add"} Item</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Manage the navigation menu items shown in the header slider. Items with dropdowns expand to show subcategories.
      </p>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item.id}>
            <div className={`flex items-center justify-between border rounded-md p-3 transition-colors ${item.active ? "border-foreground/20 bg-card" : "border-border bg-muted/30 opacity-60"}`}>
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveUp(i)}><ArrowUp className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveDown(i)}><ArrowDown className="h-3 w-3" /></Button>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{item.label}</p>
                    {item.hasDropdown && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground font-heading">
                        {item.sub.length} subs
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-heading">{item.href}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {item.hasDropdown && (
                  <Button variant="ghost" size="icon" onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}>
                    {expandedRow === item.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </Button>
                )}
                <Switch checked={item.active} onCheckedChange={() => toggleActive(item.id)} />
                <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
            {expandedRow === item.id && item.sub.length > 0 && (
              <div className="ml-12 mt-1 mb-2 space-y-1">
                {item.sub.map((sub, si) => (
                  <div key={si} className="flex items-center gap-2 text-sm text-muted-foreground px-3 py-1.5 bg-muted/50 rounded">
                    <span className="text-xs">↳</span>
                    <span>{sub.label}</span>
                    <span className="text-xs font-heading ml-auto">{sub.href}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
