import { NextResponse } from "next/server";
import { getActiveDiscounts } from "@/lib/discounts";
import { announcement } from "@/lib/pricing";

// Public: the single offer to advertise in the storefront popup, or null.
// force-dynamic so a newly published offer appears without a rebuild.
export const dynamic = "force-dynamic";

export async function GET() {
  const ann = announcement(await getActiveDiscounts());
  if (!ann) return NextResponse.json({ announcement: null });

  return NextResponse.json({
    announcement: {
      // The id doubles as the popup's dismissal key: change the offer, it shows again.
      id: ann.id,
      percentOff: ann.percentOff,
      titleEn: ann.titleEn ?? "",
      titleAr: ann.titleAr ?? "",
      bodyEn: ann.bodyEn ?? "",
      bodyAr: ann.bodyAr ?? "",
    },
  });
}
