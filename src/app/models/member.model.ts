import { Churches } from "./churches.model";

export interface Members {
  uuid_member: string,
  church_id: string,
  people_id: string,
  status?: number,
  baptism_date?: string,
  notes: string,
  church?: Churches,
}

export interface MembersResponse {
  message: string;
  data: Members[];
}
