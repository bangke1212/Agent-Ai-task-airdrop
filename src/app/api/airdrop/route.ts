export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (priority) where.priority = priority;
    if (search) {
      where.OR = [
        { projectName: { contains: search } },
        { description: { contains: search } },
        { tokenSymbol: { contains: search } },
      ];
    }

    const airdrops = await prisma.airdrop.findMany({
      where,
      include: {
        tasks: { select: { id: true, status: true, points: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(airdrops);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const airdrop = await prisma.airdrop.create({ data: body });
    return NextResponse.json(airdrop, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
