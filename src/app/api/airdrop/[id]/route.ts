export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { const { id } = await params; const a = await prisma.airdrop.findUnique({ where: { id }, include: { tasks: { include: { logs: true }, orderBy: { priority: "asc" } } } }); if (!a) return NextResponse.json({ error: "Not found" }, { status: 404 }); return NextResponse.json(a); }
  catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { const { id } = await params; const body = await req.json(); const a = await prisma.airdrop.update({ where: { id }, data: body }); return NextResponse.json(a); }
  catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { const { id } = await params; await prisma.airdrop.delete({ where: { id } }); return NextResponse.json({ success: true }); }
  catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}
