"use client";

import { useEffect, useState } from "react";
import { getOverviewStats } from "@/lib/api/services/fetchOverview";
import type { OverviewStats } from "@/mock/overview";
import { OverviewStatsCards } from "./components/overviewStats";
import { OverviewStatus } from "./components/overviewStatus";
import { OverviewActivities } from "./components/overviewActivities";

export default function OverviewPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getOverviewStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching overview stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Failed to load overview data
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the admin dashboard
        </p>
      </div>

      <OverviewStatsCards stats={stats} />

      <OverviewStatus stats={stats} />
      <OverviewActivities stats={stats} />
    </div>
  );
}
