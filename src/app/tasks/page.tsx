"use client";

import { useEffect, useState, useCallback } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { formatDate, getTaskTypeIcon, truncateAddress } from "@/lib/utils";
import { Play, RotateCcw, Trash2, Plus, ExternalLink, CheckCircle2, Clock, AlertTriangle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

interface TaskLog {
  id: string;
  action: string;
  status: string;
  message: string;
  createdAt: string;
}

interface Task {
  id: string;
  airdropId: string;
  title: string;
  description: string;
  type: string;
  url: string;
  status: string;
  priority: number;
  points: number;
  airdrop: { projectName: string };
  logs: TaskLog[];
  createdAt: string;
}

interface Airdrop {
  id: string;
  projectName: string;
  status: string;
}

const statusBadgeVariant: Record<string, "success" | "warning" | "error" | "info" | "default"> = {
  pending: "default",
  running: "warning",
  completed: "success",
  failed: "error",
  skipped: "default",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAirdrop, setSelectedAirdrop] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [runningTasks, setRunningTasks] = useState<Set<string>>(new Set());

  // Form state
  const [formData, setFormData] = useState({
    airdropId: "",
    title: "",
    description: "",
    type: "follow_twitter",
    url: "",
    points: 100,
    priority: 0,
  });

  const fetchTasks = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedAirdrop) params.set("airdropId", selectedAirdrop);
    if (selectedStatus) params.set("status", selectedStatus);
    fetch(`/api/task?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTasks(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedAirdrop, selectedStatus]);

  useEffect(() => {
    // Fetch airdrops for filter
    fetch("/api/airdrop?status=active")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAirdrops(data);
      })
      .catch(() => {});

    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  const runTask = async (taskId: string) => {
    setRunningTasks((prev) => new Set(prev).add(taskId));
    toast.loading("Agent executing task...", { id: taskId });

    try {
      const res = await fetch("/api/agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message, { id: taskId });
        fetchTasks();
      } else {
        toast.error(data.error || "Task failed", { id: taskId });
      }
    } catch {
      toast.error("Failed to run task", { id: taskId });
    } finally {
      setRunningTasks((prev) => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
    }
  };

  const addTask = async () => {
    if (!formData.airdropId || !formData.title) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      const res = await fetch("/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("Task added!");
        setShowAddForm(false);
        setFormData({ airdropId: "", title: "", description: "", type: "follow_twitter", url: "", points: 100, priority: 0 });
        fetchTasks();
      }
    } catch {
      toast.error("Failed to add task");
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await fetch(`/api/task/${taskId}`, { method: "DELETE" });
      toast.success("Task deleted");
      fetchTasks();
    } catch {
      toast.error("Failed to delete task");
    }
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Task Console</h2>
          <p className="text-sm text-zinc-400 mt-1">Manage and execute airdrop automation tasks</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all"
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <select
          value={selectedAirdrop}
          onChange={(e) => setSelectedAirdrop(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300"
        >
          <option value="">All Airdrops</option>
          {airdrops.map((a) => (
            <option key={a.id} value={a.id}>{a.projectName}</option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="running">Running</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
        <span className="text-xs text-zinc-500">{tasks.length} tasks</span>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-white mb-4">New Automation Task</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Airdrop *</label>
              <select
                value={formData.airdropId}
                onChange={(e) => setFormData({ ...formData, airdropId: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300"
              >
                <option value="">Select airdrop...</option>
                {airdrops.map((a) => (
                  <option key={a.id} value={a.id}>{a.projectName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Task Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300"
              >
                {["connect_wallet", "follow_twitter", "join_telegram", "join_discord", "retweet", "like_tweet", "comment", "daily_checkin", "swap", "bridge", "stake", "mint", "custom"].map((t) => (
                  <option key={t} value={t}>{getTaskTypeIcon(t)} {t.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs text-zinc-400 block mb-1">Title *</label>
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Follow @project on Twitter"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-zinc-400 block mb-1">URL</label>
              <input
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="e.g. https://twitter.com/project"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Points</label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white">Cancel</button>
            <button onClick={addTask} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-500 transition-all">
              Create Task
            </button>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase w-8">Type</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Task</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Airdrop</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Points</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Log</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <Spinner className="w-6 h-6 text-green-400 mx-auto" />
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-zinc-500">
                    No tasks yet. Add a task to start automating!
                  </td>
                </tr>
              ) : (
                tasks.map((task) => {
                  const isRunning = runningTasks.has(task.id) || task.status === "running";
                  return (
                    <tr key={task.id} className={`hover:bg-zinc-800/30 transition-colors ${isRunning ? "bg-yellow-500/5" : ""}`}>
                      <td className="px-5 py-3.5 text-lg">{getTaskTypeIcon(task.type)}</td>
                      <td className="px-5 py-3.5">
                        <div className="text-sm font-medium text-white">{task.title}</div>
                        {task.url && (
                          <a href={task.url} target="_blank" className="text-xs text-zinc-500 hover:text-green-400 flex items-center gap-1 mt-0.5">
                            {truncateAddress(task.url.replace("https://", ""), 20)} <ExternalLink size={10} />
                          </a>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-zinc-300">{task.airdrop?.projectName || "—"}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          {isRunning ? (
                            <Spinner className="w-3.5 h-3.5 text-yellow-400" />
                          ) : task.status === "completed" ? (
                            <CheckCircle2 size={14} className="text-green-400" />
                          ) : task.status === "failed" ? (
                            <XCircle size={14} className="text-red-400" />
                          ) : (
                            <Clock size={14} className="text-zinc-500" />
                          )}
                          <Badge variant={statusBadgeVariant[task.status] || "default"}>{task.status}</Badge>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-zinc-300">{task.points}</td>
                      <td className="px-5 py-3.5">
                        {task.logs.length > 0 ? (
                          <div className="text-xs text-zinc-500">
                            {task.logs[task.logs.length - 1]?.message?.slice(0, 40)}...
                          </div>
                        ) : (
                          <span className="text-xs text-zinc-600">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => runTask(task.id)}
                            disabled={isRunning}
                            className={`p-2 rounded-lg transition-all ${
                              isRunning
                                ? "text-yellow-400 cursor-wait"
                                : "text-zinc-400 hover:text-green-400 hover:bg-green-500/10"
                            }`}
                            title="Run Task"
                          >
                            {isRunning ? <Spinner className="w-4 h-4" /> : <Play size={14} />}
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
