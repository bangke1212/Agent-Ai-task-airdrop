import { AppLayout } from "@/components/layout/app-layout";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { AirdropTable } from "@/components/dashboard/airdrop-table";
import { AgentLog } from "@/components/dashboard/agent-log";
import { Activity, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return <AppLayout>
    <div className="flex items-center justify-between mb-6"><div><h2 className="text-2xl font-bold text-white">Dashboard</h2><p className="text-sm text-zinc-400 mt-1">Monitor your AI airdrop agent activity</p></div><div className="flex items-center gap-3"><span className="text-xs text-zinc-500 flex items-center gap-1"><Activity size={12} className="text-green-400"/>Auto-refresh: 5s</span></div></div>
    <StatsGrid />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6"><div className="lg:col-span-2"><AirdropTable /></div><div className="lg:col-span-1"><AgentLog /></div></div>
    <div className="mt-6 bg-zinc-900/80 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4"><TrendingUp size={16} className="text-green-400"/><h3 className="text-sm font-semibold text-white">Recent Activity</h3></div>
      <div className="space-y-3">
        {[{action:"Task completed",detail:"Follow @monad_xyz on Twitter",time:"2 min ago",status:"success"},{action:"Wallet connected",detail:"0x7a...b3f2 connected to Monad testnet",time:"15 min ago",status:"success"},{action:"Daily check-in",detail:"Claimed daily points for Airdrop XYZ",time:"1 hour ago",status:"success"},{action:"Task failed",detail:"Discord join - server invite expired",time:"2 hours ago",status:"error"},{action:"New airdrop added",detail:"NovaChain Testnet Campaign",time:"3 hours ago",status:"info"}].map((item,i)=><div key={i} className="flex items-center gap-3 text-sm"><div className={`w-2 h-2 rounded-full ${item.status==="success"?"bg-green-500":item.status==="error"?"bg-red-500":"bg-blue-500"}`}/><span className="text-zinc-300">{item.action}:</span><span className="text-zinc-500">{item.detail}</span><span className="text-zinc-600 ml-auto text-xs">{item.time}</span></div>)}
      </div>
    </div>
  </AppLayout>;
}
