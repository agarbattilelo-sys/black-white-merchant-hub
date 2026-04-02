import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
  image: string;
}

const initialProducts: Product[] = [
  { id: "1", name: "Classic White Tee", price: 29.99, category: "T-Shirts", stock: 45, description: "Essential cotton tee", image: "" },
  { id: "2", name: "Black Denim Jacket", price: 89.99, category: "Jackets", stock: 12, description: "Premium denim jacket", image: "" },
  { id: "3", name: "Minimalist Sneakers", price: 119.99, category: "Footwear", stock: 30, description: "Clean leather sneakers", image: "" },
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", price: "", category: "", stock: "", description: "", image: "" });

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", price: "", category: "", stock: "", description: "", image: "" });
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, price: String(p.price), category: p.category, stock: String(p.stock), description: p.description, image: p.image });
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) return;
    if (editing) {
      setProducts(products.map((p) => p.id === editing.id ? { ...p, name: form.name, price: Number(form.price), category: form.category, stock: Number(form.stock), description: form.description, image: form.image } : p));
    } else {
      setProducts([...products, { id: Date.now().toString(), name: form.name, price: Number(form.price), category: form.category, stock: Number(form.stock), description: form.description, image: form.image }]);
    }
    setOpen(false);
  };

  const handleDelete = (id: string) => setProducts(products.filter((p) => p.id !== id));

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Products</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading">{editing ? "Edit Product" : "Add Product"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Price ($)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
                <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
              </div>
              <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
              <div><Label>Image URL</Label><Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Add"} Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="table-container">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="text-left p-3 font-heading text-xs uppercase tracking-wider">Product</th>
              <th className="text-left p-3 font-heading text-xs uppercase tracking-wider">Category</th>
              <th className="text-right p-3 font-heading text-xs uppercase tracking-wider">Price</th>
              <th className="text-right p-3 font-heading text-xs uppercase tracking-wider">Stock</th>
              <th className="text-right p-3 font-heading text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-muted-foreground">{p.category}</td>
                <td className="p-3 text-right font-heading">${p.price.toFixed(2)}</td>
                <td className="p-3 text-right">{p.stock}</td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
