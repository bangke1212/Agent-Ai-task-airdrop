export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { const {id}=await params;const b=await req.json();const t=await prisma.task.update({where:{id},data:b});return NextResponse.json(t);}
  catch(e:any){return NextResponse.json({error:e.message},{status:500});}
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { const {id}=await params;await prisma.task.delete({where:{id}});return NextResponse.json({success:true});}
  catch(e:any){return NextResponse.json({error:e.message},{status:500});}
}
