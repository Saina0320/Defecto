import { FileCheck, Lock, ShieldAlert, ShieldCheck, Users, type LucideIcon } from 'lucide-react';
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
  'bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_30%_35%,black,transparent_75%)]';

function BrandPanel() {
  return (
    <section
      aria-label="About KYC Defect Hub"
      className="relative isolate overflow-hidden bg-[#002D72] text-white flex-shrink-0 lg:w-[44%] lg:min-h-dvh flex flex-col shadow-[4px_0_24px_-2px_rgba(0,45,114,0.35)]"
    >
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-[#003EA4]/45 via-[#002D72] to-[#001B4A]" aria-hidden="true" />
      <div className={`absolute inset-0 -z-10 ${GRID_CLASSES}`} aria-hidden="true" />
      <div
        className="absolute bottom-0 inset-x-0 h-[3px] bg-[#E21836] lg:inset-x-auto lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[3px]"
        aria-hidden="true"
      />

      <div className="flex-1 flex flex-col px-5 py-4 sm:px-8 sm:py-5 lg:px-12 lg:py-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded shadow-sm flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#002D72]" aria-hidden="true" />
            </div>
            <div>
              <p className="font-bold text-sm tracking-wide text-white leading-tight">KYC DEFECT HUB</p>
              <p className="text-[10px] text-blue-200 tracking-wider uppercase font-semibold">Quality Management</p>
            </div>
          </div>
          <p className="hidden sm:block lg:hidden text-[11px] text-blue-200 font-medium text-right">
            Post-QC Approved Case Defect Repository
          </p>
        </div>

        <div className="hidden lg:flex flex-1 flex-col justify-center max-w-md py-12 motion-safe:animate-rise">
          <span className="self-start bg-[#003EA4] text-white text-[10px] font-bold px-2 py-0.5 rounded">KYC Defect Management</span>
          <p className="mt-4 text-3xl xl:text-4xl font-bold tracking-tight leading-[1.15]">
            Post-QC defect registry and quality management.
          </p>
          <p className="mt-4 text-sm text-blue-100/80 leading-relaxed">
            Defects logged after analyst completion and QC approval across Individual and Entity KYC client portfolios.
          </p>

          <ul className="mt-8 rounded bg-white/5 border border-white/10 shadow-inner divide-y divide-white/5">
            {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-3 px-4 py-3">
                <Icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-300" aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold text-white">{title}</p>
                  <p className="text-[11px] text-blue-200/80 mt-0.5">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="hidden lg:block text-[11px] text-blue-300/80">Internal system. For authorized personnel only.</p>
      </div>
    </section>
  );
}

export function LoginView() {
  return (
    <main className="flex-1 min-h-dvh flex flex-col lg:flex-row bg-[#F8F9FA] text-[#212529] font-sans antialiased">
      <BrandPanel />

      <section className="flex-1 flex items-start sm:items-center justify-center px-4 py-8 sm:px-8 sm:py-12">
        <div className="w-full max-w-md motion-safe:animate-rise">
          <div className="bg-white border border-[#E9ECEF] shadow-sm rounded-lg overflow-hidden">
            <div className="px-5 pt-6 pb-5 sm:px-8 sm:pt-8 border-b border-neutral-100">
              <span className="text-[11px] text-[#0056B3] font-bold uppercase tracking-wider">Secure access</span>
              <h1 className="mt-1.5 text-xl font-bold text-neutral-900 tracking-tight">Sign in to KYC Defect Hub</h1>
              <p className="mt-1 text-sm text-neutral-500">Use your SOE ID to open the defect registry.</p>
            </div>

            <div className="px-5 py-6 sm:px-8">
              <LoginForm />
            </div>

            <div className="px-5 py-3.5 sm:px-8 bg-neutral-50 border-t border-neutral-200 flex items-start gap-2 text-[11px] text-neutral-500">
              <Lock className="w-3.5 h-3.5 mt-px flex-shrink-0 text-neutral-400" aria-hidden="true" />
              <p>
                Your session ends after {SESSION_DURATION_HOURS} hours or when you sign out. Sign out when you finish on a shared
                computer.
              </p>
            </div>
          </div>

          <p className="mt-4 text-center text-[11px] text-neutral-400">KYC Defect Hub &bull; Quality Management</p>
        </div>
      </section>
    </main>
  );
}
