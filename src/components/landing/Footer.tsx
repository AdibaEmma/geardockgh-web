import Link from 'next/link';

const SHOP_LINKS = [
  { href: '/products?category=remote-work', label: 'Remote Work' },
  { href: '/products?category=creator-tools', label: 'Creator Tools' },
  { href: '/products?category=gaming', label: 'Gaming' },
  { href: '/products?category=student-essentials', label: 'Student' },
];

const INFO_LINKS = [
  { href: '#how', label: 'How It Works' },
  { href: '/products', label: 'All Products' },
];

const CONNECT_LINKS = [
  { href: '#', label: 'Instagram' },
  { href: '#', label: 'TikTok' },
  { href: '#', label: 'Twitter / X' },
  { href: '#', label: 'WhatsApp' },
];

const SOCIALS = [
  { href: '#', label: 'Twitter / X', text: '\uD835\uDD4F' },
  { href: '#', label: 'Instagram', text: 'IG' },
  { href: '#', label: 'TikTok', text: 'TT' },
  { href: '#', label: 'WhatsApp', text: 'WA' },
];

const PAYMENT_METHODS = ['MTN MoMo', 'Vodafone Cash', 'Visa', 'Mastercard'];

interface FooterColumnProps {
  title: string;
  links: { href: string; label: string }[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="footer-col">
      <h4>{title}</h4>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
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
        <FooterColumn title="Connect" links={CONNECT_LINKS} />
      </div>
      <div className="footer-bottom">
        <div className="footer-copy">
          &copy; 2026 GearDockGH &middot; Built in &#x1F1EC;&#x1F1ED; <span>Ghana</span> &middot;
          All rights reserved
        </div>
        <div className="footer-socials">
          {SOCIALS.map((social) => (
            <a
              className="social-link"
              href={social.href}
              key={social.label}
              aria-label={`Follow GearDockGH on ${social.label}`}
            >
              {social.text}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
