import { createContext, useContext, useState, ReactNode } from "react";

export interface ProductOffer {
  amount: string;
  condition: string;
  code: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  category: string;
  stock: number;
  description: string;
  stylingTip: string;
  images: string[];
  sizes: string[];
  material: string;
  fit: string;
  print: string;
  pockets: string;
  waistband: string;
  care: string;
  offers: ProductOffer[];
  exchangePolicy: string[];
  active: boolean;
}

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Venom Black Cotton Pants",
    slug: "venom-black-cotton-pants",
    price: 1699,
    originalPrice: 1999,
    category: "Pants",
    stock: 45,
    description: "Venom Black Cotton Pants bring a sharp, statement edge to everyday wear.",
    stylingTip: "Pair it with Deadlines Heavyweight T-shirt and chunky sneakers.",
    images: ["/pdp-main-1.jpg", "/pdp-main-2.jpg", "/pdp-main-3.jpg", "/pdp-main-4.jpg"],
    sizes: ["26", "28", "30", "32", "34", "36"],
    material: "100% Premium Cotton (380 GSM)",
    fit: "Relaxed / Straight",
    print: "Venom graphic screen print",
    pockets: "2 side + 1 back",
    waistband: "Elastic with drawstring",
    care: "Machine wash cold, tumble dry low",
    offers: [
      { amount: "₹250 OFF", condition: "Prepaid above ₹2599", code: "LEVEL1FLEX" },
      { amount: "₹500 OFF", condition: "Prepaid above ₹3499", code: "LEVEL2FLEX" },
    ],
    exchangePolicy: ["Easy 7-day exchange from delivery date", "Product must be unused with original tags", "No questions asked — hassle-free process"],
    active: true,
  },
  {
    id: "2",
    name: "Immortal Graphic Tee",
    slug: "immortal-graphic-tee",
    price: 1399,
    originalPrice: 1699,
    category: "T-Shirts",
    stock: 30,
    description: "Bold graphic tee with premium cotton construction.",
    stylingTip: "Goes well with cargo pants and boots.",
    images: ["/product-1.jpg"],
    sizes: ["S", "M", "L", "XL"],
    material: "100% Cotton (220 GSM)",
    fit: "Regular",
    print: "Front graphic print",
    pockets: "N/A",
    waistband: "N/A",
    care: "Machine wash cold",
    offers: [],
    exchangePolicy: ["Easy 7-day exchange from delivery date"],
    active: true,
  },
];

interface ProductContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  return (
    <ProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
}
