'use client'

import { use } from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/slugs';
import { ProductModal } from '@/components/ProductModal';

interface ProductPageProps {
  params: Promise<{
    slug: string; // Now represents an index, but keeping same name for compatibility
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="fixed inset-0 z-50">
      <ProductModal
        product={product}
        onClose={() => window.history.back()}
      />
    </div>
  );
}