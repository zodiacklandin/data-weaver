'use client';

export function PromoBanner() {
  return (
    <a
      href="https://litbuy.com/register?inviteCode=PBYWV0N12"
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full bg-primary text-primary-foreground hover:bg-primary/90 transition"
    >
      <div className="flex w-full items-center justify-center gap-3 px-4 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.25em] sm:gap-6 sm:py-2 sm:text-xs">
        <span>SIGN UP ON LITBUY</span>
        <span>GET $500 WELCOME BONUS + 40% OFF SHIPPING</span>
      </div>
    </a>
  );
}
