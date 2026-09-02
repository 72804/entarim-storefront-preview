import { HomePage } from "@/components/home/HomePage";
import { StorefrontShell } from "@/components/layout/StorefrontShell";

export default function Home() {
  return (
    <StorefrontShell>
      <HomePage />
    </StorefrontShell>
  );
}
