import { createContext, useContext, useState, ReactNode } from "react";

export interface SubItem {
  label: string;
  href: string;
}

export interface CategorySliderItem {
  id: string;
  label: string;
  href: string;
  hasDropdown: boolean;
  sub: SubItem[];
  active: boolean;
}

const initialItems: CategorySliderItem[] = [
  { id: "1", label: "Shop all", href: "/", hasDropdown: false, sub: [], active: true },
  { id: "2", label: "New Release", href: "/", hasDropdown: false, sub: [], active: true },
  { id: "3", label: "Topwear", href: "#", hasDropdown: true, sub: [
    { label: "Oversized T-Shirts", href: "#" }, { label: "Boxy Fit Tees", href: "#" },
    { label: "Acid Wash Tees", href: "#" }, { label: "Polo T-Shirts", href: "#" },
  ], active: true },
  { id: "4", label: "Bottoms", href: "#", hasDropdown: true, sub: [
    { label: "Cargo Pants", href: "#" }, { label: "Denim Jeans", href: "#" },
    { label: "Joggers", href: "#" }, { label: "Parachute Pants", href: "#" },
  ], active: true },
  { id: "5", label: "Winterwear", href: "#", hasDropdown: true, sub: [
    { label: "Hoodies", href: "#" }, { label: "Sweatshirts", href: "#" },
    { label: "Varsity Jackets", href: "#" }, { label: "Denim Jackets", href: "#" },
  ], active: true },
  { id: "6", label: "Just Caps", href: "/", hasDropdown: false, sub: [], active: true },
];

interface CategorySliderContextType {
  sliderItems: CategorySliderItem[];
  setSliderItems: React.Dispatch<React.SetStateAction<CategorySliderItem[]>>;
  /** Flat list of all unique category names (parent labels + sub labels) for product category selection */
  allCategoryNames: string[];
}

const CategorySliderContext = createContext<CategorySliderContextType | undefined>(undefined);

export function CategorySliderProvider({ children }: { children: ReactNode }) {
  const [sliderItems, setSliderItems] = useState<CategorySliderItem[]>(initialItems);

  const allCategoryNames = Array.from(new Set(
    sliderItems
      .filter((it) => it.active)
      .flatMap((it) => [
        ...(it.hasDropdown ? it.sub.map((s) => s.label) : [it.label]),
      ])
      .filter((name) => name !== "Shop all" && name !== "New Release")
  )).sort();

  return (
    <CategorySliderContext.Provider value={{ sliderItems, setSliderItems, allCategoryNames }}>
      {children}
    </CategorySliderContext.Provider>
  );
}

export function useCategorySlider() {
  const ctx = useContext(CategorySliderContext);
  if (!ctx) throw new Error("useCategorySlider must be used within CategorySliderProvider");
  return ctx;
}
