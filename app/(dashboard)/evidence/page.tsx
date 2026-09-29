import type { Metadata } from 'next';
import { EvidenceVaultView } from '@/features/evidence/components/EvidenceVaultView';

export const metadata: Metadata = {
  title: 'Evidence Vault',
};

export default function EvidenceVaultPage() {
  return <EvidenceVaultView />;
}
