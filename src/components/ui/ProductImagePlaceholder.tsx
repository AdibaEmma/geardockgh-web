import type { LucideIcon } from 'lucide-react';

interface ProductImagePlaceholderProps {
  name?: string;
  className?: string;
  icon?: LucideIcon;
}

export function ProductImagePlaceholder({ name, className = '', icon: Icon }: ProductImagePlaceholderProps) {
  return (
    <div
      className={`product-image-placeholder ${className}`}
      role="img"
      aria-label={name ? `${name} placeholder` : 'Product placeholder'}
    >
      {Icon ? (
        <Icon size={32} className="placeholder-icon" />
      ) : (
        <span className="placeholder-monogram">GD</span>
      )}
    </div>
  );
}
