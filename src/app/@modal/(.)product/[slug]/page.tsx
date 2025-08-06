'use client'

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/slugs';
import { ProductModal } from '@/components/ProductModal';

interface InterceptedProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function InterceptedProductPage({ params }: InterceptedProductPageProps) {
  const router = useRouter();
  const { slug } = use(params);
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="fixed inset-0 z-50 animate-in fade-in duration-300">
      <ProductModal
        product={product}
        onClose={() => router.back()}
      />
    </div>
  );
}