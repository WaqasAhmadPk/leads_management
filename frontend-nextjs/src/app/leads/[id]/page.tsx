import dayjs from 'dayjs';
import { Button, Descriptions, message } from 'antd';
import Link from 'next/link';
import DetailsPageAction from '../_components/details-page-action';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  submitted_at: string;
  isActive: boolean;
}

async function getLead(id: string): Promise<Lead | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const res = await fetch(`${baseUrl}/api/leads/${id}`, {
    // next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  
  const lead = await getLead(params?.id);

  if (!lead) return <div className="p-6 text-red-500">Lead not found.</div>

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Lead Details</h1>
      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="Name">{lead.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{lead.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{lead.phone}</Descriptions.Item>
        <Descriptions.Item label="Source">{lead.source}</Descriptions.Item>
        <Descriptions.Item label="Submitted At">
          {dayjs(lead.submitted_at).format('YYYY-MM-DD HH:mm')}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          {lead.isActive ? 'Active' : 'Inactive'}
        </Descriptions.Item>
      </Descriptions>
    
    <DetailsPageAction id={lead.id}/>
     


    </div>
  );
}
