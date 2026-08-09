"use client";
import { Bell, Search } from "lucide-react";
export function Navbar() {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-6 ml-64">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <Search size={16} className="text-zinc-500" />
        <input type="text" placeholder="Search airdrops, tasks, wallets..." className="bg-transparent text-sm text-zinc-300 placeholder:text-zinc-600 outline-none w-full" />
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-zinc-800 transition-colors"><Bell size={18} className="text-zinc-400" /><span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-green-500" /></button>
        <div className="flex items-center gap-2 pl-4 border-l border-zinc-800"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">U</div><span className="text-sm text-zinc-300 hidden sm:block">User</span></div>
      </div>
    </header>
  );
}
