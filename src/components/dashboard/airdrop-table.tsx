"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface Task {
  id: string;
  status: string;
  points: number;
}

interface Airdrop {
  id: string;
  projectName: string;
  status: string;
  priority: string;
  category: string;
  totalPoints: number;
  potentialValue: number | null;
  tasks: Task[];
  chain: string;
  createdAt: string;
}

const statusVariant: Record<string, "success" | "warning" | "error" | "info" | "default"> = {
  active: "success",
  completed: "info",
  expired: "error",
  upcoming: "warning",
};

const priorityVariant: Record<string, "success" | "warning" | "error" | "info" | "default"> = {
  critical: "error",
  high: "warning",
  medium: "info",
  low: "default",
};

export function AirdropTable() {
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter !== "all") params.set("status", filter);
    fetch(`/api/airdrop?${params}`)
      .then((res) => res.json())
      .then(setAirdrops)
      .catch(console.error);
  }, [filter]);

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">Active Airdrops</h3>
        <div className="flex gap-2">
          {["all", "active", "completed", "upcoming", "expired"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
                filter === f
                  ? "bg-green-500/20 text-green-400"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Project</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Status</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Priority</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Tasks</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Points</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Value</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Added</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {airdrops.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-zinc-500">
                  No airdrops found. Add one to get started!
                </td>
              </tr>
            ) : (
              airdrops.map((a) => {
                const completed = a.tasks.filter((t) => t.status === "completed").length;
                const total = a.tasks.length;
                return (
                  <tr key={a.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center text-sm">
                          {a.projectName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{a.projectName}</div>
                          <div className="text-xs text-zinc-500">{a.chain}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={statusVariant[a.status] || "default"}>{a.status}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={priorityVariant[a.priority] || "default"}>{a.priority}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-sm text-zinc-300">
                        {completed}/{total}
                      </div>
                      {total > 0 && (
                        <div className="w-20 h-1.5 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                            style={{ width: `${(completed / total) * 100}%` }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-zinc-300">{a.totalPoints}</td>
                    <td className="px-5 py-3.5 text-sm text-zinc-300">
                      {a.potentialValue ? formatCurrency(a.potentialValue) : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-zinc-500">{formatDate(a.createdAt)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/tasks?airdropId=${a.id}`}
                        className="text-zinc-400 hover:text-green-400 transition-colors inline-flex items-center gap-1 text-sm"
                      >
                        View <ExternalLink size={12} />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
