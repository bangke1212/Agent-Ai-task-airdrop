"use client";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface Stats {
  totalAirdrops: number; activeAirdrops: number; totalTasks: number; completedTasks: number;
  runningTasks: number; totalWallets: number; activeWallets: number;
  totalPoints: number; totalPotentialValue: number; pendingTasks: number; completionRate: number;
}

export function StatsGrid() {
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => { fetch("/api/stats").then(r => r.json()).then(setStats).catch(console.error); }, []);
  if (!stats) return <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({length:8}).map((_,i)=><div key={i} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 animate-pulse h-28"/>)}</div>;

  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard title="Active Airdrops" value={stats.activeAirdrops} subtitle={`${stats.totalAirdrops} total tracked`} icon="🎯" trend="up"/>
    <StatCard title="Tasks Completed" value={`${stats.completedTasks}/${stats.totalTasks}`} subtitle={`${stats.completionRate}% completion rate`} icon="✅" trend="up"/>
    <StatCard title="Total Points" value={formatNumber(stats.totalPoints)} subtitle="Across all airdrops" icon="⭐" trend="up"/>
    <StatCard title="Potential Value" value={formatCurrency(stats.totalPotentialValue)} subtitle="Estimated total value" icon="💰" trend="up"/>
    <StatCard title="Active Wallets" value={stats.activeWallets} subtitle={`${stats.totalWallets} total wallets`} icon="👛"/>
    <StatCard title="Running Tasks" value={stats.runningTasks} subtitle={`${stats.pendingTasks} pending`} icon="🏃" trend={stats.runningTasks > 0 ? "up" : "neutral"}/>
    <StatCard title="Completion Rate" value={`${stats.completionRate}%`} subtitle="Tasks completed vs total" icon="📊" trend={stats.completionRate > 50 ? "up" : "down"}/>
    <StatCard title="Agent Status" value="Online" subtitle="All systems operational" icon="🟢" trend="up"/>
  </div>;
}
