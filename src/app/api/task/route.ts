export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const airdropId = searchParams.get("airdropId");
    const status = searchParams.get("status");
    const where: any = {};
    if (airdropId) where.airdropId = airdropId;
    if (status) where.status = status;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        airdrop: { select: { projectName: true } },
        logs: { take: 5, orderBy: { createdAt: "desc" } },
      },
      orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(tasks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const task = await prisma.task.create({ data: body });
    return NextResponse.json(task, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
