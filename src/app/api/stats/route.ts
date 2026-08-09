import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalAirdrops,
      activeAirdrops,
      totalTasks,
      completedTasks,
      runningTasks,
      totalWallets,
      activeWallets,
      airdrops,
    ] = await Promise.all([
      prisma.airdrop.count(),
      prisma.airdrop.count({ where: { status: "active" } }),
      prisma.task.count(),
      prisma.task.count({ where: { status: "completed" } }),
      prisma.task.count({ where: { status: "running" } }),
      prisma.wallet.count(),
      prisma.wallet.count({ where: { isActive: true } }),
      prisma.airdrop.findMany({
        select: { totalPoints: true, potentialValue: true },
      }),
    ]);

    const totalPoints = airdrops.reduce((sum: number, a: { totalPoints: number }) => sum + a.totalPoints, 0);
    const totalPotentialValue = airdrops.reduce((sum: number, a: { potentialValue: number | null }) => sum + (a.potentialValue || 0), 0);

    return NextResponse.json({
      totalAirdrops,
      activeAirdrops,
      totalTasks,
      completedTasks,
      runningTasks,
      totalWallets,
      activeWallets,
      totalPoints,
      totalPotentialValue,
      pendingTasks: totalTasks - completedTasks - runningTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
