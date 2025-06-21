'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Form, Input, Select, DatePicker, message } from 'antd';
import AutoHideAlert from '../_components/alert';
import { useAlert } from '@/hooks/use-alert';

const { Item } = Form;
const { Option } = Select;

export default function NewLeadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const { show, alert, showAlert, hideAlert } = useAlert(4000);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          submitted_at: values.submitted_at.toISOString(),
        }),
      });

      const result = await res.json()
      console.log(result, res.status)

      if (res.status >= 200 && res.status < 300) {
        showAlert('success','Lead created', 'The lead has been created successfully');
        setTimeout(() => {
          router.push('/leads');
        }, 1000);
      } else {
        console.log(result?.message?.[0])
        showAlert('error','Error', result?.message?.[0] || 'Failed to create lead');
      }
    } catch (err) {
      message.error(`Error creating lead, ${err}` );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 w-full max-w-xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6">Add New Lead</h1>
      
      {alert && (
        <AutoHideAlert
          visible={show}
          type={alert.type}
          message={alert.message}
          description={alert.description}
          onClose={hideAlert}
        />
      )}
 
      
      {/* <Button type="primary" className="w-full sm:w-auto" onClick={() => message.error('Test Message')}>
          test message
      </Button> */}
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        validateTrigger={["onChange", "onBlur"]}
      >
        <Item name="name" label="Name" rules={[{ required: true, message: 'Please enter name' }]}> 
          <Input className="w-full" />
        </Item>
        <Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Enter valid email' }]}> 
          <Input className="w-full" />
        </Item>
        <Item name="phone" label="Phone" rules={[{ required: true, message: 'Please enter phone' }]}> 
          <Input className="w-full" />
        </Item>
        <Item name="source" label="Source" rules={[{ required: true, message: 'Select a source' }]}> 
          <Input className="w-full" />
        </Item>
        <Item name="submitted_at" label="Submitted At" rules={[{ required: true, message: 'Pick submission time' }]}> 
          <DatePicker showTime className="w-full" />
        </Item>
        <Item>
          <div className="flex justify-between items-center gap-4">
            <Button type="primary" onClick={() => router.push('/leads')} className="sm:w-auto">
              Back
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} className="sm:w-auto">
              Create
            </Button>
          </div>
        </Item>
      </Form>
    </div>
  );
}