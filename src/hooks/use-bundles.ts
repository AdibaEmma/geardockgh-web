'use client';

import { useQuery } from '@tanstack/react-query';
import { getFeaturedBundles, getBundle } from '@/lib/api/bundles';

export function useFeaturedBundles() {
  return useQuery({
    queryKey: ['bundles', 'featured'],
    queryFn: getFeaturedBundles,
  });
}

export function useBundle(slug: string) {
  return useQuery({
    queryKey: ['bundle', slug],
    queryFn: () => getBundle(slug),
    enabled: !!slug,
  });
}
