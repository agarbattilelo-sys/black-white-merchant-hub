import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProductProvider } from "./contexts/ProductContext";
import { CategorySliderProvider } from "./contexts/CategorySliderContext";
import { AdminLayout } from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Reels from "./pages/Reels";
import Banners from "./pages/Banners";
import CollectionBanners from "./pages/CollectionBanners";
import NewReleases from "./pages/NewReleases";
import Orders from "./pages/Orders";
import Categories from "./pages/Categories";
import CategorySlider from "./pages/CategorySlider";
import Announcements from "./pages/Announcements";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CategorySliderProvider>
      <ProductProvider>
        <BrowserRouter>
          <AdminLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/reels" element={<Reels />} />
              <Route path="/banners" element={<Banners />} />
              <Route path="/collections" element={<CollectionBanners />} />
              <Route path="/new-releases" element={<NewReleases />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/category-slider" element={<CategorySlider />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AdminLayout>
        </BrowserRouter>
      </ProductProvider>
      </CategorySliderProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
