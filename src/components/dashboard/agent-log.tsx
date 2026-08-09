"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface Log {
  id: string;
  level: string;
  message: string;
  createdAt: string;
}

const levelColor: Record<string, string> = {
  info: "text-blue-400",
  warn: "text-yellow-400",
  error: "text-red-400",
  success: "text-green-400",
};

const levelIcon: Record<string, string> = {
  info: "ℹ️",
  warn: "⚠️",
  error: "❌",
  success: "✅",
};

export function AgentLog() {
  const [logs, setLogs] = useState<Log[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLogs = () => {
      fetch("/api/agent/logs?limit=30")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setLogs(data);
        })
        .catch(() => {});
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h3 className="text-sm font-semibold text-white">Agent Live Log</h3>
        </div>
        <span className="text-xs text-zinc-500 font-mono">{logs.length} entries</span>
      </div>

      <div className="h-64 overflow-y-auto p-4 font-mono text-xs space-y-1.5 bg-zinc-950/50">
        {logs.length === 0 ? (
          <div className="text-zinc-600 flex items-center justify-center h-full">
            Waiting for agent activity...
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-2 items-start">
              <span className="text-zinc-600 shrink-0 mt-0.5">
                {new Date(log.createdAt).toLocaleTimeString("en-US", { hour12: false })}
              </span>
              <span className="shrink-0">{levelIcon[log.level] || "•"}</span>
              <span className={cn("break-all", levelColor[log.level] || "text-zinc-400")}>
                {log.message}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
