import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function getDefects() {
  const { data, error } = await supabase
    .from("defects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error obteniendo defects:", error);
    throw error;
  }

  return (data || []).map((defect) => ({
    // ID técnico de PostgreSQL. NO se muestra como Defect ID.
    id: defect.id,

    // Identificadores reales del negocio
    ccid: defect.ccid,
    kycid: defect.kycid,

    // Adaptamos los nombres que usa el dashboard
    caseType:
      defect.case_type === "individual" ? "Individual" : "Entity",

    ownerId: defect.analyst_id,
    analystName: "Analyst",

    dateCreated: defect.created_at
      ? defect.created_at.substring(0, 10)
      : "",

    explanation: defect.analyst_context || "",

    selectedCategories: [],

    qcFile: null,
    finalZipFile: null,

    resolution: null,

    readReceipts: [],

    status: defect.status,
  }));
}