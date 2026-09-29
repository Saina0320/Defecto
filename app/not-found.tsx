import Link from 'next/link';
import { CitiLogo } from '@/components/brand/CitiLogo';
import { ROUTES } from '@/constants/routes';

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center bg-[#F8F9FA] text-[#212529] p-6 font-sans">
      <div className="bg-white border border-[#E9ECEF] shadow-sm rounded-lg p-6 max-w-sm w-full text-center space-y-3">
        <div className="flex justify-center">
          <CitiLogo className="h-8 w-auto" />
        </div>
        <h1 className="text-base font-bold text-neutral-900">Page not found</h1>
        <p className="text-xs text-neutral-500">This page does not exist in KYC Defect Hub.</p>
        <Link
          href={ROUTES.overview}
          className="inline-block px-3.5 py-2 bg-[#003EA4] hover:bg-[#002D72] text-white text-xs font-bold rounded shadow transition"
        >
          Back to Overview
        </Link>
      </div>
    </main>
  );
}
