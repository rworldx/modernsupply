import {
  Candy, Croissant, Cookie, IceCream, IceCreamCone, CupSoda, Milk,
  Palette, Nut, Coffee, Sparkles,
} from "lucide-react";

/**
 * The category glyph for a product tile (works for both london & cremino "cr-" ids).
 *
 * Returns the rendered icon rather than the icon's component type. Handing back a
 * type and rendering it as `<Icon />` at the call site makes the element type a
 * value produced during render: React cannot know it is the same component across
 * renders, so it is free to unmount the old one and mount a new one, discarding
 * the element's state and restarting any transition. These glyphs animate on
 * hover, so that is a real cost rather than only a lint complaint.
 */
export function CategoryGlyph({
  categoryId,
  className,
  strokeWidth = 0.75,
}: {
  categoryId: string;
  className?: string;
  strokeWidth?: number;
}) {
  const props = { className, strokeWidth };
  const id = categoryId.replace(/^cr-/, "").toLowerCase();

  if (id.includes("fill")) return <Candy {...props} />;
  if (id.includes("sauce")) return <Milk {...props} />;
  if (id.includes("puree")) return <IceCreamCone {...props} />;
  if (id.includes("readymix")) return <Croissant {...props} />;
  if (id.includes("icecream")) return <IceCream {...props} />;
  if (id.includes("syrup") || id.includes("slush")) return <CupSoda {...props} />;
  if (id.includes("gelato")) return <IceCream {...props} />;
  if (id.includes("frappe")) return <Coffee {...props} />;
  if (id.includes("color")) return <Palette {...props} />;
  if (id.includes("nut")) return <Nut {...props} />;
  if (id.includes("wafer") || id.includes("toffee") || id.includes("truffle"))
    return <Cookie {...props} />;
  if (id.includes("sugar") || id.includes("choc")) return <Candy {...props} />;
  return <Sparkles {...props} />;
}

// Product tiles used to be filled with a gradient hashed from the product id, so
// a grid of 40 products came out as 40 unrelated hues. Until real photography
// exists the tile is a single neutral surface and the category icon carries the
// recognition — a uniform grid reads as a catalogue, a random one reads as noise.
