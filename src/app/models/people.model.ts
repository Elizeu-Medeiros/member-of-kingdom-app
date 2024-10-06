export interface People {
  name_full: string,
  type_people_id?: string,
  user_id?: string,
  document?: string,
  phone?: string,
  cell_phone?: string,
  photo?: string,
  birth_date?: string,
  gender?: 'm' | 'f' | string,
  church_id?: string
}

export interface PeoplesResponse {
  message: string;
  data: People[];
}


