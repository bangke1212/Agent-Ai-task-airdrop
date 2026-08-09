import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
export function AppLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-zinc-950 text-zinc-100"><Sidebar /><div className="ml-64"><Navbar /><main className="p-6">{children}</main></div></div>;
}
