export interface People {
  id: number,
  uuid_people?: string,
  type_people_id: number,
  name_full: string,
  user_id?: number,
  document?: string,
  phone?: string,
  cell_phone?: string,
  photo?: string,
  birth_date?: string,
  gender?: 'm' | 'f' | string;
  email: string,
  previous_type?: number | null,
  type: { id: number; description: string; },
  change_date?: string,
  change_reason?: string | null,
}


