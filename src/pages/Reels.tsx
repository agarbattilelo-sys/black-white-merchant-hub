import { useState } from "react";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Reel {
  id: string;
  title: string;
  url: string;
  addedAt: string;
}

const initialReels: Reel[] = [
  { id: "1", title: "Summer Collection Drop", url: "https://www.instagram.com/reel/example1", addedAt: "2026-03-28" },
  { id: "2", title: "Behind the Scenes", url: "https://www.instagram.com/reel/example2", addedAt: "2026-03-30" },
];

export default function Reels() {
  const [reels, setReels] = useState<Reel[]>(initialReels);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [showForm, setShowForm] = useState(false);

  const addReel = () => {
    if (!title || !url) return;
    setReels([{ id: Date.now().toString(), title, url, addedAt: new Date().toISOString().split("T")[0] }, ...reels]);
    setTitle("");
    setUrl("");
    setShowForm(false);
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Instagram Reels</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />Add Reel
        </Button>
      </div>

      {showForm && (
        <div className="border border-border rounded-md p-4 mb-6 bg-card">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Reel title" /></div>
            <div><Label>Instagram URL</Label><Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.instagram.com/reel/..." /></div>
          </div>
          <Button onClick={addReel} className="mt-4">Save Reel</Button>
        </div>
      )}

      <div className="grid gap-3">
        {reels.map((r) => (
          <div key={r.id} className="flex items-center justify-between border border-border rounded-md p-4 hover:bg-muted/50 transition-colors">
            <div>
              <p className="font-medium">{r.title}</p>
              <p className="text-xs text-muted-foreground font-heading mt-1">{r.addedAt}</p>
            </div>
            <div className="flex items-center gap-2">
              <a href={r.url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon"><ExternalLink className="h-3.5 w-3.5" /></Button>
              </a>
              <Button variant="ghost" size="icon" onClick={() => setReels(reels.filter((x) => x.id !== r.id))}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
