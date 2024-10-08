import { Churches } from "./churches.model";
import { TypePeople } from "./typePeople.model";
import { User } from "./user.model";

export interface People {
  name_full: string,
  type_people_id?: string,
  user_id?: string,
  document?: string,
  phone?: string,
  email?: string,
  cell_phone?: string,
  photo?: string;
  birth_date?: string,
  gender?: 'm' | 'f' | string,
  church_id?: string,
  type_people?: TypePeople,
  church?: Churches,
  user?: User
  photoUrl?: string;
}

export interface PeoplesResponse {
  message: string;
  data: People[];
}


