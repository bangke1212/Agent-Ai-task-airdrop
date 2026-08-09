import { AppLayout } from "@/components/layout/app-layout";
import { Search, ExternalLink, TrendingUp, Sparkles } from "lucide-react";

export default function DiscoveryPage() {
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Airdrop Discovery</h2>
          <p className="text-sm text-zinc-400 mt-1">Discover new airdrop opportunities</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          placeholder="Search airdrops, projects, chains..."
          className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-green-500/50 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
            <TrendingUp size={16} className="text-green-400" />
            <h3 className="text-base font-semibold text-white">Trending Airdrops</h3>
          </div>
          <div className="divide-y divide-zinc-800/50">
            {[
              { name: "Monad Testnet", category: "Layer 1", potential: "$2,000+", tasks: 12, hot: true },
              { name: "Scroll Mainnet", category: "L2", potential: "$1,500+", tasks: 8, hot: true },
              { name: "ZetaChain", category: "Infra", potential: "$800+", tasks: 6, hot: false },
              { name: "Mantle Ecosystem", category: "L2", potential: "$1,200+", tasks: 10, hot: true },
              { name: "Linea Voyage", category: "L2", potential: "$900+", tasks: 7, hot: false },
            ].map((item, i) => (
              <div key={i} className="px-5 py-4 hover:bg-zinc-800/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{item.name}</span>
                      {item.hot && <span className="text-xs">🔥</span>}
                    </div>
                    <span className="text-xs text-zinc-500">{item.category} • {item.tasks} tasks</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-400">{item.potential}</div>
                    <button className="text-xs text-zinc-500 hover:text-green-400 flex items-center gap-1 mt-1">
                      View <ExternalLink size={10} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
            <Sparkles size={16} className="text-purple-400" />
            <h3 className="text-base font-semibold text-white">AI Recommendations</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🤖</span>
                <span className="text-sm font-medium text-white">Smart Alert</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Based on your activity, we detected 3 high-value airdrops matching your profile. 
                Robinhood chain ecosystem currently has the highest ROI potential.
              </p>
            </div>

            {[
              { name: "NOXA Ecosystem Airdrop", reason: "Matches your Robinhood chain activity", confidence: "95%" },
              { name: "Omni Network Testnet", reason: "Similar to your past successful claims", confidence: "88%" },
              { name: "EigenLayer AVS", reason: "High overlap with your wallet history", confidence: "82%" },
            ].map((rec, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-all">
                <div>
                  <div className="text-sm font-medium text-white">{rec.name}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{rec.reason}</div>
                </div>
                <div className="text-right">
                  <Badge variant="success">{rec.confidence}</Badge>
                  <button className="block text-xs text-green-400 hover:underline mt-1">Add to tasks</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "success" | "default" }) {
  const colors = {
    success: "bg-green-500/10 text-green-400 border-green-500/30",
    default: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors[variant]}`}>
      {children}
    </span>
  );
}
