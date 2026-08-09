export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET single account
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const account = await prisma.socialAccount.findUnique({ where: { id } });
    if (!account) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(account);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH - update / toggle active / test connection
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const account = await prisma.socialAccount.update({ where: { id }, data: body });

    await prisma.agentLog.create({
      data: {
        level: "info",
        message: `🔄 ${account.platform} account @${account.username} updated`,
        socialAccountId: id,
      },
    });

    return NextResponse.json(account);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const account = await prisma.socialAccount.findUnique({ where: { id } });
    await prisma.socialAccount.delete({ where: { id } });

    await prisma.agentLog.create({
      data: {
        level: "warn",
        message: `🔌 ${account?.platform} account @${account?.username} disconnected`,
        socialAccountId: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
