import type { CaseType, CategorySection, DefectReasonCode } from '@/types/defect';
import type { EvidenceTag } from '@/types/evidence';
import type { UserRole } from '@/types/team';

/**
 * Tailwind class tokens for the app-controlled light/dark theme.
 *
 * Palette reference (design system, not reproduced elsewhere — read values from here):
 *   Light: bg #F4F7FB · surface #FFFFFF · surface-2 #F8FAFD · navy #063B82 · blue #0757C9
 *          accent #2F80ED · text #102A43 · text-2 #5B6B7A · muted #7B8794
 *          border #D9E2EC · border-soft #E8EEF5
 *   Dark:  bg #08111F · surface #0E1A2B · surface-2 #122238 · navy #0A3E83 · blue #2F80ED
 *          text #E8F0FA · text-2 #AFC0D4 · muted #7D91A8 · border #20344D
 * Semantic (both modes, via Tailwind's own palette — close enough to spec to reuse directly):
 *   success emerald · warning amber · danger red · purple purple.
 */
export function getThemeClasses(darkMode: boolean) {
  return {
    appBg: darkMode ? 'bg-[#08111F] text-[#E8F0FA]' : 'bg-[#F4F7FB] text-[#102A43]',
    sidebarBg: darkMode
      ? 'bg-[#081B33] border-r border-[#13253D] shadow-[6px_0_30px_rgba(0,0,0,0.45)]'
      : 'bg-[#063B82] border-r border-[#042a5e] shadow-[4px_0_24px_-2px_rgba(6,59,130,0.35)]',
    sidebarHeader: darkMode ? 'bg-[#051226] border-white/10' : 'bg-[#052f68] border-white/10',
    headerBg: darkMode ? 'bg-[#0E1A2B] border-[#20344D]' : 'bg-white border-[#D9E2EC]',
    headerText: darkMode ? 'text-[#E8F0FA]' : 'text-[#102A43]',
    cardBg: darkMode
      ? 'bg-[#0E1A2B] border-[#20344D] shadow-md'
      : 'bg-white border-[#D9E2EC] shadow-[0_1px_3px_rgba(16,42,67,0.06),0_1px_2px_rgba(16,42,67,0.04)]',
    tableHeaderBg: darkMode ? 'bg-[#122238] border-[#20344D]' : 'bg-[#F8FAFD] border-[#D9E2EC]',
    tableRowHover: darkMode ? 'hover:bg-[#15263d]/70' : 'hover:bg-[#EDF4FD]',
    tableBorder: darkMode ? 'divide-[#1A2C44] border-[#20344D]' : 'divide-[#E8EEF5] border-[#D9E2EC]',
    innerBoxBg: darkMode ? 'bg-[#122238] border-[#20344D]' : 'bg-[#F8FAFD] border-[#D9E2EC]',
    inputBg: darkMode
      ? 'bg-[#0E1A2B] border-[#20344D] text-[#E8F0FA] placeholder:text-[#7D91A8]'
      : 'bg-[#F8FAFD] border-[#D9E2EC] text-[#102A43] placeholder:text-[#7B8794]',
    mutedText: darkMode ? 'text-[#AFC0D4]' : 'text-[#5B6B7A]',
    headingText: darkMode ? 'text-[#E8F0FA]' : 'text-[#102A43]',
    cyanTagText: darkMode ? 'text-[#4A9BFF]' : 'text-[#0757C9]',
    /** Border color for section separators inside cards and forms. */
    dividerSoft: darkMode ? 'border-[#1A2C44]' : 'border-[#E8EEF5]',
    /** Border color for modal frames and footer separators. */
    divider: darkMode ? 'border-[#20344D]' : 'border-[#D9E2EC]',
    /** Border color for separators inside upload panels and evidence lists. */
    dividerNeutral: darkMode ? 'border-[#20344D]' : 'border-[#D9E2EC]',
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

/** Not-classified (null — historical defects, or not yet selected) gets a neutral, non-alarming tone. */
export function getDefectReasonBadgeClass(code: DefectReasonCode | null, darkMode: boolean): string {
  if (!code) {
    return darkMode
      ? 'bg-neutral-800/60 text-neutral-400 border border-neutral-700 font-normal italic'
      : 'bg-neutral-100 text-neutral-500 border border-neutral-300 font-medium italic';
  }
  switch (code) {
    case 'PROCEDURAL_ERROR':
      return darkMode
        ? 'bg-red-950/40 text-red-300 border border-red-800/60 font-medium'
        : 'bg-red-100 text-red-900 border border-red-300 font-semibold shadow-2xs';
    case 'KNOWLEDGE_TRAINING_GAP':
      return darkMode
        ? 'bg-amber-950/40 text-amber-300 border border-amber-800/60 font-medium'
        : 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold shadow-2xs';
    case 'SYSTEM_MAPPING_ISSUE':
      return darkMode
        ? 'bg-purple-950/40 text-purple-300 border border-purple-800/60 font-medium'
        : 'bg-purple-100 text-purple-900 border border-purple-300 font-semibold shadow-2xs';
    case 'PROCESS_PROCEDURE_ISSUE':
      return darkMode
        ? 'bg-blue-950/40 text-blue-300 border border-blue-800/60 font-medium'
        : 'bg-blue-100 text-[#002D72] border border-blue-300 font-semibold shadow-2xs';
    case 'OTHER_EXTERNAL_FACTOR':
      return darkMode
        ? 'bg-slate-800/50 text-slate-300 border border-slate-700 font-normal'
        : 'bg-slate-100 text-slate-700 border border-slate-300 font-medium shadow-2xs';
  }
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
