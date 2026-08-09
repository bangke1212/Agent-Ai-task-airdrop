"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ListChecks,
  Wallet,
  Search,
  BarChart3,
  Settings,
  Terminal,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Task Console", icon: Terminal },
  { href: "/wallets", label: "Wallets", icon: Wallet },
  { href: "/discovery", label: "Discovery", icon: Search },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-zinc-800">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
            A
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">AI Airdrop</h1>
            <p className="text-xs text-zinc-500">Agent Console</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-zinc-800/80 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/40"
              )}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {item.href === "/tasks" && (
                <span className="ml-auto bg-green-500/20 text-green-400 text-xs px-1.5 py-0.5 rounded-full font-medium">3</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <div>
            <div className="text-xs text-zinc-400">Agent Status</div>
            <div className="text-sm font-medium text-green-400">Online</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
