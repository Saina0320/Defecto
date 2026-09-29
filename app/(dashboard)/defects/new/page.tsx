import type { Metadata } from 'next';
import { NewDefectWizard } from '@/features/new-defect/components/NewDefectWizard';

export const metadata: Metadata = {
  title: 'New Defect',
};

export default function NewDefectPage() {
  return <NewDefectWizard />;
}
