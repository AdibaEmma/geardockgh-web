interface SocialLink {
  href: string;
  label: string;
  icon: string;
}

const SOCIAL_CONFIG: { envKey: string; label: string; icon: string }[] = [
  { envKey: 'NEXT_PUBLIC_SOCIAL_TWITTER', label: 'Twitter / X', icon: 'x' },
  { envKey: 'NEXT_PUBLIC_SOCIAL_INSTAGRAM', label: 'Instagram', icon: 'instagram' },
  { envKey: 'NEXT_PUBLIC_SOCIAL_TIKTOK', label: 'TikTok', icon: 'tiktok' },
  { envKey: 'NEXT_PUBLIC_SOCIAL_WHATSAPP', label: 'WhatsApp', icon: 'whatsapp' },
  { envKey: 'NEXT_PUBLIC_SOCIAL_FACEBOOK', label: 'Facebook', icon: 'facebook' },
];

export function getSocialLinks(): SocialLink[] {
  return SOCIAL_CONFIG
    .map(({ envKey, label, icon }) => ({
      href: process.env[envKey] ?? '',
      label,
      icon,
    }))
    .filter((link) => link.href !== '');
}

export function getConnectLinks(): { href: string; label: string }[] {
  return getSocialLinks().map(({ href, label }) => ({ href, label }));
}
