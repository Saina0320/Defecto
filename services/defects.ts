import 'server-only';
import type { Prisma } from '@/generated/prisma/client';
import { formatTimestamp } from '@/lib/dates';
import { getPrisma } from '@/lib/prisma';
import { toUserRole } from '@/services/profiles';
import type { CaseType, CategorySection, Defect, DefectCategory, ReadReceipt } from '@/types/defect';

const defectSelect = {
  id: true,
  ccid: true,
  kycid: true,
  caseType: true,
  analystId: true,
  analystContext: true,
  status: true,
  createdAt: true,
  analyst: { select: { firstName: true, lastName: true } },
  reads: {
    select: {
      userId: true,
      readAt: true,
      user: { select: { firstName: true, lastName: true, role: true } },
    },
  },
  categories: { select: { section: true, name: true } },
} satisfies Prisma.DefectSelect;

type DefectRecord = Prisma.DefectGetPayload<{ select: typeof defectSelect }>;

function toReadReceipt(read: DefectRecord['reads'][number]): ReadReceipt {
  return {
    userId: read.userId,
    userName: `${read.user.firstName} ${read.user.lastName}`,
    role: toUserRole(read.user.role),
    readAt: formatTimestamp(read.readAt),
  };
}

function toCategorySection(section: string): CategorySection {
  return section === 'core' ? 'CORE' : 'APPENDIX';
}

function toDbSection(section: CategorySection): string {
  return section === 'CORE' ? 'core' : 'appendix';
}

function toDefect(record: DefectRecord): Defect {
  return {
    // Technical PostgreSQL id. NOT displayed as the Defect ID.
    id: record.id,

    // Real business identifiers
    ccid: record.ccid,
    kycid: record.kycid,

    caseType: record.caseType === 'individual' ? 'Individual' : 'Entity',

    ownerId: record.analystId,
    analystName: `${record.analyst.firstName} ${record.analyst.lastName}`,

    dateCreated: record.createdAt.toISOString().substring(0, 10),

    explanation: record.analystContext || '',

    selectedCategories: record.categories.map((category) => ({
      section: toCategorySection(category.section),
      name: category.name,
    })),

    // Not read from the database yet
    qcFile: null,
    finalZipFile: null,
    resolution: null,
    readReceipts: record.reads.map(toReadReceipt),

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
  categories: DefectCategory[];
};

/** Stores a new defect as a draft, with its selected categories, and returns its generated id and status. */
export async function createDefect(values: NewDefectValues): Promise<{ id: string; status: string }> {
  return getPrisma().defect.create({
    data: {
      ccid: values.ccid,
      kycid: values.kycid,
      caseType: values.caseType === 'Individual' ? 'individual' : 'entity',
      analystId: values.analystId,
      analystContext: values.explanation,
      status: 'draft',
      categories: {
        createMany: {
          data: values.categories.map((category) => ({ section: toDbSection(category.section), name: category.name })),
        },
      },
    },
    select: { id: true, status: true },
  });
}

/** The profile id of the analyst who created the defect, or null if it no longer exists. */
export async function getDefectAnalystId(defectId: string): Promise<string | null> {
  const defect = await getPrisma().defect.findUnique({
    where: { id: defectId },
    select: { analystId: true },
  });

  return defect?.analystId ?? null;
}

/** The defect's owner and case type, used to authorize and validate a category update. */
export async function getDefectOwnerAndCaseType(defectId: string): Promise<{ analystId: string; caseType: CaseType } | null> {
  const defect = await getPrisma().defect.findUnique({
    where: { id: defectId },
    select: { analystId: true, caseType: true },
  });

  if (!defect) return null;
  return { analystId: defect.analystId, caseType: defect.caseType === 'individual' ? 'Individual' : 'Entity' };
}

/** Replaces the defect's selected categories with exactly this set. */
export async function setDefectCategories(defectId: string, categories: DefectCategory[]): Promise<void> {
  const prisma = getPrisma();
  await prisma.$transaction([
    prisma.defectCategory.deleteMany({ where: { defectId } }),
    prisma.defectCategory.createMany({
      data: categories.map((category) => ({ defectId, section: toDbSection(category.section), name: category.name })),
    }),
  ]);
}

/**
 * Deletes the defect. Resolution, DefectRead, AuditLog, QcFinding and Evidence rows for it are
 * removed by the database's own ON DELETE CASCADE (see the relations in prisma/schema.prisma),
 * not by application code.
 */
export async function deleteDefectById(defectId: string): Promise<void> {
  await getPrisma().defect.delete({ where: { id: defectId } });
}

/** This user's existing read-receipt row for the defect, if any. */
export async function findDefectReadId(defectId: string, userId: string): Promise<string | null> {
  const read = await getPrisma().defectRead.findUnique({
    where: { defectId_userId: { defectId, userId } },
    select: { id: true },
  });

  return read?.id ?? null;
}

/** Records that this user has acknowledged the defect now. Returns the persisted timestamp. */
export async function createDefectRead(defectId: string, userId: string): Promise<Date> {
  const read = await getPrisma().defectRead.create({
    data: { defectId, userId },
    select: { readAt: true },
  });

  return read.readAt;
}

export async function deleteDefectReadById(readId: string): Promise<void> {
  await getPrisma().defectRead.delete({ where: { id: readId } });
}
