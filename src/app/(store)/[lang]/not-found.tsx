import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="rail-narrow flex flex-col items-center py-32 text-center">
      <h1 className="t-h1">This page doesn&rsquo;t exist</h1>
      <p className="t-lead mt-4 max-w-[40ch]">
        The address may have changed, or the link that brought you here is out of date.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/en/brands">Browse the brands</Link>
        </Button>
        <Button asChild size="lg" variant="surface">
          <Link href="/en">Go to the home page</Link>
        </Button>
      </div>
    </div>
  );
}
