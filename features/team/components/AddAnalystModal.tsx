import { useState, type FormEvent } from 'react';
import { AlertTriangle, Mail, UserPlus, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { sanitizeSoeIdInput, SOE_ID_LENGTH } from '@/features/auth/lib/soeId';
import { toCitiEmail } from '@/features/team/lib/roster';
import { useTeam } from '@/features/team/context/TeamProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { useToast } from '@/providers/ToastProvider';

type InactiveMatch = { profileId: string; name: string };

const ERROR_MESSAGES: Record<string, string> = {
  forbidden: 'Permission denied: only Managers and Admins can add analysts.',
  'invalid-name': "Enter the analyst's full first and last name.",
  'invalid-soeid': 'An SOE ID has two letters followed by five digits, for example ab12345.',
  'duplicate-active': 'An active analyst with this SOEID already exists.',
  'database-error': 'Could not save the analyst. Try again.',
};

const REACTIVATE_ERROR_MESSAGES: Record<string, string> = {
  forbidden: 'Permission denied: only Managers and Admins can reactivate analysts.',
  'not-found': 'This profile no longer exists.',
  'already-active': 'This profile is already active.',
  'database-error': 'Could not reactivate the profile. Try again.',
};

export function AddAnalystModal({ onClose }: { onClose: () => void }) {
  const { darkMode, t } = useTheme();
  const { addAnalyst, reactivateAnalyst } = useTeam();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [soeId, setSoeId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [inactiveMatch, setInactiveMatch] = useState<InactiveMatch | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const citiEmail = soeId ? toCitiEmail(soeId) : '';

  const handleSoeIdChange = (value: string) => {
    setSoeId(sanitizeSoeIdInput(value));
    setError(null);
    setInactiveMatch(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setInactiveMatch(null);
    setIsSubmitting(true);
    const result = await addAnalyst(fullName, soeId);
    setIsSubmitting(false);

    if (result.ok) {
      onClose();
      showToast(`Added ${result.member.name} (${result.member.soeId ?? soeId}) to the Analyst roster.`);
      return;
    }

    if (result.reason === 'duplicate-inactive') {
      setInactiveMatch({ profileId: result.profileId, name: result.name });
      return;
    }

    setError(ERROR_MESSAGES[result.reason] ?? 'Could not save the analyst. Try again.');
  };

  const handleReactivate = async () => {
    if (!inactiveMatch) return;
    setIsSubmitting(true);
    const result = await reactivateAnalyst(inactiveMatch.profileId);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(REACTIVATE_ERROR_MESSAGES[result.reason] ?? 'Could not reactivate the profile. Try again.');
      return;
    }

    onClose();
    showToast('Analyst profile reactivated successfully.');
  };

  const labelClass = `block font-semibold ${t.headingText} mb-1`;

  return (
    <Modal className="max-w-md p-5 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-700">
        <h4 className={`font-bold text-sm ${t.headingText} flex items-center gap-2`}>
          <UserPlus className="w-4 h-4 text-[#0757C9] dark:text-blue-400" />
          Add Analyst to Roster
        </h4>
        <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div>
          <label htmlFor="analyst-name" className={labelClass}>
            Analyst Full Name *
          </label>
          <input
            id="analyst-name"
            type="text"
            required
            placeholder="e.g. Sean Alvarado"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setError(null);
              setInactiveMatch(null);
            }}
            readOnly={isSubmitting}
            className={`w-full p-2 ${t.inputBg} rounded text-xs read-only:opacity-70`}
          />
        </div>

        <div>
          <label htmlFor="analyst-soeid" className={labelClass}>
            SOEID *
          </label>
          <input
            id="analyst-soeid"
            type="text"
            required
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="e.g. sa12345"
            value={soeId}
            onChange={(e) => handleSoeIdChange(e.target.value)}
            readOnly={isSubmitting}
            className={`w-full p-2 ${t.inputBg} rounded font-mono tracking-wider text-xs read-only:opacity-70`}
          />
          <p className={`mt-1 text-[10px] ${t.mutedText}`}>Two letters followed by five digits ({soeId.length}/{SOE_ID_LENGTH}).</p>
        </div>

        <div>
          <label className={labelClass}>Corporate Email</label>
          <div
            className={`flex items-center gap-1.5 w-full p-2 rounded text-xs font-mono ${darkMode ? 'bg-[#0B1426] text-neutral-400' : 'bg-neutral-100 text-neutral-500'}`}
          >
            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{citiEmail || '—'}</span>
          </div>
          <p className={`mt-1 text-[10px] ${t.mutedText}`}>Automatically generated from SOEID (read-only).</p>
        </div>

        {error && (
          <p className="p-2 rounded border-l-4 border-red-500 bg-red-50 dark:bg-red-950/30 flex items-start gap-2 text-red-700 dark:text-red-300">
            <AlertTriangle className="w-3.5 h-3.5 mt-px flex-shrink-0" />
            <span>{error}</span>
          </p>
        )}

        {inactiveMatch ? (
          <div className="p-3 rounded border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/30 space-y-2">
            <p className="flex items-start gap-2 font-bold text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 mt-px flex-shrink-0" />
              <span>Existing Profile Found</span>
            </p>
            <p className="text-amber-800 dark:text-amber-300">This SOEID belongs to a previously deactivated analyst.</p>

            <dl className={`rounded p-2 space-y-0.5 font-mono ${darkMode ? 'bg-[#0B1426]' : 'bg-white'}`}>
              <div className="flex gap-1.5">
                <dt className={t.mutedText}>Name:</dt>
                <dd className={t.headingText}>{inactiveMatch.name}</dd>
              </div>
              <div className="flex gap-1.5">
                <dt className={t.mutedText}>SOEID:</dt>
                <dd className={t.headingText}>{soeId}</dd>
              </div>
              <div className="flex gap-1.5">
                <dt className={t.mutedText}>Email:</dt>
                <dd className={t.headingText}>{citiEmail}</dd>
              </div>
            </dl>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setInactiveMatch(null)}
                disabled={isSubmitting}
                className={`px-3 py-1 border ${darkMode ? 'border-neutral-700 text-neutral-300' : 'border-neutral-300 text-neutral-700'} rounded text-[11px] font-semibold cursor-pointer disabled:cursor-wait disabled:opacity-60`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReactivate}
                disabled={isSubmitting}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded text-[11px] cursor-pointer disabled:cursor-wait disabled:opacity-70"
              >
                {isSubmitting ? 'Reactivating...' : 'Reactivate Profile'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={`px-3 py-1.5 border ${darkMode ? 'border-neutral-700 text-neutral-300' : 'border-neutral-300 text-neutral-700'} rounded text-xs font-semibold cursor-pointer disabled:cursor-wait disabled:opacity-60`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 bg-[#0757C9] hover:bg-[#063B82] text-white font-bold rounded text-xs cursor-pointer shadow-xs disabled:cursor-wait disabled:bg-[#0757C9]/75 disabled:hover:bg-[#0757C9]/75"
            >
              {isSubmitting ? 'Adding...' : 'Add Analyst'}
            </button>
          </div>
        )}
      </form>
    </Modal>
  );
}
