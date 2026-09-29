import { useState, type FormEvent } from 'react';
import { UserPlus, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useTeam } from '@/features/team/context/TeamProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { useToast } from '@/providers/ToastProvider';

export function AddAnalystModal({ onClose }: { onClose: () => void }) {
  const { darkMode, t } = useTheme();
  const { addAnalyst } = useTeam();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Please provide Analyst name and email.');
      return;
    }
    const member = addAnalyst(name, email);
    onClose();
    showToast(`Added ${member.name} (${member.id}) to Analyst roster.`);
  };

  const labelClass = `block font-semibold ${t.headingText} mb-1`;

  return (
    <Modal className="max-w-md p-5 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-700">
        <h4 className={`font-bold text-sm ${t.headingText} flex items-center gap-2`}>
          <UserPlus className="w-4 h-4 text-[#003EA4] dark:text-blue-400" />
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
            placeholder="e.g. Jordan Hayes"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-2 ${t.inputBg} rounded text-xs`}
          />
        </div>
        <div>
          <label htmlFor="analyst-email" className={labelClass}>
            Citi Email Address *
          </label>
          <input
            id="analyst-email"
            type="email"
            required
            placeholder="e.g. jordan.hayes.demo@citi.internal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-2 ${t.inputBg} rounded text-xs`}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
          <button
            type="button"
            onClick={onClose}
            className={`px-3 py-1.5 border ${darkMode ? 'border-neutral-700 text-neutral-300' : 'border-neutral-300 text-neutral-700'} rounded text-xs font-semibold cursor-pointer`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 bg-[#003EA4] hover:bg-[#002D72] text-white font-bold rounded text-xs cursor-pointer shadow-xs"
          >
            Add Analyst
          </button>
        </div>
      </form>
    </Modal>
  );
}
