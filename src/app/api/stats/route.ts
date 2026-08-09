export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET() {
  try {
    const [ta,aa,tt,ct,rt,tw,aw,ads] = await Promise.all([
      prisma.airdrop.count(), prisma.airdrop.count({ where: { status: "active" } }),
      prisma.task.count(), prisma.task.count({ where: { status: "completed" } }),
      prisma.task.count({ where: { status: "running" } }), prisma.wallet.count(),
      prisma.wallet.count({ where: { isActive: true } }),
      prisma.airdrop.findMany({ select: { totalPoints: true, potentialValue: true } }),
    ]);
    const tp = ads.reduce((s:number,a:{totalPoints:number})=>s+a.totalPoints,0);
    const tv = ads.reduce((s:number,a:{potentialValue:number|null})=>s+(a.potentialValue||0),0);
    return NextResponse.json({ totalAirdrops:ta, activeAirdrops:aa, totalTasks:tt, completedTasks:ct, runningTasks:rt, totalWallets:tw, activeWallets:aw, totalPoints:tp, totalPotentialValue:tv, pendingTasks:tt-ct-rt, completionRate:tt>0?Math.round((ct/tt)*100):0 });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
