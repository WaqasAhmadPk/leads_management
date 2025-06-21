import { NextRequest, NextResponse } from 'next/server';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  submitted_at: string;
  isActive: boolean;
}

export let leads: Lead[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+123456789',
    source: 'Google',
    submitted_at: '2024-06-01T12:00:00Z',
    isActive: true
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+987654321',
    source: 'Facebook',
    submitted_at: '2024-06-02T14:30:00Z',
    isActive: true
  }
];

export async function GET(req: NextRequest) {
  return NextResponse.json({
    data: leads,
    total: leads.length,
    page: 1,
    pageSize: 10
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newLead: Lead = {
    id: String(leads.length + 1),
    ...body,
    isActive: true
  };
  leads.push(newLead);
  return NextResponse.json({ message: 'Lead created successfully', id: newLead.id });
}