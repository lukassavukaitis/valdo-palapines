/** Socialinių tinklų ikonos (lucide-react 1.x prekių ženklų ikonų nebeturi). */
type IconProps = { size?: number };

export function FacebookIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 22v-8.2h2.8l.5-3.3h-3.3V8.4c0-1 .4-1.7 1.8-1.7H17V3.8C16.7 3.7 15.7 3.6 14.6 3.6c-2.5 0-4.1 1.5-4.1 4.2v2.7H7.7v3.3h2.8V22h3z" />
    </svg>
  );
}

export function InstagramIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
