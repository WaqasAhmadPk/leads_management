import { NextRequest, NextResponse } from 'next/server';
import { leads } from '../route';

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const lead = leads.find((l) => l.id === id);
  if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const body = await req.json();
  const leadIndex = leads.findIndex((l) => l.id === id);
  if (leadIndex === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  leads[leadIndex] = { ...leads[leadIndex], ...body };
  return NextResponse.json({ message: 'Lead updated successfully' });
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const leadIndex = leads.findIndex((l) => l.id === id);
  if (leadIndex === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  leads[leadIndex].isActive = false;
  return NextResponse.json({ message: 'Lead marked as inactive' });
}