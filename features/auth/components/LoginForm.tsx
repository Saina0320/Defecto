'use client';

import { useActionState, useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { AlertTriangle, ArrowRight, IdCard, Loader2 } from 'lucide-react';
import { login, type LoginFormState, type LoginIssue } from '@/features/auth/actions';
import { parseSoeId, sanitizeSoeIdInput, SOE_ID_LENGTH } from '@/features/auth/lib/soeId';

const INITIAL_STATE: LoginFormState = { issue: null };

const ISSUE_MESSAGES: Record<LoginIssue, string> = {
  empty: 'Enter your SOE ID to sign in.',
  'invalid-format': 'An SOE ID has two letters followed by five digits, for example ab12345.',
  'not-found': 'No user is associated with this SOE ID.',
  'server-error': 'Sign-in is not available right now. Try again in a few minutes.',
};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, INITIAL_STATE);
  const [soeId, setSoeId] = useState('');
  const [localIssue, setLocalIssue] = useState<LoginIssue | null>(null);
  // Answer of the server that stopped applying because the field changed after it arrived.
  const [outdatedState, setOutdatedState] = useState(INITIAL_STATE);
  const inputRef = useRef<HTMLInputElement>(null);

  const fieldId = useId();
  const hintId = `${fieldId}-hint`;
  const issueId = `${fieldId}-issue`;

  const issue = localIssue ?? (state === outdatedState ? null : state.issue);

  useEffect(() => {
    if (state.issue) inputRef.current?.focus();
  }, [state]);

  const handleChange = (value: string) => {
    setSoeId(sanitizeSoeIdInput(value));
    setLocalIssue(null);
    setOutdatedState(state);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const parsed = parseSoeId(soeId);
    if (parsed.ok) return;

    // Nothing is sent while the field is known to be wrong. The server validates it again anyway.
    event.preventDefault();
    setLocalIssue(parsed.issue);
    setOutdatedState(state);
    inputRef.current?.focus();
  };

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor={fieldId} className="text-xs font-semibold text-neutral-900">
            SOE ID
          </label>
          <span className="text-[10px] text-neutral-500 font-mono" aria-hidden="true">
            {soeId.length}/{SOE_ID_LENGTH} characters
          </span>
        </div>

        <div className="relative">
          <IdCard
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            id={fieldId}
            name="soeId"
            type="text"
            required
            autoFocus
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="go"
            placeholder="e.g. ab12345"
            value={soeId}
            onChange={(e) => handleChange(e.target.value)}
            readOnly={isPending}
            aria-invalid={issue ? true : undefined}
            aria-describedby={`${hintId} ${issueId}`}
            className={`w-full h-12 pl-10 pr-3 bg-[#F8F9FA] border rounded-xl font-mono font-bold text-base sm:text-sm tracking-wider text-neutral-900 placeholder:font-normal placeholder:tracking-normal placeholder:text-neutral-400 transition focus:bg-white focus:outline-none focus:ring-2 read-only:opacity-70 ${
              issue
                ? 'border-[#E21836] focus:border-[#E21836] focus:ring-[#E21836]/20'
                : 'border-[#DEE2E6] hover:border-neutral-300 focus:border-[#0047BB] focus:ring-[#3B82F6]/25'
            }`}
          />
        </div>

        <p id={hintId} className="text-[11px] text-neutral-500 mt-1.5">
          Two letters followed by five digits. Capital letters are accepted.
        </p>

        {/* Always in the page, so screen readers announce the message when it appears. */}
        <div id={issueId} role="alert">
          {issue && (
            <p className="mt-3 p-2.5 rounded border-l-4 border-[#E21836] bg-red-50 flex items-start gap-2 text-xs font-medium text-red-950">
              <AlertTriangle className="w-4 h-4 mt-px flex-shrink-0 text-[#E21836]" aria-hidden="true" />
              <span>{ISSUE_MESSAGES[issue]}</span>
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        aria-busy={isPending}
        className="w-full h-12 px-5 bg-linear-to-r from-[#0047BB] to-[#0066FF] hover:from-[#003694] hover:to-[#0052D6] active:from-[#002E7A] active:to-[#0047BB] text-white text-sm font-bold rounded-xl shadow-[0_10px_26px_-6px_rgba(0,102,255,0.5)] transition flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0066FF] disabled:cursor-wait disabled:from-[#0047BB]/70 disabled:to-[#0066FF]/70 disabled:hover:from-[#0047BB]/70 disabled:hover:to-[#0066FF]/70"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <span>Sign in</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
