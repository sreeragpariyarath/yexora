import Header from "@/components/Header";
import ScrollFlow from "@/components/flow/ScrollFlow";

export default function Home() {
  return (
    <main className="relative w-full">
      <h1 className="sr-only">Yexora IT Solutions</h1>

      {/* Nav floats over the pinned 3D scene for the whole scroll */}
      <Header className="fixed top-0 inset-x-0" />

      {/* No ancestor of ScrollFlow may be overflow-hidden: it would break position: sticky */}
      <ScrollFlow />
    </main>
  );
}
