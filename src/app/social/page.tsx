"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { AppLayout } from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Power, PowerOff, CheckCircle2, RefreshCw, MessageCircle, Bird, Send, Shield } from "lucide-react";
import toast from "react-hot-toast";

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  isConnected: boolean;
  isActive: boolean;
  accessToken?: string;
  proxy: string | null;
  metadata: string | null;
  lastUsedAt: string | null;
  createdAt: string;
}

const platformConfig: Record<string,{name:string;icon:any;color:string;bg:string;border:string}> = {
  twitter: { name: "Twitter / X", icon: <Bird size={20} />, color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/30" },
  discord: { name: "Discord", icon: <MessageCircle size={20} />, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/30" },
  telegram: { name: "Telegram", icon: <Send size={20} />, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
};

export default function SocialAccountsPage() {
  const { data: session } = useSession();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    platform: "telegram",
    username: "",
    displayName: "",
    accessToken: "",
    proxy: "",
    metadata: "",
  });

  const fetchAccounts = () => {
    setLoading(true);
    fetch("/api/social").then(r => r.json()).then(d => {
      if (Array.isArray(d)) setAccounts(d);
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchAccounts(); const i = setInterval(fetchAccounts, 5000); return () => clearInterval(i); }, []);

  const handleOAuthConnect = (platform: string) => {
    const w = 600, h = 700;
    const left = (screen.width - w) / 2, top = (screen.height - h) / 2;

    if (platform === "twitter") {
      signIn("twitter", { redirect: false, callbackUrl: window.location.origin + "/social" }).then((res) => {
        if (res?.ok && res?.error === undefined) {
          saveOAuthAccount(platform);
        } else {
          toast.error("Twitter OAuth cancelled");
        }
      }).catch(() => toast.error("Twitter OAuth failed"));
    } else if (platform === "discord") {
      signIn("discord", { redirect: false, callbackUrl: window.location.origin + "/social" }).then((res) => {
        if (res?.ok && res?.error === undefined) {
          saveOAuthAccount(platform);
        } else {
          toast.error("Discord OAuth cancelled");
        }
      }).catch(() => toast.error("Discord OAuth failed"));
    } else {
      // Telegram still manual
      setFormData({ ...formData, platform });
      setShowForm(true);
    }
  };

  const saveOAuthAccount = async (platform: string) => {
    const user = session?.user as any;
    if (!user) return;
    
    try {
      const res = await fetch("/api/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          username: user.username || user.name || "unknown",
          displayName: user.name || user.username || "Unknown",
          accessToken: user.accessToken || "",
          metadata: null,
        }),
      });
      if (res.ok) {
        toast.success(platform + " connected!");
        fetchAccounts();
      }
    } catch { toast.error("Failed to save"); }
  };

  const testConn = async (a: SocialAccount) => {
    toast.loading("Testing...", { id: "t-" + a.id });
    try {
      await fetch("/api/social/" + a.id, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lastUsedAt: new Date().toISOString() }) });
      toast.success("Connected!", { id: "t-" + a.id });
    } catch { toast.error("Test failed", { id: "t-" + a.id }); }
  };

  const toggle = async (a: SocialAccount) => {
    try {
      await fetch("/api/social/" + a.id, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !a.isActive }) });
      fetchAccounts();
      toast.success((a.isActive ? "Off" : "On"));
    } catch { toast.error("Failed"); }
  };

  const del = async (id: string) => {
    try { await fetch("/api/social/" + id, { method: "DELETE" }); toast.success("Removed"); fetchAccounts(); }
    catch { toast.error("Failed"); }
  };

  const add = async () => {
    if (!formData.username) { toast.error("Username required"); return; }
    try {
      const r = await fetch("/api/social", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...formData, metadata: formData.metadata || null }) });
      if (r.ok) { toast.success("Added!"); setShowForm(false); setFormData({ platform: "telegram", username: "", displayName: "", accessToken: "", proxy: "", metadata: "" }); fetchAccounts(); }
      else { const e = await r.json(); toast.error(e.error || "Failed"); }
    } catch { toast.error("Failed"); }
  };

  const activeCount = accounts.filter(a => a.isActive).length;

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Social Accounts</h2>
          <p className="text-sm text-zinc-400 mt-1">Click to connect — OAuth popup for Twitter/Discord, form for Telegram</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setFormData({ ...formData, platform: "telegram" }); }} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-medium hover:opacity-90">
          <Plus size={16} /> Add Telegram
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6 p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /><span className="text-sm text-zinc-300">{activeCount} active</span></div>
        <div className="text-sm text-zinc-500">|</div>
        {Object.entries(platformConfig).map(([k,c]) => {
          const n = accounts.filter(a => a.platform === k && a.isActive).length;
          return <div key={k} className="flex items-center gap-1.5"><span className={c.color}>{c.icon}</span><span className="text-sm text-zinc-400">{n}</span></div>;
        })}
      </div>

      {/* Telegram form */}
      {showForm && (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-white mb-4">Add Telegram Account</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-zinc-400 block mb-1">Username *</label><input value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} placeholder="@username" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 font-mono" /></div>
            <div><label className="text-xs text-zinc-400 block mb-1">Display Name</label><input value={formData.displayName} onChange={e => setFormData({ ...formData, displayName: e.target.value })} placeholder="Name" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300" /></div>
            <div className="col-span-2"><label className="text-xs text-zinc-400 block mb-1">Telegram Session String</label><input type="password" value={formData.accessToken} onChange={e => setFormData({ ...formData, accessToken: e.target.value })} placeholder="••••" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 font-mono" /></div>
            <div className="col-span-2"><label className="text-xs text-zinc-400 block mb-1">Metadata JSON (api_id, api_hash)</label><textarea value={formData.metadata} onChange={e => setFormData({ ...formData, metadata: e.target.value })} placeholder='{"api_id":"123","api_hash":"abc"}' rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-300 font-mono resize-none" /></div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white">Cancel</button>
            <button onClick={add} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-500">Save</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {Object.entries(platformConfig).map(([platform, cfg]) => {
          const platformAccounts = accounts.filter(a => a.platform === platform && a.isActive);
          const hasActive = platformAccounts.length > 0;
          return (
            <div key={platform} className={cfg.bg + " border " + (hasActive ? cfg.border : "border-zinc-700/50") + " rounded-xl p-5 transition-all hover:border-zinc-600"}>
              <div className="flex items-center gap-3 mb-4">
                <div className={"w-12 h-12 rounded-xl " + cfg.bg + " border " + cfg.border + " flex items-center justify-center " + cfg.color}>{cfg.icon}</div>
                <div><h3 className="text-base font-bold text-white">{cfg.name}</h3><p className="text-xs text-zinc-500">{hasActive ? platformAccounts.length + " connected" : "Not connected"}</p></div>
                {hasActive && <CheckCircle2 size={16} className="text-green-400 ml-auto" />}
              </div>
              {hasActive ? (
                <div className="space-y-2">
                  {platformAccounts.map(a => (
                    <div key={a.id} className="flex items-center justify-between p-2 rounded-lg bg-black/20">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">{(a.displayName || a.username).charAt(0).toUpperCase()}</div>
                        <span className="text-sm text-white">@{a.username}</span>
                        <Badge variant={a.isActive ? "success" : "error"}>{a.isActive ? "On" : "Off"}</Badge>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => testConn(a)} className="p-1.5 rounded-lg text-zinc-400 hover:text-green-400 hover:bg-green-500/10" title="Test"><RefreshCw size={13} /></button>
                        <button onClick={() => toggle(a)} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700">{a.isActive ? <PowerOff size={13} /> : <Power size={13} />}</button>
                        <button onClick={() => del(a.id)} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <button onClick={() => handleOAuthConnect(platform)} className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-lg font-semibold bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600">
                  {cfg.icon}<span>Connect {cfg.name}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {accounts.length === 0 && !loading && (
        <div className="text-center py-16">
          <Shield size={48} className="mx-auto mb-4 text-zinc-700" />
          <h3 className="text-lg font-medium text-white mb-2">No Social Accounts Connected</h3>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">Connect Twitter & Discord via OAuth, Telegram via manual setup.</p>
        </div>
      )}
    </AppLayout>
  );
}
