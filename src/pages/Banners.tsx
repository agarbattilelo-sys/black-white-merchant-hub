import { useState } from "react";
import { Plus, Trash2, Pencil, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  active: boolean;
}

const initialBanners: Banner[] = [
  { id: "1", title: "Spring Sale - 30% Off", imageUrl: "", linkUrl: "/sale", active: true },
  { id: "2", title: "Free Shipping Over $50", imageUrl: "", linkUrl: "/shipping", active: true },
  { id: "3", title: "New Arrivals", imageUrl: "", linkUrl: "/new", active: false },
];

export default function Banners() {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", imageUrl: "", linkUrl: "" });

  const addBanner = () => {
    if (!form.title) return;
    setBanners([...banners, { id: Date.now().toString(), ...form, active: true }]);
    setForm({ title: "", imageUrl: "", linkUrl: "" });
    setOpen(false);
  };

  const toggleActive = (id: string) => setBanners(banners.map((b) => b.id === id ? { ...b, active: !b.active } : b));
  const deleteBanner = (id: string) => setBanners(banners.filter((b) => b.id !== id));

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

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Banner Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Banner</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-heading">Add Banner</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Image URL</Label><Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></div>
              <div><Label>Link URL</Label><Input value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} /></div>
              <Button onClick={addBanner} className="w-full">Add Banner</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {banners.map((b, i) => (
          <div key={b.id} className={`flex items-center justify-between border rounded-md p-4 transition-colors ${b.active ? "border-foreground/20 bg-card" : "border-border bg-muted/30 opacity-60"}`}>
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveUp(i)}><ArrowUp className="h-3 w-3" /></Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveDown(i)}><ArrowDown className="h-3 w-3" /></Button>
              </div>
              <div>
                <p className="font-medium">{b.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{b.linkUrl}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={b.active} onCheckedChange={() => toggleActive(b.id)} />
              <Button variant="ghost" size="icon" onClick={() => deleteBanner(b.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
