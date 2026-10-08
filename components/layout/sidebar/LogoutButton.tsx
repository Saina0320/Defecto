import { useTransition } from 'react';
import { Loader2, LogOut } from 'lucide-react';
import { logout } from '@/features/auth/actions';

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(logout)}
      disabled={isPending}
      aria-busy={isPending}
      className="w-full mt-3 px-3 py-2 rounded-[10px] border border-white/15 bg-white/5 text-blue-100 hover:bg-white/10 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:cursor-wait disabled:opacity-70"
    >
      {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> : <LogOut className="w-3.5 h-3.5" aria-hidden="true" />}
      <span>{isPending ? 'Signing out...' : 'Sign out'}</span>
    </button>
  );
}
