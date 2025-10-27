import products from '@/data/products';
import ProductCard from './ProductCard';

export default function Featured() {
  return (
    <section id="featured" className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">Featured Products</h2>
            <p className="text-zinc-600">Curated picks from our latest lineup</p>
          </div>
          <a href="/products" className="text-sm underline hover:opacity-80">View all</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
