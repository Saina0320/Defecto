import 'server-only';
import type { Prisma } from '@/generated/prisma/client';
import { getPrisma } from '@/lib/prisma';
import type { CaseType, Defect } from '@/types/defect';

const defectSelect = {
  id: true,
  ccid: true,
  kycid: true,
  caseType: true,
  analystId: true,
  analystContext: true,
  status: true,
  createdAt: true,
} satisfies Prisma.DefectSelect;

type DefectRecord = Prisma.DefectGetPayload<{ select: typeof defectSelect }>;

function toDefect(record: DefectRecord): Defect {
  return {
    // Technical PostgreSQL id. NOT displayed as the Defect ID.
    id: record.id,

    // Real business identifiers
    ccid: record.ccid,
    kycid: record.kycid,

    caseType: record.caseType === 'individual' ? 'Individual' : 'Entity',

    ownerId: record.analystId,
    analystName: 'Analyst',

    dateCreated: record.createdAt.toISOString().substring(0, 10),

    explanation: record.analystContext || '',

    // Not read from the database yet
    selectedCategories: [],
    qcFile: null,
    finalZipFile: null,
    resolution: null,
    readReceipts: [],

    status: record.status,
  };
}

export async function getDefects(): Promise<Defect[]> {
  const defects = await getPrisma().defect.findMany({
    orderBy: { createdAt: 'desc' },
    select: defectSelect,
  });

  return defects.map(toDefect);
}

export type NewDefectValues = {
  ccid: string;
  kycid: string;
  caseType: CaseType;
  analystId: string;
  explanation: string;
};

/** Stores a new defect as a draft and returns its generated id and status. */
export async function createDefect(values: NewDefectValues): Promise<{ id: string; status: string }> {
  return getPrisma().defect.create({
    data: {
      ccid: values.ccid,
      kycid: values.kycid,
      caseType: values.caseType === 'Individual' ? 'individual' : 'entity',
      analystId: values.analystId,
      analystContext: values.explanation,
      status: 'draft',
    },
    select: { id: true, status: true },
  });
}
