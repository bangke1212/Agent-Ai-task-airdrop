export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { const {id}=await params;const body=await req.json();const w=await prisma.wallet.update({where:{id},data:body});return NextResponse.json(w);}
  catch(e:any){return NextResponse.json({error:e.message},{status:500});}
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { const {id}=await params;await prisma.wallet.delete({where:{id}});return NextResponse.json({success:true});}
  catch(e:any){return NextResponse.json({error:e.message},{status:500});}
}
