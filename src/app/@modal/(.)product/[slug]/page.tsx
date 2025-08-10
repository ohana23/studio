'use client'

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { getProductByIndex } from '@/lib/slugs';
import { ProductModal } from '@/components/ProductModal';

interface InterceptedProductPageProps {
  params: Promise<{
    slug: string; // Now represents an index, but keeping same name for compatibility
  }>;
}

export default function InterceptedProductPage({ params }: InterceptedProductPageProps) {
  const router = useRouter();
  const { slug } = use(params);
  const product = getProductByIndex(slug);

  if (!product) {
    notFound();
  }

  const handleClose = () => {
    // Safari-compatible navigation using window.history instead of router.back()
    // This prevents issues with parallel routes in Safari
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback to navigate to home page
      router.push('/');
    }
  };

  return (
    <div className="fixed inset-0 z-50 animate-in fade-in duration-300">
      <ProductModal
        product={product}
        onClose={handleClose}
      />
    </div>
  );
}