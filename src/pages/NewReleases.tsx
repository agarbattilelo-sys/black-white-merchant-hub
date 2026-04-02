import { useState } from "react";
import { Plus, Trash2, Star, StarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Release {
  id: string;
  name: string;
  price: number;
  releaseDate: string;
  featured: boolean;
}

const initialReleases: Release[] = [
  { id: "1", name: "Obsidian Hoodie", price: 79.99, releaseDate: "2026-04-05", featured: true },
  { id: "2", name: "Marble Sling Bag", price: 49.99, releaseDate: "2026-04-07", featured: false },
  { id: "3", name: "Phantom Runners", price: 139.99, releaseDate: "2026-04-10", featured: true },
];

export default function NewReleases() {
  const [releases, setReleases] = useState<Release[]>(initialReleases);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", releaseDate: "" });

  const addRelease = () => {
    if (!form.name || !form.price) return;
    setReleases([...releases, { id: Date.now().toString(), name: form.name, price: Number(form.price), releaseDate: form.releaseDate, featured: false }]);
    setForm({ name: "", price: "", releaseDate: "" });
    setOpen(false);
  };

  const toggleFeatured = (id: string) => setReleases(releases.map((r) => r.id === id ? { ...r, featured: !r.featured } : r));

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">New Releases</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Release</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-heading">Add New Release</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div><Label>Product Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Price ($)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
                <div><Label>Release Date</Label><Input type="date" value={form.releaseDate} onChange={(e) => setForm({ ...form, releaseDate: e.target.value })} /></div>
              </div>
              <Button onClick={addRelease} className="w-full">Add Release</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="table-container">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="text-left p-3 font-heading text-xs uppercase tracking-wider">Product</th>
              <th className="text-right p-3 font-heading text-xs uppercase tracking-wider">Price</th>
              <th className="text-left p-3 font-heading text-xs uppercase tracking-wider">Release Date</th>
              <th className="text-center p-3 font-heading text-xs uppercase tracking-wider">Featured</th>
              <th className="text-right p-3 font-heading text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {releases.map((r) => (
              <tr key={r.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="p-3 font-medium">{r.name}</td>
                <td className="p-3 text-right font-heading">${r.price.toFixed(2)}</td>
                <td className="p-3 text-muted-foreground">{r.releaseDate}</td>
                <td className="p-3 text-center">
                  <Button variant="ghost" size="icon" onClick={() => toggleFeatured(r.id)}>
                    {r.featured ? <Star className="h-4 w-4 fill-foreground" /> : <StarOff className="h-4 w-4" />}
                  </Button>
                </td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => setReleases(releases.filter((x) => x.id !== r.id))}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
