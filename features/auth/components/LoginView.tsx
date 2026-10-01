import Image from 'next/image';
import { FileCheck, ShieldAlert, Users, type LucideIcon } from 'lucide-react';
import { SESSION_DURATION_HOURS } from '@/constants/auth';
import { LoginForm } from '@/features/auth/components/LoginForm';

type Highlight = {
  icon: LucideIcon;
  title: string;
  description: string;
};

// Same names and icons as the sidebar navigation.
const HIGHLIGHTS: Highlight[] = [
  { icon: ShieldAlert, title: 'Defects Registry', description: 'Post-QC defects by CCID and KYCID, with category and owner.' },
  { icon: FileCheck, title: 'Evidence Vault', description: 'QC findings and resolution evidence kept with each case.' },
  { icon: Users, title: 'Team & Roster', description: 'Read acknowledgment and activity across the KYC team.' },
];

// Fine ledger grid that fades towards the edges of the brand panel.
const GRID_CLASSES =
  'bg-[linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_28%_30%,black,transparent_72%)]';

// The provided architectural photo (public/brand/citi-building.png) as the full panel background.
// object-bottom keeps the building and trees anchored to the bottom edge; the panel's own aspect
// ratio is close enough to the photo's that little of its width gets cropped. Two scrims sit on
// top: a flat navy tint for overall color grading, and a corner-weighted radial gradient that
// darkens the top-left (behind the branding and hero text) while leaving the building itself,
// bottom-right, clearest.
function CitiBuildingPhoto() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
      <Image
        src="/brand/citi-building.png"
        alt=""
        fill
        priority
        quality={90}
        sizes="50vw"
        className="object-cover object-bottom"
      />
      <div className="absolute inset-0 bg-[#00184A]/40" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_0%_0%,rgba(0,11,41,0.88)_0%,rgba(0,24,74,0.4)_45%,transparent_75%)]" />
    </div>
  );
}

// Lowercase wordmark with a red arc riding over it, echoing Citi's own brand mark
// (an original curve drawn for this UI, not traced from the official logo artwork).
function CitiLogo() {
  return (
    <div className="relative inline-block leading-none">
      <svg
        className="pointer-events-none absolute -top-[13px] left-0 w-full"
        viewBox="0 0 100 22"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M 2 19 Q 50 -7 98 15" fill="none" stroke="#E21836" strokeWidth="6" strokeLinecap="round" />
      </svg>
      <span className="relative text-[26px] font-black tracking-tight text-white lowercase">citi</span>
    </div>
  );
}

function ArcAccents() {
  return (
    <>
      <div
        className="pointer-events-none absolute -right-16 -top-32 h-[26rem] w-[26rem] rounded-full bg-[#3B82F6]/25 blur-[90px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-24 top-[38%] h-72 w-72 rounded-full bg-[#0056B3]/25 blur-[80px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-64 w-96 rounded-full bg-[#5AA9FF]/15 blur-[70px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[-10%] left-[10%] h-56 w-56 rounded-full bg-[#0A4FB0]/20 blur-[85px]"
        aria-hidden="true"
      />
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <path d="M -60 260 A 460 460 0 0 1 420 -80" fill="none" stroke="#BFDBFE" strokeOpacity="0.14" strokeWidth="1.5" />
        <path d="M -20 560 A 560 560 0 0 1 620 60" fill="none" stroke="#BFDBFE" strokeOpacity="0.1" strokeWidth="1.5" />
        <path d="M 120 -40 A 300 300 0 0 1 480 260" fill="none" stroke="#93C5FD" strokeOpacity="0.08" strokeWidth="1" />
        <path d="M -40 460 A 420 420 0 0 1 380 140" fill="none" stroke="#60A5FA" strokeOpacity="0.07" strokeWidth="1" />
      </svg>
    </>
  );
}

