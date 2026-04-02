import { useState } from "react";
import { Plus, Trash2, Star, StarOff, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/contexts/ProductContext";

interface ReleaseEntry {
  productId: string;
  featured: boolean;
}

export default function NewReleases() {
  const { products } = useProducts();
  const [releases, setReleases] = useState<ReleaseEntry[]>([
    { productId: "1", featured: true },
    { productId: "2", featured: false },
  ]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const releaseProductIds = new Set(releases.map((r) => r.productId));
  const availableProducts = products.filter((p) => !releaseProductIds.has(p.id) && p.active);
  const filteredAvailable = availableProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  const addToReleases = (productId: string) => {
    setReleases([...releases, { productId, featured: false }]);
  };

  const removeFromReleases = (productId: string) => {
    setReleases(releases.filter((r) => r.productId !== productId));
  };

  const toggleFeatured = (productId: string) => {
    setReleases(releases.map((r) => r.productId === productId ? { ...r, featured: !r.featured } : r));
  };

  const moveUp = (i: number) => {
    if (i === 0) return;
    const arr = [...releases];
    [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
    setReleases(arr);
  };

  const moveDown = (i: number) => {
    if (i === releases.length - 1) return;
    const arr = [...releases];
    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
    setReleases(arr);
  };

  const getProduct = (id: string) => products.find((p) => p.id === id);

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">New Releases</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Products</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading">Select Products for New Releases</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
              />
              {filteredAvailable.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {availableProducts.length === 0 ? "All active products are already in New Releases." : "No matching products."}
                </p>
              )}
              {filteredAvailable.map((p) => {
                const save = p.originalPrice > 0 ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
                return (
                  <div key={p.id} className="flex items-center justify-between border border-border rounded-md p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {p.images[0] && (
                        <div className="w-10 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                          <img src={p.images[0]} alt="" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ₹{p.price.toLocaleString()} <span className="line-through ml-1">₹{p.originalPrice.toLocaleString()}</span>
                          {save > 0 && <span className="ml-1 font-heading">({save}% off)</span>}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => addToReleases(p.id)}>
                      <Plus className="h-3.5 w-3.5 mr-1" />Add
                    </Button>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Select products from your catalog to display in the "New Releases" grid on the storefront. Drag to reorder, star to feature.
      </p>

      {releases.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-md text-muted-foreground text-sm">
          No products in New Releases yet. Click "Add Products" to select from your catalog.
        </div>
      ) : (
        <div className="table-container">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="w-16 p-3 font-heading text-xs uppercase tracking-wider text-center">Order</th>
                <th className="text-left p-3 font-heading text-xs uppercase tracking-wider">Product</th>
                <th className="text-left p-3 font-heading text-xs uppercase tracking-wider">Category</th>
                <th className="text-right p-3 font-heading text-xs uppercase tracking-wider">Price</th>
                <th className="text-center p-3 font-heading text-xs uppercase tracking-wider">Save</th>
                <th className="text-center p-3 font-heading text-xs uppercase tracking-wider">Featured</th>
                <th className="text-right p-3 font-heading text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {releases.map((release, i) => {
                const p = getProduct(release.productId);
                if (!p) return null;
                const save = p.originalPrice > 0 ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
                return (
                  <tr key={release.productId} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="p-3 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveUp(i)}><ArrowUp className="h-3 w-3" /></Button>
                        <span className="text-xs text-muted-foreground font-heading">{i + 1}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveDown(i)}><ArrowDown className="h-3 w-3" /></Button>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {p.images[0] && (
                          <div className="w-10 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
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
                    <td className="p-3 text-right">
                      <span className="font-heading">₹{p.price.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground line-through ml-2">₹{p.originalPrice.toLocaleString()}</span>
                    </td>
                    <td className="p-3 text-center">
                      {save > 0 && (
                        <Badge variant="outline" className="text-xs font-heading">
                          {save}%
                        </Badge>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <Button variant="ghost" size="icon" onClick={() => toggleFeatured(release.productId)}>
                        {release.featured ? <Star className="h-4 w-4 fill-foreground" /> : <StarOff className="h-4 w-4" />}
                      </Button>
                    </td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="icon" onClick={() => removeFromReleases(release.productId)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
