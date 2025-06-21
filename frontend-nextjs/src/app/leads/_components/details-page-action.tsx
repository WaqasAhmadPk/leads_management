"use client"

import { Button, message } from "antd"
import Link from "next/link"
import { useRouter, useParams } from 'next/navigation';

export default function DetailsPageAction({id}: {id:string}) {

    const router = useRouter();
    const handleDelete = async (id: string) => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/leads/${id}`, {
            method: 'DELETE',
          });
      
          const result = await res.json()
          if (res.status >= 200 && res.status < 300) {
            message.success('Lead Deleted');
            router.push(`/leads`);
          } else {
            console.log(result?.message?.[0])
            message.error(result?.message?.[0] || 'Failed to delete lead');
            alert(result?.message?.[0] || 'Failed to delete lead');
          }
        } catch (err) {
          message.error('Error deleting lead');
        }
      };

    return (
        <div className="flex justify-between items-center gap-4 m-2">
            {/* Left Side: Back Button */}
            <Link href="/leads">
              <Button type="primary">Back</Button>
            </Link>
      
            {/* Right Side: Edit + Delete */}
            <div className="flex gap-2">
              <Button type="primary" danger onClick={() => handleDelete(id)}>
                Delete
              </Button>
              <Link href={`/leads/${id}/edit`}>
                <Button type="primary">Edit</Button>
              </Link>
            </div>
            </div>
    )
}