"use client";

import dynamic from "next/dynamic";

const KycDefectDashboard = dynamic(
  () => import("@/components/KycDefectDashboard"),
  { ssr: false }
);

export default function Page() {
  return <KycDefectDashboard />;
}