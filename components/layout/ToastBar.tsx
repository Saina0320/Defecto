import { CheckCircle2, X } from 'lucide-react';
import { useToast, useToastMessage } from '@/providers/ToastProvider';

export function ToastBar() {
  const message = useToastMessage();
  const { dismissToast } = useToast();

  if (!message) return null;

  return (
    <div className="bg-[#063B82] text-white px-4 py-2 flex items-center justify-between text-xs font-medium shadow-md">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span>{message}</span>
      </div>
      <button onClick={dismissToast} className="text-blue-200 hover:text-white">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
