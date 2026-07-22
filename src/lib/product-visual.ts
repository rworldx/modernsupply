import {
  Candy, Croissant, Cookie, IceCream, IceCreamCone, CupSoda, Milk,
  Palette, Nut, Coffee, Sparkles, type LucideIcon,
} from "lucide-react";

// Pick an icon for a category id (works for both london & cremino "cr-" ids).
export function categoryIcon(categoryId: string): LucideIcon {
  const id = categoryId.replace(/^cr-/, "").toLowerCase();
  if (id.includes("fill")) return Candy;
  if (id.includes("sauce")) return Milk;
  if (id.includes("puree")) return IceCreamCone;
  if (id.includes("readymix")) return Croissant;
  if (id.includes("icecream")) return IceCream;
  if (id.includes("syrup") || id.includes("slush")) return CupSoda;
  if (id.includes("gelato")) return IceCream;
  if (id.includes("frappe")) return Coffee;
  if (id.includes("color")) return Palette;
  if (id.includes("nut")) return Nut;
  if (id.includes("wafer") || id.includes("toffee") || id.includes("truffle")) return Cookie;
  if (id.includes("sugar") || id.includes("choc")) return Candy;
  return Sparkles;
}

// Product tiles used to be filled with a gradient hashed from the product id, so
// a grid of 40 products came out as 40 unrelated hues. Until real photography
// exists the tile is a single neutral surface and the category icon carries the
// recognition — a uniform grid reads as a catalogue, a random one reads as noise.
