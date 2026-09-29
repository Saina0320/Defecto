import { nowTimestamp } from '@/lib/dates';
import type { AttachedFile, EvidenceFile } from '@/types/defect';

// File uploads are simulated: only the typed file name is kept; id and size are generated.

function shortId(prefix: string): string {
  return `${prefix}-${Date.now().toString().slice(-4)}`;
}

function randomSize(minMb: number, spreadMb: number): string {
  return `${(Math.random() * spreadMb + minMb).toFixed(1)} MB`;
}

function withDefaultExtension(fileName: string, extension: string): string {
  return fileName.includes('.') ? fileName : `${fileName}${extension}`;
}

export function createQcFindingsFile(fileName: string): AttachedFile {
  return {
    id: shortId('QC'),
    name: withDefaultExtension(fileName, '.pdf'),
    size: randomSize(0.8, 2),
    uploadDate: nowTimestamp(),
  };
}

export function createFinalZipFile(fileName: string): AttachedFile {
  return {
    id: shortId('ZIP'),
    name: fileName.endsWith('.zip') ? fileName : `${fileName}.zip`,
    size: randomSize(3.0, 5),
    uploadDate: nowTimestamp(),
  };
}

export function createEvidenceFile(fileName: string): EvidenceFile {
  return {
    id: shortId('RES'),
    name: withDefaultExtension(fileName, '.pdf'),
    size: randomSize(1.0, 2),
  };
}
