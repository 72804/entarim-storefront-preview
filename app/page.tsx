import { HomePage } from "@/components/home/HomePage";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { getHomepageArrivals } from "@/lib/catalog";

export const revalidate = 0;

export default async function Home() {
  const arrivals = await getHomepageArrivals();
  return (
    <StorefrontShell hideHeaderOnScroll>
      <HomePage arrivals={arrivals} />
    </StorefrontShell>
  );
}
