import { IPagination } from "./common";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  submitted_at: string;
  isActive: boolean;
}

export interface ILeadResponse extends IPagination {
  data: Lead[];
}