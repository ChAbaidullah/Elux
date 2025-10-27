import Loader from "@/components/Loader";
import Hero from "@/components/Hero";
import Featured from "@/components/Featured";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Loader />
      <Hero />
      <Featured />
    </main>
  );
}
