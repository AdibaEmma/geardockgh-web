interface SocialLink {
  href: string;
  label: string;
  text: string;
}

const SOCIAL_CONFIG: { envKey: string; label: string; text: string }[] = [
  { envKey: 'NEXT_PUBLIC_SOCIAL_TWITTER', label: 'Twitter / X', text: '\uD835\uDD4F' },
  { envKey: 'NEXT_PUBLIC_SOCIAL_INSTAGRAM', label: 'Instagram', text: 'IG' },
  { envKey: 'NEXT_PUBLIC_SOCIAL_TIKTOK', label: 'TikTok', text: 'TT' },
  { envKey: 'NEXT_PUBLIC_SOCIAL_WHATSAPP', label: 'WhatsApp', text: 'WA' },
  { envKey: 'NEXT_PUBLIC_SOCIAL_FACEBOOK', label: 'Facebook', text: 'FB' },
];

export function getSocialLinks(): SocialLink[] {
  return SOCIAL_CONFIG
    .map(({ envKey, label, text }) => ({
      href: process.env[envKey] ?? '',
      label,
      text,
    }))
    .filter((link) => link.href !== '');
}

export function getConnectLinks(): { href: string; label: string }[] {
  return getSocialLinks().map(({ href, label }) => ({ href, label }));
}
