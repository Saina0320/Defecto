import type { CaseType, CategorySection } from '@/types/defect';
import type { EvidenceTag } from '@/types/evidence';
import type { UserRole } from '@/types/team';

/** Tailwind class tokens for the app-controlled light/dark theme. */
export function getThemeClasses(darkMode: boolean) {
  return {
    appBg: darkMode ? 'bg-[#0B132B] text-[#F1F5F9]' : 'bg-[#F8F9FA] text-[#212529]',
    sidebarBg: darkMode
      ? 'bg-[#0A192F] border-r border-[#1E293B] shadow-[6px_0_30px_rgba(0,0,0,0.5)]'
      : 'bg-[#002D72] border-r border-[#001E4D]/80 shadow-[4px_0_24px_-2px_rgba(0,45,114,0.35)]',
    sidebarHeader: darkMode ? 'bg-[#071324] border-white/10' : 'bg-[#00245E] border-white/10',
    headerBg: darkMode ? 'bg-[#111E38] border-[#1E2E4A]' : 'bg-white border-[#E9ECEF]',
    headerText: darkMode ? 'text-white' : 'text-[#212529]',
    cardBg: darkMode ? 'bg-[#111E38] border-[#1E2E4A] shadow-md' : 'bg-white border-[#E9ECEF] shadow-sm',
    tableHeaderBg: darkMode ? 'bg-[#0F1A30] border-[#1E2E4A]' : 'bg-[#F1F3F5] border-[#E9ECEF]',
    tableRowHover: darkMode ? 'hover:bg-[#162746]/60' : 'hover:bg-blue-50/40',
    tableBorder: darkMode ? 'divide-[#1E2E4A] border-[#1E2E4A]' : 'divide-neutral-100 border-[#E9ECEF]',
    innerBoxBg: darkMode ? 'bg-[#0B1426] border-[#1E2E4A]' : 'bg-neutral-50 border-neutral-200',
    inputBg: darkMode
      ? 'bg-[#0B1426] border-[#2A3F66] text-white placeholder:text-neutral-500'
      : 'bg-[#F8F9FA] border-[#DEE2E6] text-neutral-800',
    mutedText: darkMode ? 'text-[#94A3B8]' : 'text-neutral-500',
    headingText: darkMode ? 'text-white' : 'text-neutral-900',
    cyanTagText: darkMode ? 'text-[#38BDF8]' : 'text-[#0056B3]',
    /** Border color for section separators inside cards and forms. */
    dividerSoft: darkMode ? 'border-[#1E2E4A]' : 'border-neutral-100',
    /** Border color for modal frames and footer separators. */
    divider: darkMode ? 'border-[#1E2E4A]' : 'border-neutral-200',
    /** Border color for separators inside upload panels and evidence lists. */
    dividerNeutral: darkMode ? 'border-neutral-700' : 'border-neutral-200',
  };
}

export type ThemeClasses = ReturnType<typeof getThemeClasses>;

export function getCaseTypeBadgeClass(type: CaseType, darkMode: boolean): string {
  if (type === 'Individual') {
    return darkMode
      ? 'bg-purple-950/40 text-purple-300 border border-purple-800/60 font-medium'
      : 'bg-purple-100 text-purple-900 border border-purple-300 font-semibold shadow-2xs';
  }
  return darkMode
    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/60 font-medium'
    : 'bg-emerald-100 text-emerald-950 border border-emerald-300 font-semibold shadow-2xs';
}

export function getCategoryBadgeClass(section: CategorySection, darkMode: boolean): string {
  if (section === 'CORE') {
    return darkMode
      ? 'bg-blue-950/40 text-blue-300 border border-blue-800/60 font-normal'
      : 'bg-[#EBF3FC] text-[#002D72] border border-[#B9D5F7] font-medium shadow-2xs';
  }
  return darkMode
    ? 'bg-slate-800/50 text-slate-300 border border-slate-700 font-normal'
    : 'bg-[#F1F5F9] text-[#1E293B] border border-[#CBD5E1] font-medium shadow-2xs';
}

export function getReadButtonClass(isReadByMe: boolean, darkMode: boolean): string {
  if (isReadByMe) {
    return darkMode
      ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/80 font-semibold'
      : 'bg-[#059669] text-white border border-[#047857] font-bold shadow-xs hover:bg-[#047857]';
  }
  return darkMode
    ? 'bg-[#1E293B] text-slate-300 border border-[#334155] hover:bg-neutral-800 font-medium'
    : 'bg-white text-[#1E293B] hover:bg-[#F1F5F9] border border-[#94A3B8] font-semibold shadow-2xs';
}

export function getDocTypeBadgeClass(docType: EvidenceTag, darkMode: boolean): string {
  if (docType === 'qc') {
    return darkMode
      ? 'bg-red-950/40 text-red-300 border border-red-800/60 font-medium'
      : 'bg-red-100 text-red-950 border border-red-300 font-semibold shadow-2xs';
  }
  if (docType === 'zip') {
    return darkMode
      ? 'bg-amber-950/40 text-amber-300 border border-amber-800/60 font-medium'
      : 'bg-amber-100 text-amber-950 border border-amber-300 font-semibold shadow-2xs';
  }
  return darkMode
    ? 'bg-blue-950/40 text-blue-300 border border-blue-800/60 font-medium'
    : 'bg-blue-100 text-[#002D72] border border-blue-300 font-semibold shadow-2xs';
}

export function getRoleBadgeClass(role: UserRole, darkMode: boolean): string {
  if (role === 'Admin') {
    return darkMode ? 'bg-amber-950/40 text-amber-300 border-amber-800' : 'bg-amber-100 text-amber-950 border-amber-300 shadow-2xs';
  }
  if (role === 'Manager') {
    return darkMode ? 'bg-purple-950/40 text-purple-300 border-purple-800' : 'bg-purple-100 text-purple-950 border-purple-300 shadow-2xs';
  }
  return darkMode ? 'bg-blue-950/40 text-blue-300 border-blue-800' : 'bg-[#EBF3FC] text-[#002D72] border-[#B9D5F7] shadow-2xs';
}
