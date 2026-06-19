export function MarriageLogo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" aria-hidden>
      <path d="M4 28 H30" stroke="#21453c" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="13" cy="9.5" r="3.6" fill="#3e6b5e" />
      <path d="M13 14 C9 14 7 17 7 21 V27 H19 V21 C19 17 17 14 13 14Z" fill="#3e6b5e" />
      <circle cx="22.5" cy="9.5" r="3.6" fill="#21453c" />
      <path
        d="M22.5 14 C18.5 14 16.5 17 16.5 21 V27 H28.5 V21 C28.5 17 26.5 14 22.5 14Z"
        fill="#21453c"
      />
    </svg>
  );
}

export function MarriageWordmark({ light = false }: { light?: boolean }) {
  return (
    <span className="font-marriage-serif text-[1.05rem] font-semibold leading-none sm:text-[1.15rem]">
      <span className={light ? 'text-white/95' : 'text-marriage-body'}>Common</span>{' '}
      <span className={light ? 'text-marriage-amber' : 'text-marriage-pine-soft'}>Ground</span>
    </span>
  );
}
