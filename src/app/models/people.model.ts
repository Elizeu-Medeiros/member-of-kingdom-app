import { Members } from "./member.model";
import { TypePeople } from "./typePeople.model";
import { User } from "./user.model";

export interface People {
  uuid_people?: string,
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
  photoUrl?: string,
  church_id?: string,
  type_people?: TypePeople,
  member?: Members,
  user?: User,
}

export interface PeoplesResponse {
  message: string;
  data: People[];
}


