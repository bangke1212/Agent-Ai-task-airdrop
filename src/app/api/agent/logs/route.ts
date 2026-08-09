export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET(req: NextRequest) {
  try { const { searchParams } = new URL(req.url); const limit = parseInt(searchParams.get("limit") || "50"); const level = searchParams.get("level"); const where: any = {}; if (level) where.level = level; const logs = await prisma.agentLog.findMany({ where, orderBy: { createdAt: "desc" }, take: limit }); return NextResponse.json(logs); }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
