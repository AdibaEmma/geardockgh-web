interface ProductImagePlaceholderProps {
  name?: string;
  className?: string;
}

export function ProductImagePlaceholder({ name, className = '' }: ProductImagePlaceholderProps) {
  return (
    <div
      className={`product-image-placeholder ${className}`}
      role="img"
      aria-label={name ? `${name} placeholder` : 'Product placeholder'}
    >
      <span className="placeholder-monogram">GD</span>
    </div>
  );
}
