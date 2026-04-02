import { useState } from "react";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

interface Announcement {
  id: string;
  text: string;
  active: boolean;
}

const initialAnnouncements: Announcement[] = [
  { id: "1", text: "✸ USE CODE : NEW10 TO GET 10% OFF ON YOUR FIRST PREPAID ORDER ✸", active: true },
];

export default function Announcements() {
  const [items, setItems] = useState<Announcement[]>(initialAnnouncements);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState({ text: "" });

  const openAdd = () => { setEditing(null); setForm({ text: "" }); setOpen(true); };
  const openEdit = (a: Announcement) => { setEditing(a); setForm({ text: a.text }); setOpen(true); };

  const handleSave = () => {
    if (!form.text.trim()) return;
    if (editing) {
      setItems(items.map((a) => a.id === editing.id ? { ...a, text: form.text } : a));
    } else {
      setItems([...items, { id: Date.now().toString(), text: form.text, active: true }]);
    }
    setOpen(false);
  };

  const toggleActive = (id: string) => setItems(items.map((a) => a.id === id ? { ...a, active: !a.active } : a));
  const deleteItem = (id: string) => setItems(items.filter((a) => a.id !== id));
  const moveUp = (i: number) => { if (i === 0) return; const arr = [...items]; [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; setItems(arr); };
  const moveDown = (i: number) => { if (i === items.length - 1) return; const arr = [...items]; [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; setItems(arr); };

  const activeItems = items.filter((a) => a.active);

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Announcement Bar</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Announcement</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading">{editing ? "Edit" : "Add"} Announcement</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div><Label>Announcement Text *</Label><Input value={form.text} onChange={(e) => setForm({ text: e.target.value })} placeholder="✸ USE CODE : NEW10 ..." /></div>
              <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Add"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Preview */}
      {activeItems.length > 0 && (
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-heading mb-2">Preview</p>
          <div className="bg-foreground text-background py-2 rounded-md overflow-hidden">
            <div className="flex whitespace-nowrap animate-marquee-preview text-xs tracking-widest font-body">
              {activeItems.concat(activeItems).map((a, i) => (
                <span key={i} className="mx-8">{a.text}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-2">
        {items.map((a, i) => (
          <div key={a.id} className={`flex items-center justify-between border rounded-md p-3 transition-colors ${a.active ? "border-foreground/20 bg-card" : "border-border bg-muted/30 opacity-60"}`}>
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-0.5">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveUp(i)}><ArrowUp className="h-3 w-3" /></Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveDown(i)}><ArrowDown className="h-3 w-3" /></Button>
              </div>
              <p className="text-sm truncate max-w-md">{a.text}</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={a.active} onCheckedChange={() => toggleActive(a.id)} />
              <Button variant="ghost" size="icon" onClick={() => openEdit(a)}><Pencil className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="icon" onClick={() => deleteItem(a.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
