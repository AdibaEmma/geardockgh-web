import Link from 'next/link';
import { getSocialLinks, getConnectLinks } from '@/lib/social-links';
import { SocialIcon } from '@/components/ui/SocialIcon';

const SHOP_LINKS = [
  { href: '/products?category=laptops-computers', label: 'Laptops & Computers' },
  { href: '/products?category=power-energy', label: 'Power & Energy' },
  { href: '/products?category=gaming-consoles', label: 'Gaming' },
  { href: '/products?category=audio-headphones', label: 'Audio & Headphones' },
];

const INFO_LINKS = [
  { href: '#how', label: 'How It Works' },
  { href: '/products', label: 'All Products' },
  { href: '/preorder', label: 'Pre-Order' },
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
  { href: '/shipping', label: 'Shipping & Delivery' },
  { href: '/about', label: 'About Us' },
  { href: '/returns', label: 'Returns & Terms' },
];

const PAYMENT_METHODS = ['MTN MoMo', 'Vodafone Cash', 'AirtelTigo', 'Visa', 'Mastercard'];

interface FooterColumnProps {
  title: string;
  links: { href: string; label: string }[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="footer-col">
      <h4>{title}</h4>
      <ul>
        {links.map((link) => {
          const isExternal = link.href.startsWith('http');
          return (
            <li key={link.label}>
              <Link
                href={link.href}
                {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Footer() {
  const connectLinks = getConnectLinks();
  const socialLinks = getSocialLinks();

  return (
    <footer className="landing-footer">
      <div className="footer-top">
        <div>
          <div className="footer-brand">
            GearDock<span>GH</span>
          </div>
          <div className="footer-tagline">
            Premium imported gear for Ghana&apos;s remote workers, creators,
            gamers, and students. Dock in. Level up.
          </div>
          <div className="payment-methods">
            {PAYMENT_METHODS.map((method) => (
              <span className="payment-badge" key={method}>{method}</span>
            ))}
          </div>
        </div>
        <FooterColumn title="Shop" links={SHOP_LINKS} />
        <FooterColumn title="Info" links={INFO_LINKS} />
        {connectLinks.length > 0 && <FooterColumn title="Connect" links={connectLinks} />}
      </div>
      <div className="footer-bottom">
        <div className="footer-copy">
          &copy; 2026 GearDockGH &middot; Built in &#x1F1EC;&#x1F1ED; <span>Ghana</span> &middot;
          All rights reserved
        </div>
        <div className="footer-socials">
          {socialLinks.map((social) => (
            <a
              className="social-link"
              href={social.href}
              key={social.label}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow GearDockGH on ${social.label}`}
            >
              <SocialIcon name={social.icon} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
