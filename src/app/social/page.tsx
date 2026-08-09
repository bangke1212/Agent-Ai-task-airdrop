"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/lib/utils";
import {
  Plus, Trash2, Power, PowerOff, ExternalLink,
  MessageCircle, Bird, Send, Shield, CheckCircle2, XCircle,
  Copy, RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

interface SocialAccount {
  accessToken?: string;
  refreshToken?: string;
  id: string;
  platform: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  isConnected: boolean;
  isActive: boolean;
  proxy: string | null;
  metadata: string | null;
  lastUsedAt: string | null;
  createdAt: string;
}

const platformConfig: Record<string, { name: string; icon: React.ReactNode; color: string; bg: string; border: string }> = {
  twitter: {
    name: "Twitter / X",
    icon: <Bird size={20} />,
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
  },
  discord: {
    name: "Discord",
    icon: <MessageCircle size={20} />,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
  },
  telegram: {
    name: "Telegram",
    icon: <Send size={20} />,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
  },
};

const platformSteps: Record<string, string[]> = {
  twitter: [
    "Go to Twitter Developer Portal",
    "Create a new app or use existing API keys",
    "Paste your Access Token & Access Token Secret below",
    "Agent can now: follow, retweet, like, comment",
  ],
  discord: [
    "Go to Discord Developer Portal",
    "Create a Bot application",
    "Paste the Bot Token below",
    "Invite bot to target servers for auto-join",
  ],
  telegram: [
    "Go to my.telegram.org → API Development",
    "Create an app to get api_id & api_hash",
    "Paste both values in the Metadata JSON field",
    "Agent can now: join groups, verify, send messages",
  ],
};

export default function SocialAccountsPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("twitter");
  const [formData, setFormData] = useState({
    platform: "twitter",
    username: "",
    displayName: "",
    accessToken: "",
    refreshToken: "",
    proxy: "",
    metadata: "",
  });

  const fetchAccounts = () => {
    setLoading(true);
    fetch("/api/social")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAccounts(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAccounts(); }, []);

  const addAccount = async () => {
    if (!formData.username) {
      toast.error("Username is required");
      return;
    }

    try {
      const res = await fetch("/api/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          metadata: formData.metadata ? formData.metadata : null,
        }),
      });

      if (res.ok) {
        toast.success(`${formData.platform} account connected!`);
        setShowForm(false);
        setFormData({ platform: "twitter", username: "", displayName: "", accessToken: "", refreshToken: "", proxy: "", metadata: "" });
        fetchAccounts();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to add account");
      }
    } catch {
      toast.error("Failed to connect account");
    }
  };

  const toggleActive = async (account: SocialAccount) => {
    try {
      await fetch(`/api/social/${account.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !account.isActive }),
      });
      fetchAccounts();
      toast.success(`${account.platform} @${account.username} ${account.isActive ? "deactivated" : "activated"}`);
    } catch {
      toast.error("Failed to update account");
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      await fetch(`/api/social/${id}`, { method: "DELETE" });
      toast.success("Account removed");
      fetchAccounts();
    } catch {
      toast.error("Failed to delete account");
    }
  };

  // Group accounts by platform
  const grouped = accounts.reduce((acc, a) => {
    if (!acc[a.platform]) acc[a.platform] = [];
    acc[a.platform].push(a);
    return acc;
  }, {} as Record<string, SocialAccount[]>);

  const activeCount = accounts.filter((a) => a.isActive).length;

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Social Accounts</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Connect your Discord, Twitter, and Telegram accounts for AI Agent automation
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all"
        >
          <Plus size={16} /> Connect Account
        </button>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm text-zinc-300">{activeCount} active</span>
        </div>
        <div className="text-sm text-zinc-500">|</div>
        <div className="flex items-center gap-4">
          {Object.entries(platformConfig).map(([key, cfg]) => {
            const count = accounts.filter((a) => a.platform === key && a.isActive).length;
            return (
              <div key={key} className="flex items-center gap-1.5">
                <span className={cfg.color}>{cfg.icon}</span>
                <span className="text-sm text-zinc-400">{count} {cfg.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Account Form */}
      {showForm && (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-white mb-4">Connect New Social Account</h3>

          {/* Platform Tabs */}
          <div className="flex gap-2 mb-4">
            {Object.entries(platformConfig).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setFormData({ ...formData, platform: key })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  formData.platform === key
                    ? `${cfg.bg} ${cfg.color} border ${cfg.border}`
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {cfg.icon}
                {cfg.name}
              </button>
            ))}
          </div>

          {/* Setup Instructions */}
          <div className={`${platformConfig[formData.platform].bg} border ${platformConfig[formData.platform].border} rounded-lg p-4 mb-4`}>
            <h4 className={`text-sm font-medium ${platformConfig[formData.platform].color} mb-2`}>
              How to get {platformConfig[formData.platform].name} credentials:
            </h4>
            <ol className="space-y-1">
              {platformSteps[formData.platform].map((step, i) => (
                <li key={i} className="text-xs text-zinc-400 flex items-start gap-2">
                  <span className="text-zinc-600">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Username / Handle *</label>
              <input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder={formData.platform === "twitter" ? "@username" : formData.platform === "discord" ? "username#0000" : "@username"}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Display Name</label>
              <input
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="Display name"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-zinc-400 block mb-1">
                {formData.platform === "twitter" ? "Access Token" : formData.platform === "discord" ? "Bot Token" : "Session String / Token"}
              </label>
              <input
                type="password"
                value={formData.accessToken}
                onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 font-mono"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-zinc-400 block mb-1">Metadata JSON (api_hash, cookies, user-agent, etc.)</label>
              <textarea
                value={formData.metadata}
                onChange={(e) => setFormData({ ...formData, metadata: e.target.value })}
                placeholder='{"api_id": "12345", "api_hash": "abc...", "session": "..."}'
                rows={3}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-300 font-mono resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white">Cancel</button>
            <button onClick={addAccount} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-500 transition-all">
              Connect Account
            </button>
          </div>
        </div>
      )}

      {/* Account Cards per Platform */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 animate-pulse h-40" />
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <Shield size={48} className="mx-auto mb-4 text-zinc-700" />
          <h3 className="text-lg font-medium text-white mb-2">No Social Accounts Connected</h3>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Connect your Discord, Twitter, and Telegram accounts so the AI Agent can automate social tasks for airdrops.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([platform, platformAccounts]) => {
            const cfg = platformConfig[platform];
            if (!cfg) return null;
            return (
              <div key={platform}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={cfg.color}>{cfg.icon}</span>
                  <h3 className="text-sm font-semibold text-white">{cfg.name}</h3>
                  <span className="text-xs text-zinc-500">
                    {platformAccounts.filter((a) => a.isActive).length}/{platformAccounts.length} active
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {platformAccounts.map((account) => (
                    <div
                      key={account.id}
                      className={`${cfg.bg} border rounded-xl p-5 transition-all hover:border-zinc-600 ${
                        account.isActive ? cfg.border : "border-red-900/30 opacity-60"
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${cfg.bg} border ${cfg.border} flex items-center justify-center text-lg font-bold ${cfg.color}`}>
                            {account.displayName?.charAt(0)?.toUpperCase() || account.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">{account.displayName || account.username}</div>
                            <div className={`text-xs ${cfg.color} font-mono`}>@{account.username}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className={`flex items-center gap-1 text-xs ${account.isConnected ? "text-green-400" : "text-red-400"}`}>
                            {account.isConnected ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                            {account.isConnected ? "Connected" : "Disconnected"}
                          </div>
                          {account.accessToken && (
                            <Badge variant="success">🔑 Token</Badge>
                          )}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 mb-4 text-xs">
                        {account.proxy && (
                          <div className="flex items-center gap-2 text-zinc-400">
                            <Shield size={12} className="text-green-400" />
                            <span>Proxy: {account.proxy.length > 30 ? account.proxy.slice(0, 30) + "..." : account.proxy}</span>
                          </div>
                        )}
                        {account.metadata && (
                          <div className="text-zinc-500">
                            Metadata: {account.metadata.length > 40 ? account.metadata.slice(0, 40) + "..." : account.metadata}
                          </div>
                        )}
                        {account.lastUsedAt && (
                          <div className="text-zinc-600">
                            Last used: {formatDate(account.lastUsedAt)}
                          </div>
                        )}
                        <div className="text-zinc-600">
                          Added: {formatDate(account.createdAt)}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-zinc-700/50">
                        <Badge variant={account.isActive ? "success" : "error"}>
                          {account.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <div className="flex gap-1">
                          <button
                            onClick={() => toggleActive(account)}
                            className={`p-1.5 rounded-lg transition-all ${
                              account.isActive
                                ? "text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                                : "text-zinc-400 hover:text-green-400 hover:bg-green-500/10"
                            }`}
                            title={account.isActive ? "Deactivate" : "Activate"}
                          >
                            {account.isActive ? <PowerOff size={14} /> : <Power size={14} />}
                          </button>
                          <button
                            onClick={() => deleteAccount(account.id)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl">
        <h4 className="text-sm font-medium text-white mb-2">🤖 How the AI Agent Uses These Accounts</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-400">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bird size={14} className="text-sky-400" />
              <span className="text-sky-400 font-medium">Twitter/X</span>
            </div>
            <p>Follow accounts, like tweets, retweet, post comments — semua task sosial airdrop otomatis.</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MessageCircle size={14} className="text-indigo-400" />
              <span className="text-indigo-400 font-medium">Discord</span>
            </div>
            <p>Join servers, verify wallet, send messages di channel — semua via bot token.</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Send size={14} className="text-blue-400" />
              <span className="text-blue-400 font-medium">Telegram</span>
            </div>
            <p>Join groups/channels, verify, complete captcha, claim rewards via bot session.</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
