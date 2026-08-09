export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const airdropId = searchParams.get("airdropId"); const status = searchParams.get("status");
    const where: any = {}; if (airdropId) where.airdropId = airdropId; if (status) where.status = status;
    const tasks = await prisma.task.findMany({ where, include: { airdrop: { select: { projectName: true } }, logs: { take: 5, orderBy: { createdAt: "desc" } } }, orderBy: [{ priority: "asc" }, { createdAt: "desc" }] });
    return NextResponse.json(tasks);
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
export async function POST(req: NextRequest) {
  try { const body = await req.json(); const t = await prisma.task.create({ data: body }); return NextResponse.json(t, { status: 201 }); }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
