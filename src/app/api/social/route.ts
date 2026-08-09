export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const accounts = await prisma.socialAccount.findMany({
      orderBy: [{ platform: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(accounts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { platform, username, displayName, avatarUrl, accessToken, refreshToken, proxy, metadata } = body;

    // Cek duplicate
    const existing = await prisma.socialAccount.findFirst({
      where: { platform, username },
    });
    if (existing) {
      return NextResponse.json({ error: "Account already exists" }, { status: 409 });
    }

    const account = await prisma.socialAccount.create({
      data: {
        userId: "default", // TODO: ganti dengan real user ID setelah auth
        platform,
        username,
        displayName: displayName || username,
        avatarUrl,
        accessToken,
        refreshToken,
        proxy,
        metadata: metadata ? JSON.stringify(metadata) : null,
        isConnected: true,
      },
    });

    // Log agent activity
    await prisma.agentLog.create({
      data: {
        level: "success",
        message: `🔗 New ${platform} account connected: @${username}`,
        socialAccountId: account.id,
      },
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
