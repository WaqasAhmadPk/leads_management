import { ILeadResponse } from "@/types/leads";
import LeadsTable from "./_components/table";

export default async function LeadsPage({ searchParams }: { searchParams: Record<string, string> }) {
  const page = searchParams.page ?? '1';
  const limit = searchParams.limit ?? '10';

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/leads?page=${page}&limit=${limit}`, {
    cache: 'no-store',
    headers: { 'ngrok-skip-browser-warning': '69420' },
  });
  const leads: ILeadResponse = await res.json();

  return <LeadsTable data={leads} />;
}
 