'use client';

import { use } from 'react';
import { ProductDetail } from '@/components/shop/ProductDetail';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = use(params);

  return <ProductDetail slug={slug} />;
}
