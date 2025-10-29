// Overview service for API calls
// Replace mock URL with real API: /api/v1/overview

import { mockOverviewStats, type OverviewStats } from "@/mock/overview"

export async function getOverviewStats(): Promise<OverviewStats> {
  // TODO: Replace with real API call
  // const res = await fetch('/api/v1/overview');
  // return res.json();
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockOverviewStats), 300)
  })
}
