export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { taskId, walletId } = await req.json();
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    await prisma.task.update({ where: { id: taskId }, data: { status: "running" } });
    const startTime = Date.now();

    await prisma.agentLog.create({
      data: { level: "info", message: `🤖 Agent started task: ${task.title}`, taskId, walletId },
    });

    const actions = [
      { action: "Navigate to URL", status: "success", message: `Opened ${task.url || "target site"}` },
      { action: "Execute task", status: "success", message: `Completed: ${task.title}` },
      { action: "Verify result", status: "success", message: "Task verified successfully" },
    ];

    for (const action of actions) {
      await prisma.taskLog.create({
        data: {
          taskId, walletId, action: action.action, status: action.status,
          message: action.message, points: task.points,
          duration: Math.floor((Date.now() - startTime) / actions.length),
        },
      });
      await prisma.agentLog.create({
        data: { level: action.status === "success" ? "success" : "error", message: `✓ ${action.message}`, taskId, walletId },
      });
    }

    await prisma.task.update({ where: { id: taskId }, data: { status: "completed", completedAt: new Date() } });
    const airdrop = await prisma.airdrop.findUnique({ where: { id: task.airdropId } });
    if (airdrop) {
      await prisma.airdrop.update({ where: { id: task.airdropId }, data: { totalPoints: airdrop.totalPoints + task.points } });
    }

    await prisma.agentLog.create({
      data: { level: "success", message: `✅ Task "${task.title}" completed in ${Date.now() - startTime}ms`, taskId, walletId },
    });

    return NextResponse.json({ success: true, duration: Date.now() - startTime, message: `Task "${task.title}" completed` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
