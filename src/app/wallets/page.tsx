"use client";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";
import { truncateAddress, formatDate } from "@/lib/utils";
import { Plus, Copy, Trash2, Power, PowerOff } from "lucide-react";
import toast from "react-hot-toast";

interface Wallet { id: string; name: string; address: string; chain: string; proxy: string | null; isActive: boolean; createdAt: string; }

export default function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name:"",address:"",privateKey:"",chain:"robinhood",proxy:"" });

  const fetchWallets = () => { setLoading(true); fetch("/api/wallet").then(r=>r.json()).then(d=>{if(Array.isArray(d))setWallets(d)}).catch(console.error).finally(()=>setLoading(false)); };
  useEffect(()=>{fetchWallets();},[]);

  const addWallet = async ()=>{if(!formData.name||!formData.address){toast.error("Name and address required");return}try{const res=await fetch("/api/wallet",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(formData)});if(res.ok){toast.success("Wallet added!");setShowForm(false);setFormData({name:"",address:"",privateKey:"",chain:"robinhood",proxy:""});fetchWallets();}}catch{toast.error("Failed")}};
  const toggleActive=async(w:Wallet)=>{try{await fetch(`/api/wallet/${w.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({isActive:!w.isActive})});fetchWallets();toast.success(`Wallet ${w.isActive?"deactivated":"activated"}`)}catch{toast.error("Failed")}};
  const deleteWallet=async(id:string)=>{try{await fetch(`/api/wallet/${id}`,{method:"DELETE"});toast.success("Deleted");fetchWallets();}catch{toast.error("Failed")}};
  const copyAddress=(addr:string)=>{navigator.clipboard.writeText(addr);toast.success("Copied!")};

  return <AppLayout>
    <div className="flex items-center justify-between mb-6"><div><h2 className="text-2xl font-bold text-white">Wallet Manager</h2><p className="text-sm text-zinc-400 mt-1">{wallets.filter(w=>w.isActive).length} active / {wallets.length} total</p></div><button onClick={()=>setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-medium"><Plus size={16}/>Add Wallet</button></div>

    {showForm&&<div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 mb-6"><h3 className="text-sm font-semibold text-white mb-4">Add New Wallet</h3><div className="grid grid-cols-2 gap-4"><div><label className="text-xs text-zinc-400 block mb-1">Name *</label><input value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} placeholder="Main Wallet" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300"/></div><div><label className="text-xs text-zinc-400 block mb-1">Chain</label><select value={formData.chain} onChange={e=>setFormData({...formData,chain:e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300">{["robinhood","ethereum","bsc","polygon","arbitrum","optimism","base","solana","sui"].map(c=><option key={c} value={c}>{c}</option>)}</select></div><div className="col-span-2"><label className="text-xs text-zinc-400 block mb-1">Address *</label><input value={formData.address} onChange={e=>setFormData({...formData,address:e.target.value})} placeholder="0x..." className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 font-mono"/></div><div className="col-span-2"><label className="text-xs text-zinc-400 block mb-1">Private Key (optional)</label><input type="password" value={formData.privateKey} onChange={e=>setFormData({...formData,privateKey:e.target.value})} placeholder="••••" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300"/></div></div><div className="flex justify-end gap-3 mt-4"><button onClick={()=>setShowForm(false)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white">Cancel</button><button onClick={addWallet} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-500">Add Wallet</button></div></div>}

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {loading?[1,2,3].map(i=><div key={i} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 animate-pulse h-32"/>):wallets.length===0?<div className="col-span-full py-12 text-center text-zinc-500">No wallets yet</div>:
      wallets.map(w=><div key={w.id} className={`bg-zinc-900/80 border rounded-xl p-5 transition-all hover:border-zinc-700 ${w.isActive?"border-zinc-800":"border-red-900/30 opacity-60"}`}>
        <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${w.isActive?"bg-green-500":"bg-red-500"}`}/><h3 className="text-sm font-semibold text-white">{w.name}</h3></div><Badge variant={w.isActive?"success":"error"}>{w.isActive?"Active":"Inactive"}</Badge></div>
        <div className="flex items-center gap-2 mb-1"><span className="text-sm text-zinc-300 font-mono">{truncateAddress(w.address,8)}</span><button onClick={()=>copyAddress(w.address)} className="text-zinc-500 hover:text-green-400"><Copy size={12}/></button></div>
        <div className="flex items-center gap-2 mb-3"><span className="text-xs text-zinc-500 uppercase">{w.chain}</span>{w.proxy&&<span className="text-xs text-green-500">🔒 Proxied</span>}</div>
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800"><span className="text-xs text-zinc-600">Added {formatDate(w.createdAt)}</span><div className="flex gap-1"><button onClick={()=>toggleActive(w)} className={`p-1.5 rounded-lg transition-all ${w.isActive?"text-zinc-400 hover:text-red-400 hover:bg-red-500/10":"text-zinc-400 hover:text-green-400 hover:bg-green-500/10"}`}>{w.isActive?<PowerOff size={14}/>:<Power size={14}/>}</button><button onClick={()=>deleteWallet(w.id)} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10"><Trash2 size={14}/></button></div></div>
      </div>)}
    </div>
  </AppLayout>;
}
