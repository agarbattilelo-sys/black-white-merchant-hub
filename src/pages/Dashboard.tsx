import { Package, ShoppingCart, Image, Sparkles } from "lucide-react";

const stats = [
  { label: "Total Products", value: "128", icon: Package },
  { label: "Pending Orders", value: "24", icon: ShoppingCart },
  { label: "Active Banners", value: "5", icon: Image },
  { label: "New Releases", value: "12", icon: Sparkles },
];

export default function Dashboard() {
  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-heading">
                {s.label}
              </span>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold font-heading">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
