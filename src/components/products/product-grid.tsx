import type { Product } from "@prisma/client";
import { ProductCard } from "@/components/products/product-card";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-semibold text-muted-foreground mb-2">
          محصولی یافت نشد
        </p>
        <p className="text-sm text-muted-foreground/70">
          لطفاً فیلترها را تغییر دهید یا جستجوی دیگری انجام دهید
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5 items-stretch stagger">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
