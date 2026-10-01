import 'server-only';
import { getPrisma } from '@/lib/prisma';

/** Matches evidence_category_check in prisma/sql/post-db-push.sql. */
export type EvidenceCategory = 'qc' | 'supporting' | 'resolution';

/** The Storage subfolder a file lands in — see lib/supabaseStorage.ts. "final" and "supporting"
 * both store under Evidence.category = "supporting" (the schema has no "final" category); the
 * folder keeps them apart on disk while the category stays inside the existing 3-value enum. */
export type EvidenceFolder = 'qc' | 'final' | 'resolution' | 'supporting';

function sanitizeFileName(fileName: string): string {
  const cleaned = fileName.replace(/[/\\]/g, '_').replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 150);
  return cleaned || 'file';
}

/** `defects/{defectId}/{folder}/{unique}-{fileName}` — unique so two uploads never collide. */
export function buildEvidencePath(defectId: string, folder: EvidenceFolder, fileName: string): string {
  const unique = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return `defects/${defectId}/${folder}/${unique}-${sanitizeFileName(fileName)}`;
}

export type EvidenceRecord = {
  id: string;
  fileName: string;
  filePath: string;
  fileType: string | null;
  fileSize: number;
  category: EvidenceCategory;
  uploadedAt: Date;
};

export type NewEvidenceValues = {
  defectId: string;
  uploadedById: string;
  fileName: string;
  filePath: string;
  fileType: string | null;
  fileSize: number;
  category: EvidenceCategory;
};

/** Stores a file's metadata after its bytes have been written to Storage. */
export async function createEvidenceRecord(values: NewEvidenceValues): Promise<EvidenceRecord> {
  const row = await getPrisma().evidence.create({
    data: {
      defectId: values.defectId,
      uploadedById: values.uploadedById,
      fileName: values.fileName,
      filePath: values.filePath,
      fileType: values.fileType,
      fileSize: BigInt(values.fileSize),
      category: values.category,
    },
    select: { id: true, fileName: true, filePath: true, fileType: true, fileSize: true, category: true, uploadedAt: true },
  });

  return { ...row, fileSize: Number(row.fileSize ?? 0), category: row.category as EvidenceCategory };
}

/** This evidence row's Storage path, or null if it doesn't exist. Used to build a download URL. */
export async function getEvidencePath(evidenceId: string): Promise<string | null> {
  const row = await getPrisma().evidence.findUnique({ where: { id: evidenceId }, select: { filePath: true } });
  return row?.filePath ?? null;
}
