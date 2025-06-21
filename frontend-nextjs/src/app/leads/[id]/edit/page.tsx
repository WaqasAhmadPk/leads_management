'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Form, Input, Select, DatePicker, message } from 'antd';
import dayjs from 'dayjs';

const { Item } = Form;
const { Option } = Select;

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  submitted_at: string;
  isActive: boolean;
}

export default function EditLeadPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<Lead | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  useEffect(() => {
    const fetchLead = async () => {
      const res = await fetch(`${baseUrl}/api/leads/${id}`);
      const data = await res.json();
      if (res.ok) {
        setInitialData(data);
        form.setFieldsValue({ ...data, submitted_at: dayjs(data.submitted_at) });
      } else {
        message.error('Failed to load lead');
      }
    };
    fetchLead();
  }, [id]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, submitted_at: values.submitted_at.toISOString() }),
      });

      const result = await res.json()
      console.log(result, res.status)

      if (res.status >= 200 && res.status < 300) {
        message.success('Lead updated');
        router.push(`/leads/${id}`);
      } else {
        console.log(result?.message?.[0])
        message.error(result?.message?.[0] || 'Failed to update lead');
        alert(result?.message?.[0] || 'Failed to update lead');
      }
    } catch {
      message.error('Failed to update lead');
    } finally {
      setLoading(false);
    }
  };

  if (!initialData) return null;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Edit Lead</h1>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        validateTrigger={['onChange', 'onBlur']}
      >
        <Item name="name" label="Name" rules={[{ required: true, message: 'Please enter name' }]}> 
          <Input />
        </Item>
        <Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Enter valid email' }]}> 
          <Input />
        </Item>
        <Item name="phone" label="Phone" rules={[{ required: true, message: 'Please enter phone' }]}> 
          <Input />
        </Item>
        <Item name="source" label="Source" rules={[{ required: true, message: 'Select a source' }]}> 
          <Input />
        </Item>
        <Item name="submitted_at" label="Submitted At" rules={[{ required: true, message: 'Pick submission time' }]}> 
          <DatePicker showTime />
        </Item>
        <Item>
          <div className="flex justify-between items-center gap-4">
            <Button type="primary" onClick={() => router.push(`/leads/${id}`)} className="sm:w-auto">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} className="sm:w-auto">
              Update
            </Button>
          </div>
        </Item>
      </Form>
    </div>
  );
}
