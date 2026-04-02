import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  items: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
}

const initialOrders: Order[] = [
  { id: "ORD-001", customer: "Alex Morgan", email: "alex@example.com", total: 149.98, items: 2, status: "pending", date: "2026-04-01" },
  { id: "ORD-002", customer: "Sam Rivera", email: "sam@example.com", total: 89.99, items: 1, status: "processing", date: "2026-03-31" },
  { id: "ORD-003", customer: "Jordan Lee", email: "jordan@example.com", total: 259.97, items: 3, status: "shipped", date: "2026-03-30" },
  { id: "ORD-004", customer: "Casey Kim", email: "casey@example.com", total: 119.99, items: 1, status: "delivered", date: "2026-03-28" },
  { id: "ORD-005", customer: "Taylor Chen", email: "taylor@example.com", total: 49.99, items: 1, status: "cancelled", date: "2026-03-27" },
];

const statusColors: Record<Order["status"], string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  processing: "bg-primary/10 text-foreground border-primary/20",
  shipped: "bg-accent text-accent-foreground border-border",
  delivered: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selected, setSelected] = useState<Order | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const updateStatus = (id: string, status: Order["status"]) => {
    setOrders(orders.map((o) => o.id === id ? { ...o, status } : o));
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Orders</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="table-container">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="text-left p-3 font-heading text-xs uppercase tracking-wider">Order</th>
              <th className="text-left p-3 font-heading text-xs uppercase tracking-wider">Customer</th>
              <th className="text-right p-3 font-heading text-xs uppercase tracking-wider">Total</th>
              <th className="text-center p-3 font-heading text-xs uppercase tracking-wider">Status</th>
              <th className="text-left p-3 font-heading text-xs uppercase tracking-wider">Date</th>
              <th className="text-right p-3 font-heading text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="p-3 font-heading font-medium">{o.id}</td>
                <td className="p-3">{o.customer}</td>
                <td className="p-3 text-right font-heading">${o.total.toFixed(2)}</td>
                <td className="p-3 text-center">
                  <span className={`inline-block px-2 py-0.5 text-xs rounded-full border ${statusColors[o.status]}`}>
                    {o.status}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground">{o.date}</td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => setSelected(o)}>
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">Order {selected?.id}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Customer</span><p className="font-medium">{selected.customer}</p></div>
                <div><span className="text-muted-foreground">Email</span><p className="font-medium">{selected.email}</p></div>
                <div><span className="text-muted-foreground">Items</span><p className="font-medium">{selected.items}</p></div>
                <div><span className="text-muted-foreground">Total</span><p className="font-heading font-bold">${selected.total.toFixed(2)}</p></div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Update Status</span>
                <Select value={selected.status} onValueChange={(v) => { updateStatus(selected.id, v as Order["status"]); setSelected({ ...selected, status: v as Order["status"] }); }}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
