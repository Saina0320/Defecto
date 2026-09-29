import type { Metadata } from 'next';
import { DefectsRegistryView } from '@/features/defects/components/registry/DefectsRegistryView';

export const metadata: Metadata = {
  title: 'Defects Registry',
};

export default function DefectsRegistryPage() {
  return <DefectsRegistryView />;
}