function BrandPanel() {
  return (
    <section
      aria-label="About KYC Defect Hub"
      className="relative isolate overflow-hidden bg-[#00184A] text-white flex-shrink-0 lg:w-1/2 lg:min-h-dvh flex flex-col"
    >
      <div
        className="absolute inset-0 -z-30 bg-[radial-gradient(ellipse_at_top_left,#0A4FB0_0%,#00184A_55%,#000B29_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.16),transparent_60%)]"
        aria-hidden="true"
      />
      <CitiBuildingPhoto />
      <div className={`pointer-events-none absolute inset-0 ${GRID_CLASSES}`} aria-hidden="true" />
      <ArcAccents />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-[#000B29]/80 to-transparent lg:h-48"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 inset-x-0 h-[3px] bg-[#E21836] shadow-[0_0_16px_2px_rgba(226,24,54,0.55)] lg:inset-x-auto lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[3px]"
        aria-hidden="true"
      />

      <div className="relative flex-1 flex flex-col px-5 py-4 sm:px-8 sm:py-5 lg:px-14 lg:py-12">
        <div className="flex items-center justify-between gap-4">
          <div className="pt-2.5">
            <CitiLogo />
            <div className="mt-3 flex items-center gap-2">
              <span className="h-3.5 w-[3px] rounded-full bg-[#E21836]" aria-hidden="true" />
              <p className="font-extrabold text-sm sm:text-base tracking-[0.08em] text-white leading-tight">KYC DEFECT HUB</p>
            </div>
            <p className="mt-1 pl-[11px] text-[10px] text-blue-200/90 tracking-[0.18em] uppercase font-semibold">
              Quality Management
            </p>
            <p className="mt-2.5 pl-[11px] text-[10px] text-blue-300/55 font-medium tracking-wide">Yendry&rsquo;s Team</p>
          </div>
          <p className="hidden sm:block lg:hidden text-[11px] text-blue-200 font-medium text-right">
            Post-QC Approved Case Defect Repository
          </p>
        </div>

        <div className="hidden lg:flex flex-1 flex-col justify-center max-w-lg py-10 motion-safe:animate-rise">
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-[#E21836]" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-300">KYC Defect Management</span>
          </div>
          <p className="mt-5 text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.08] drop-shadow-[0_2px_12px_rgba(10,45,150,0.35)]">
            <span className="text-white">Post-QC defect registry and</span>
            <br />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-[#8FC6FF] to-[#4C8DFF]">
              quality management.
            </span>
          </p>
          <p className="mt-5 max-w-md text-sm text-blue-100/75 leading-relaxed">
            Defects logged after analyst completion and QC approval across Individual and Entity KYC client portfolios.
          </p>

          <ul className="mt-9 flex flex-col gap-2.5">
            {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="group flex items-start gap-3.5 rounded-lg border border-blue-300/12 bg-[#0A2E6B]/25 px-4 py-3.5 transition-colors hover:border-blue-300/25 hover:bg-[#0A2E6B]/35"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-blue-300/20 bg-[#0A2E6B]/60">
                  <Icon className="w-4 h-4 text-blue-300" aria-hidden="true" />
                </div>
                <div className="pt-0.5">
                  <p className="text-[13px] font-bold text-white">{title}</p>
                  <p className="text-[11.5px] text-blue-200/65 mt-0.5 leading-snug">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative hidden lg:block text-[11px] text-blue-300/70">Internal system. For authorized personnel only.</p>
      </div>
    </section>
  );
}

export function LoginView() {
  return (
    <main className="flex-1 min-h-dvh flex flex-col lg:flex-row bg-[#FAFBFD] text-[#212529] font-sans antialiased">
      <BrandPanel />

      <section className="relative flex-1 flex items-start sm:items-center justify-center px-4 py-8 sm:px-8 sm:py-12 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.07),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(0,86,179,0.06),transparent_55%)]"
          aria-hidden="true"
        />
        <svg className="pointer-events-none absolute inset-0 -z-10 h-full w-full" aria-hidden="true">
          <path d="M -80 100 A 480 480 0 0 1 400 -160" fill="none" stroke="#3B82F6" strokeOpacity="0.06" strokeWidth="1.5" />
        </svg>
        <div className="pointer-events-none absolute -top-20 right-8 -z-10 h-72 w-72 rounded-full bg-[#3B82F6]/[0.07] blur-[80px]" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 left-0 -z-10 h-80 w-80 rounded-full bg-[#0056B3]/[0.06] blur-[90px]" aria-hidden="true" />

        <div className="relative w-full max-w-md motion-safe:animate-rise">
          <div className="relative bg-white/95 border border-neutral-200/60 shadow-[0_24px_64px_-16px_rgba(15,45,110,0.18)] rounded-2xl overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-linear-to-r from-[#0047BB] via-[#3B82F6] to-[#E21836]/60" aria-hidden="true" />

            <div className="px-6 pt-8 pb-6 sm:px-9 sm:pt-10 border-b border-neutral-100">
              <span className="text-[11px] text-[#0056B3] font-extrabold uppercase tracking-[0.2em]">Secure Access</span>
              <h1 className="mt-2 text-2xl font-extrabold text-neutral-900 tracking-tight">Sign in to KYC Defect Hub</h1>
              <p className="mt-1.5 text-sm text-neutral-500">Use your SOE ID to open the defect registry.</p>
            </div>

            <div className="px-6 py-7 sm:px-9">
              <LoginForm />
            </div>

            <div className="px-6 py-4 sm:px-9 bg-[#F6F8FB] border-t border-neutral-200/70 text-[11px] text-neutral-500 leading-relaxed">
              Your session ends after {SESSION_DURATION_HOURS} hours or when you sign out. Sign out when you finish on a shared
              computer.
            </div>
          </div>

          <p className="mt-5 text-center text-[11px] text-neutral-400">KYC Defect Hub &bull; Quality Management</p>
        </div>
      </section>
    </main>
  );
}
