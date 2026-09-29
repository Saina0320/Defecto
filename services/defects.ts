import { createClient } from '@/lib/supabase/client';
import type { DefectInsert, DefectRow } from '@/types/database';
import type { Defect } from '@/types/defect';

function toDefect(row: DefectRow): Defect {
  return {
    // Technical PostgreSQL id. NOT displayed as the Defect ID.
    id: row.id,

    // Real business identifiers
    ccid: row.ccid,
    kycid: row.kycid,

    caseType: row.case_type === 'individual' ? 'Individual' : 'Entity',

    ownerId: row.analyst_id,
    analystName: 'Analyst',

    dateCreated: row.created_at ? row.created_at.substring(0, 10) : '',

    explanation: row.analyst_context || '',

    // Not stored in Supabase yet
    selectedCategories: [],
    qcFile: null,
    finalZipFile: null,
    resolution: null,
    readReceipts: [],

    status: row.status,
  };
}

export async function getDefects(): Promise<Defect[]> {
  const { data, error } = await createClient()
    .from('defects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error obteniendo defects:', error);
    throw error;
  }

  return (data || []).map(toDefect);
}

/** Inserts a defect row and returns the stored record. Throws the Supabase error on failure. */
export async function insertDefect(values: DefectInsert): Promise<DefectRow> {
  const { data, error } = await createClient().from('defects').insert(values).select().single();

  if (error) {
    throw error;
  }

  return data;
}
