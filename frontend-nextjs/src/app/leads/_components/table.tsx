'use client';

import { useEffect, useRef, useState } from 'react';
import { Table, Input, Select, DatePicker, Button, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isBetween from 'dayjs/plugin/isBetween';
import { ILeadResponse, Lead } from '@/types/leads';

dayjs.extend(utc);
dayjs.extend(isBetween);

const { RangePicker } = DatePicker;

interface IProps {
  data: ILeadResponse;
}

export default function LeadsTable({ data }: IProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [tableData, setTableData] = useState<ILeadResponse>(data);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [nameOrEmail, setNameOrEmail] = useState('');
  const [source, setSource] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  const isFirstMount = useRef(true);

  // Construct query string for API call
  const queryKey = searchParams.toString();

  useEffect(() => {
    const currentPage = Number(searchParams.get('page') ?? 1);
    const currentLimit = Number(searchParams.get('limit') ?? 10);

    setPage(currentPage);
    setLimit(currentLimit);

    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const query = new URLSearchParams({
          page: String(currentPage),
          limit: String(currentLimit),
        });

        const search = searchParams.get('searchQuery');
        if (search) {
          query.set('searchQuery', search);
        }

        if (searchParams.get('source')) {
          query.set('source', searchParams.get('source')!);
        }

        if (searchParams.get('submitted_at_from')) {
          query.set('submitted_at_from', searchParams.get('submitted_at_from')!);
        }

        if (searchParams.get('submitted_at_to')) {
          query.set('submitted_at_to', searchParams.get('submitted_at_to')!);
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/leads?${query.toString()}`, {
          cache: 'no-store',
          headers: { 'ngrok-skip-browser-warning': '69420' },
        });

        const json = await res.json();
        setTableData(json);
      } catch (err) {
        message.error('Failed to fetch leads');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [queryKey]);

  const handleTableChange = (newPage: number, newLimit: number) => {
    const query = new URLSearchParams(searchParams);
    query.set('page', String(newPage));
    query.set('limit', String(newLimit));
    router.push(`${pathname}?${query.toString()}`);
  };

  const handleFilters = () => {
    const query = new URLSearchParams();

    query.set('page', '1');
    query.set('limit', String(limit));

    if (nameOrEmail) {
      query.set('searchQuery', nameOrEmail);
    }

    if (source) {
      query.set('source', source);
    }

    if (dateRange) {
      query.set('submitted_at_from', dateRange[0].format('YYYY-MM-DD'));
      query.set('submitted_at_to', dateRange[1].format('YYYY-MM-DD'));
    }

    router.push(`${pathname}?${query.toString()}`);
  };

  const columns: ColumnsType<Lead> = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Phone', dataIndex: 'phone' },
    { title: 'Source', dataIndex: 'source' },
    {
      title: 'Submitted At',
      dataIndex: 'submitted_at',
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Button type="link" onClick={() => router.push(`/leads/${record.id}`)}>View</Button>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-semibold mb-6">Leads</h1>

      <div className="mb-6 flex flex-col sm:flex-row flex-wrap gap-4">
        <Input
          placeholder="Search by name/email"
          className="w-full sm:w-64"
          allowClear
          value={nameOrEmail}
          onChange={(e) => setNameOrEmail(e.target.value)}
        />
        
        <Input
          placeholder="Search by source"
          className="w-full sm:w-64"
          allowClear
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <RangePicker
          className="w-full sm:w-auto"
          value={dateRange}
          onChange={(range) => setDateRange(range as [dayjs.Dayjs, dayjs.Dayjs])}
        />
        <Button type="primary" className="w-full sm:w-auto" onClick={handleFilters}>
          Apply Filters
        </Button>
        <Button
          className="w-full sm:w-auto"
          onClick={() => {
            router.push(`${pathname}?page=1&limit=${limit}`);
            setNameOrEmail('');
            setSource(undefined);
            setDateRange(null);
          }}
        >
          Reset
        </Button>
      </div>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={tableData.data}
        pagination={{
          current: page,
          pageSize: limit,
          total: tableData.total,
          showSizeChanger: true,
          onChange: handleTableChange,
        }}
        scroll={{ x: true }}
      />
    </div>
  );
}
 