import Image from 'next/image';
import { FileCheck, FolderKanban, LineChart, ShieldCheck, type LucideIcon } from 'lucide-react';
import { SESSION_DURATION_HOURS } from '@/constants/auth';
import { LoginForm } from '@/features/auth/components/LoginForm';

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

// Icons for Evidence & Records / Analytics intentionally match the sidebar's Evidence Vault /
// Analytics nav icons — the platform described here is the one behind the login, not a pitch.
const FEATURES: Feature[] = [
  { icon: FolderKanban, title: 'Case Management', description: 'Manage and track KYC cases.' },
  { icon: ShieldCheck, title: 'Quality Management', description: 'Review and resolve post-QC defects.' },
  { icon: FileCheck, title: 'Evidence & Records', description: 'Secure documentation and findings.' },
  { icon: LineChart, title: 'Analytics', description: 'Insights and trends to improve quality.' },
];

// Lowercase wordmark with a red arc riding over it, echoing Citi's own brand mark
// (an original curve drawn for this UI, not traced from the official logo artwork).
function CitiLogo() {
  return (
    <div className="relative inline-block leading-none">
      <svg
        className="pointer-events-none absolute -top-[11px] left-0 w-full"
        viewBox="0 0 100 22"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M 2 19 Q 50 -7 98 15" fill="none" stroke="#E21836" strokeWidth="6" strokeLinecap="round" />
      </svg>
      <span className="relative text-[22px] font-black tracking-tight text-white lowercase">citi</span>
    </div>
  );
}

export function LoginView() {
  return (
    <main className="relative isolate min-h-dvh w-full overflow-hidden bg-[#071B41] text-white font-sans antialiased">
      {/* One continuous background image across the whole viewport — never cropped into a panel.
          No z-index here: plain DOM order (image, then overlay, then z-10 content) keeps it
          reliably above `main`'s own background fallback, which a negative z-index would sit
          behind instead of in front of. */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image src="/brand/citi-office-skyline.png" alt="" fill priority quality={90} sizes="100vw" className="object-cover object-center" />
      </div>

      {/* Gradient overlay: opaque navy on the left for text/card legibility, fading to fully
          transparent toward the right so the office photo itself stays visible there. A second,
          lighter wash covers mobile (where the card sits centered over the image) for contrast. */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(4,25,60,0.45),rgba(4,25,60,0.62))] lg:bg-[linear-gradient(to_right,rgba(4,25,60,0.78)_0%,rgba(4,25,60,0.42)_38%,rgba(4,25,60,0.08)_68%,rgba(4,25,60,0)_82%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex min-h-dvh flex-col lg:block">
        {/* Branding — sits directly on the background, not inside its own panel. */}
        <div className="px-5 pt-6 pb-4 sm:px-8 sm:pt-8 lg:absolute lg:left-14 lg:top-12 lg:bottom-12 lg:flex lg:w-[46%] lg:max-w-xl lg:flex-col lg:justify-between lg:px-0 lg:py-0">
          <div>
            <CitiLogo />
            <p className="mt-2.5 text-[13px] sm:text-sm font-bold tracking-wide text-white leading-tight">KYC Case &amp; Quality Hub</p>
            <p className="mt-0.5 text-[11px] text-blue-200/80 tracking-[0.12em] uppercase font-semibold">
              Case Management · Quality · Analytics
            </p>
          </div>

          <div className="hidden lg:block">
            <p className="text-[32px] font-bold tracking-tight leading-[1.2] text-white">
              Manage KYC cases.
              <br />
              Drive quality.
              <br />
              Improve operations.
            </p>
            <p className="mt-4 max-w-md text-sm text-blue-100/85 leading-relaxed">
              A centralized workspace for KYC case management, quality assurance, evidence and operational analytics.
            </p>

            <ul className="mt-8 flex flex-col gap-2">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex items-center gap-3 rounded-[10px] px-2.5 py-2">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[8px] border border-white/15 bg-white/[0.06]">
                    <Icon className="w-3.5 h-3.5 text-blue-200" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white">{title}</p>
                    <p className="text-[11px] text-blue-200/70">{description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="hidden lg:block text-[11px] text-blue-200/70">Internal system. For authorized personnel only.</p>
        </div>

        {/* Login card — floats over the same background, never inside a white column. */}
        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8 sm:py-10 lg:absolute lg:right-[8%] lg:top-1/2 lg:flex-none lg:-translate-y-1/2 lg:px-0 lg:py-0">
          <div className="w-full max-w-[440px]">
            <div className="relative bg-white border border-neutral-200/80 shadow-[0_24px_64px_-12px_rgba(4,12,32,0.45)] rounded-[16px] overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#071B41] via-[#0569FF] to-[#2F80ED]" aria-hidden="true" />

              <div className="px-6 pt-8 pb-6 sm:px-9 sm:pt-10 border-b border-neutral-100">
                <span className="text-[11px] text-[#0569FF] font-extrabold uppercase tracking-[0.2em]">Secure Access</span>
                <h1 className="mt-2 text-2xl font-bold text-neutral-900 tracking-tight">Welcome back.</h1>
                <p className="mt-1.5 text-sm text-neutral-500">Sign in to your quality workspace.</p>
              </div>

              <div className="px-6 py-7 sm:px-9">
                <LoginForm />
              </div>

              <div className="px-6 py-4 sm:px-9 bg-[#F6F8FB] border-t border-neutral-200/70 text-[11px] text-neutral-500 leading-relaxed">
                <span className="font-semibold text-neutral-600">Internal access.</span> Authorized Citi personnel only. Sessions end
                after {SESSION_DURATION_HOURS} hours or at sign out.
              </div>
            </div>

            <p className="mt-5 text-center text-[11px] text-blue-100/80 drop-shadow-[0_1px_4px_rgba(4,12,32,0.6)]">
              KYC Case &amp; Quality Hub &bull; Case Management · Quality · Analytics
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
