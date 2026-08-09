export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try { const wallets = await prisma.wallet.findMany({ orderBy: { createdAt: "desc" } }); return NextResponse.json(wallets); }
  catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}
export async function POST(req: NextRequest) {
  try { const body = await req.json(); const w = await prisma.wallet.create({ data: body }); return NextResponse.json(w, { status: 201 }); }
  catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}
